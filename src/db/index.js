import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})

import mongoose from 'mongoose';

const connectDB = async () => {
    const uri = process.env.MONGODB_URI; 
   

    if (!uri) {
        console.error('MONGO_URI is not defined in your .env file');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};


export default connectDB;
