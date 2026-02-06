import Order from '../models/Order.js';
import Listing from '../models/Listing.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = await Order.create({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress
        });

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get orders for seller listings
// @route   GET /api/orders/seller
// @access  Private
export const getSellerOrders = async (req, res) => {
    try {
        // Find orders where at least one item's seller is the logged in user
        const orders = await Order.find({
            'items.seller': req.user.id
        }).populate('user', 'name phone').sort('-createdAt');

        // Filter items within orders to only show those belonging to this seller
        const sellerOrders = orders.map(order => {
            const transformedOrder = order.toObject();
            transformedOrder.items = transformedOrder.items.filter(item => item.seller.toString() === req.user.id);
            return transformedOrder;
        });

        res.status(200).json({ success: true, data: sellerOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if any item belongs to this seller
        const isSeller = order.items.some(item => item.seller.toString() === req.user.id);

        if (!isSeller && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
