import express from 'express';
import {
    createBooking,
    getMyBookings,
    getSellerBookings,
    updateBookingStatus
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All booking routes are protected

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/seller', authorize('seller', 'worker', 'owner', 'admin'), getSellerBookings);
router.put('/:id', updateBookingStatus);

export default router;
