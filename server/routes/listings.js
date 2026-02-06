import express from 'express';
import {
    getListings,
    getListing,
    createListing,
    updateListing,
    deleteListing
} from '../controllers/listingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router
    .route('/')
    .get(getListings)
    .post(protect, authorize('seller', 'worker', 'owner', 'admin'), createListing);

router
    .route('/:id')
    .get(getListing)
    .put(protect, authorize('seller', 'worker', 'owner', 'admin'), updateListing)
    .delete(protect, authorize('seller', 'worker', 'owner', 'admin'), deleteListing);

export default router;
