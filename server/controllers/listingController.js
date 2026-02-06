import Listing from '../models/Listing.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Machine from '../models/Machine.js';

// @desc    Get all listings (with filters & search)
// @route   GET /api/listings
// @access  Public
export const getListings = async (req, res) => {
    try {
        let query;

        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit', 'lat', 'lng', 'distance'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        let dbQuery = JSON.parse(queryStr);

        // Geospatial Logic
        if (req.query.lat && req.query.lng) {
            const lat = parseFloat(req.query.lat);
            const lng = parseFloat(req.query.lng);
            const distance = parseFloat(req.query.distance) || 10; // Default 10km

            // Use $near (requires 2dsphere index)
            // Note: $near outputs sorted by distance
            dbQuery.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    $maxDistance: distance * 1000 // Convert km to meters
                }
            };
        }

        query = Listing.find(dbQuery).populate('user', 'name phone');

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort (If not using $near)
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else if (!dbQuery.location) {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Listing.countDocuments(dbQuery);

        query = query.skip(startIndex).limit(limit);

        const listings = await query;

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: listings.length,
            pagination,
            data: listings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('user', 'name phone');

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json({ success: true, data: listing });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Seller/Worker/Owner)
export const createListing = async (req, res) => {
    try {
        const { type, title, description, category, latitude, longitude, address } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, message: 'Latitude and Longitude are required for matching with nearby customers' });
        }

        const listingData = {
            user: req.user.id,
            type,
            title,
            description,
            category,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
                formattedAddress: address
            }
        };

        let listing;
        if (type === 'product') {
            listing = await Product.create({
                ...listingData,
                price: req.body.price,
                unit: req.body.unit,
                stock: req.body.stock,
                brand: req.body.brand
            });
        } else if (type === 'service') {
            listing = await Service.create({
                ...listingData,
                hourlyRate: req.body.hourlyRate,
                dailyRate: req.body.dailyRate,
                visitCharge: req.body.visitCharge,
                experienceYears: req.body.experienceYears,
                skills: req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : []
            });
        } else if (type === 'machine') {
            listing = await Machine.create({
                ...listingData,
                hourlyRate: req.body.hourlyRate,
                perFeetRate: req.body.perFeetRate,
                modelName: req.body.modelName,
                capacity: req.body.capacity
            });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid listing type' });
        }

        res.status(201).json({ success: true, data: listing });
    } catch (error) {
        console.error('Create Listing Error:', error);

        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message });
        }

        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
export const updateListing = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Make sure user is listing owner
        if (listing.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this listing' });
        }

        listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: listing });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this listing' });
        }

        await listing.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
