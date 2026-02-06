import mongoose from 'mongoose';
import Listing from './Listing.js';

const productSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    unit: {
        type: String, // e.g., 'kg', 'ton', 'bag', 'piece'
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    brand: String,
    specifications: {
        type: Map,
        of: String
    }
});

const Product = Listing.discriminator('Product', productSchema);
export default Product;
