import dotenv from "dotenv";
dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    mongo: {
        uri: process.env.MONGODB_URI,
        dbName: process.env.DB_NAME
    },
    origin: process.env.CORS_ORIGIN,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudApiKey: process.env.CLOUDINARY_API_KEY,
    cloudSecretKey: process.env.CLOUDINARY_API_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    jwtTokenExpiry : process.env.JWT_TOKEN_EXPIRY,
    googleClientId : process.env.GOOGLE_CLIENT_ID,
    googleClientSecret : process.env.GOOGLE_CLIENT_SECRET,
    redis: {
        username: process.env.REDIS_USERNAME,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD || null,
    },
    EmailUser: process.env.EMAIL_USER,
    EmailPass: process.env.EMAIL_PASS
}

export default config;