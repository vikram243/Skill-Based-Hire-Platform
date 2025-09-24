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
    cloudSecretKey : process.env.CLOUDINARY_API_SECRET,
    jwtSecret : process.env.JWT_SECRET,
    jwtTokenExpiry : process.env.JWT_TOKEN_EXPIRY,
    googleClientId : process.env.GOOGLE_CLIENT_ID,
    googleClientSecret : process.env.GOOGLE_CLIENT_SECRET
}

export default config;