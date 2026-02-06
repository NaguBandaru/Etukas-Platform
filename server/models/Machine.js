import mongoose from 'mongoose';
import Listing from './Listing.js';

const machineSchema = new mongoose.Schema({
    hourlyRate: Number, // Now represents the rate value regardless of unit
    machineRateUnit: {
        type: String,
        enum: ['hour', 'day', 'feet', 'meter', 'trip', 'load'],
        default: 'hour'
    },
    perFeetRate: Number, // Legacy field, keeping for backward compatibility
    modelName: String,
    capacity: String, // e.g., "10 Tons"
    ownerOperator: {
        type: Boolean,
        default: true
    }
});


const Machine = Listing.discriminator('Machine', machineSchema);
export default Machine;
