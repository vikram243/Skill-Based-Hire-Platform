import mongoose from 'mongoose';
import config from './config.js';
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${config.mongo.uri}/${config.mongo.dbName}`, {
            serverSelectionTimeoutMS: 5000,
        })
        console.log(`Database connected ${connectionInstance.connection.host}/${connectionInstance.connection.name}`)
    } catch (error) {
        console.log("Database connection failure :", error);
        process.exit(1);
    }
}

const gracefullShutdown = async (signal) => {
    try {
        await mongoose.connection.close();
        console.log(`mongodb connection close due to ${signal}`);
        process.exit(0);
    } catch (error) {
        console.log("error whille closing mongodb connection :", error);
        process.exit(1);
    }
}

process.on("SIGINT", () => gracefullShutdown("app termination (SIGINT)"))
process.on("SIGTERM", () => gracefullShutdown("app termination (SIGTERM)"))

export default connectDB;