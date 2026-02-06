import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import bookingRoutes from './routes/bookings.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: true, // Reflect request origin
    credentials: true,
    exposedHeaders: ['set-cookie']
}));
app.use(cookieParser());

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('--- DB CONNECTION TROUBLESHOOTING ---');
        console.log('1. Check if your IP is whitelisted in MongoDB Atlas (Network Access tab).');
        console.log('2. Check if MONGO_URI in server/.env is correct and includes the password.');
        console.log('3. Ensure your database name (etukas) is correctly specified in the URI.');
        console.log('--------------------------------------');
        // Do not exit process, let express run so it can return 500 errors to client
    }
};


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Etukas API is running...');
});

// Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
