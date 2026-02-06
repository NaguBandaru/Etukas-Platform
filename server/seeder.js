import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Service from './models/Service.js';
import Machine from './models/Machine.js';
import Listing from './models/Listing.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
    try {
        await User.deleteMany();
        await Listing.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        const sellerUser = createdUsers[1]._id;

        const sampleProducts = products.map(product => {
            return { ...product, user: sellerUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Listing.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
