import mongoose from 'mongoose';
import config from './config.js';
import { asyncHandler } from '../utils/async.handeller.js';

const connectDB = asyncHandler(async (req, res, next) => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log("⚡ MongoDB already connected");
        return;
    }

    // If not connected, try to connect
    const connectionInstance = await mongoose.connect(
        `${config.mongo.uri}/${config.mongo.dbName}`,
        { serverSelectionTimeoutMS: 5000 }
    );

    console.log(
        `✅ Database connected: ${connectionInstance.connection.host}/${connectionInstance.connection.name}`
    );
});

const gracefullShutdown = asyncHandler(async (signal) => {
    await mongoose.connection.close();
    console.log(`⚠️ MongoDB connection closed due to ${signal}`);
    process.exit(0);
});

// Handle shutdown signals
process.on("SIGINT", () => gracefullShutdown("app termination (SIGINT)"));
process.on("SIGTERM", () => gracefullShutdown("app termination (SIGTERM)"));

export { connectDB, gracefullShutdown };