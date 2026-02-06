import mongoose from 'mongoose';
import Listing from './Listing.js';

const serviceSchema = new mongoose.Schema({
    hourlyRate: Number,
    dailyRate: Number,
    visitCharge: {
        type: Number,
        default: 0
    },
    experienceYears: Number,
    skills: [String],
    availability: {
        type: String, // e.g., 'Mon-Fri', 'Weekends'
        default: 'All Days'
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

const Service = Listing.discriminator('Service', serviceSchema);
export default Service;
