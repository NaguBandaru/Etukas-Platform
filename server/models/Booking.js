import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    date: {
        type: Date,
        required: true
    },
    // For services/machines, we might need days/hours
    duration: {
        type: Number, // in days or hours based on listing type
        default: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    notes: String,
    customerLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number] // [lng, lat]
    },

    // For Products (Orders) - reusing same schema or separate?
    // The prompt asked for "Orders" and "Bookings" separately in deliverables but "Transactions" phase suggests unification or similarity.
    // Let's keep this as "Booking" essentially for Services/Machines.
    // For Products, we might just call them Orders.
    // However, to keep it simple for MVP, we can use this for everything or separate.
    // Let's create a separate Order schema for Products later if needed, or stick to this for Time-based stuff.
    // The user requirement said: "Workers... Schedule date & time", "Machinery... Availability calendar".

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Booking', bookingSchema);
