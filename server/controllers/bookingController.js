import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';

// @desc    Create a new booking (Service/Machine)
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const { listingId, date, duration, notes, customerLocation } = req.body;

        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Calculate Price based on type
        let totalPrice = 0;
        if (listing.type === 'service') {
            totalPrice = listing.dailyRate * (duration || 1) + (listing.visitCharge || 0);
        } else if (listing.type === 'machine') {
            totalPrice = listing.hourlyRate * (duration || 1);
        }

        const booking = await Booking.create({
            user: req.user.id,
            listing: listingId,
            seller: listing.user,
            date,
            duration,
            totalPrice,
            notes,
            customerLocation: customerLocation || null
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my bookings (as customer)
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('listing', 'title images type')
            .populate('seller', 'name phone')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get bookings for my listings (as seller/worker)
// @route   GET /api/bookings/seller
// @access  Private
export const getSellerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ seller: req.user.id })
            .populate('listing', 'title')
            .populate('user', 'name phone')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only seller can update status? Or maybe customer can cancel?
        // Simple rule: Seller updates status, Customer can only cancel if pending.

        if (booking.seller.toString() !== req.user.id && booking.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
