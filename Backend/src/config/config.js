import dotenv from "dotenv";
dotenv.config();

const config = {
    port : process.env.port || 5000,
    mongo:{
        uri:process.env.MONGODB_URI,
        dbName:process.env.DB_NAME
    },
    origin:process.env.CORS_ORIGIN,
    cloudName : process.env.CLOUDINARY_CLOUD_NAME,
    cloudApiKey : process.env.CLOUDINARY_API_KEY,
    cloudSecretKey : process.env.CLOUDINARY_API_SECRET
}

export default config;