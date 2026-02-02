import mongoose from 'mongoose';
import config from './config.js';
import dns from 'dns';

// Set custom DNS servers to avoid potential DNS resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
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
    } catch (error) {
        console.log("❌ Database connection failure:", error);
        process.exit(1);
    }
};

const gracefullShutdown = async (signal) => {
    try {
        await mongoose.connection.close();
        console.log(`⚠️ MongoDB connection closed due to ${signal}`);
        process.exit(0);
    } catch (error) {
        console.log("❌ Error while closing MongoDB connection:", error);
        process.exit(1);
    }
};

// Handle shutdown signals
process.on("SIGINT", () => gracefullShutdown("app termination (SIGINT)"));
process.on("SIGTERM", () => gracefullShutdown("app termination (SIGTERM)"));

export { connectDB, gracefullShutdown };
