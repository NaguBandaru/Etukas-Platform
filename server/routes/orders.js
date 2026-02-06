import express from 'express';
import {
    createOrder,
    getMyOrders,
    getSellerOrders,
    updateOrderStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/seller', getSellerOrders);
router.put('/:id', updateOrderStatus);

export default router;
