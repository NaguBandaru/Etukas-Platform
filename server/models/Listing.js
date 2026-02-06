import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    // Type of listing determines which sub-fields are relevant
    type: {
        type: String,
        enum: ['product', 'service', 'machine'],
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        index: true
    },
    images: {
        type: [String],
        default: [] // URLs to images
    },
    // Geospatial Data - CRITICAL for specific feature
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        formattedAddress: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    discriminatorKey: 'kind',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

listingSchema.index({ location: '2dsphere' });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
