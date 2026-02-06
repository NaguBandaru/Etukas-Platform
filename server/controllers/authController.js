import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    console.log('Registration attempt:', req.body);
    try {
        const { name, email, password, role, phone, sellerCategory } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Handle categories as an array
        let categories = [];
        if (role === 'seller') {
            if (Array.isArray(sellerCategory)) {
                categories = sellerCategory;
            } else if (typeof sellerCategory === 'string') {
                categories = [sellerCategory];
            } else {
                categories = ['Cement']; // Default
            }
        }

        let sellerId = undefined;
        if (role === 'seller') {
            // Generate id based on the first selected category
            const primaryCategory = categories[0] || 'Cement';
            const categoryLetter = primaryCategory.charAt(0).toUpperCase();
            const prefix = `SE${categoryLetter}`;

            // Find the last seller with this prefix
            const lastSeller = await User.findOne({ sellerId: new RegExp(`^${prefix}`) })
                .sort({ sellerId: -1 });

            let series = 1;
            if (lastSeller && lastSeller.sellerId) {
                const lastSeriesStr = lastSeller.sellerId.replace(prefix, '');
                const lastSeries = parseInt(lastSeriesStr);
                if (!isNaN(lastSeries)) {
                    series = lastSeries + 1;
                }
            }

            sellerId = `${prefix}${series.toString().padStart(4, '0')}`;
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            sellerId,
            sellerCategory: categories
        });

        if (user) {
            sendTokenResponse(user, 201, res);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);

        // Handle Mongoose Validation Error
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message });
        }

        // Handle Duplicate Key Error
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Duplicate field value entered' });
        }

        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        console.log(`User found for ${email}:`, !!user);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        console.log(`Password match for ${email}:`, isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};


// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, data: {} });
};

// Helper function to get token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerId: user.sellerId
            }
        });
};
