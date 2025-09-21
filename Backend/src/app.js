import dotenv from 'dotenv'; dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import compression from 'compression';
import router from './routes/index.routes.js';
import config from "./config/config.js";
import redisClient from './config/redis.config.js';
import rateLimit from 'express-rate-limit';


let RedisStore;
try {
    RedisStore = (await import('rate-limit-redis')).default;
} catch (err) {
    RedisStore = null;
}

const app = express();
// Trust proxies if behind Render/NGINX
app.set('trust proxy', 1);

// Security & perf middlewares
app.use(helmet());
app.use(cors({ origin: config.origin, credentials: true }));
app.use(compression());

// Configure rate limiter (use Redis if available, otherwise memory store)
const limiterOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
};

if (RedisStore && redisClient) {
    try {
        app.use(rateLimit({
            ...limiterOptions,
            store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
        }));
        console.log('✅ Rate limiter: using Redis store');
    } catch (err) {
        console.error('⚠️ Failed to initialize Redis rate limiter, falling back to memory store:', err);
        app.use(rateLimit(limiterOptions));
    }
} else {
    app.use(rateLimit(limiterOptions));
    console.log('✅ Rate limiter: using in-memory store');
}

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic request logging (dev only)
if (config.nodeEnv !== 'production') {
    app.use(morgan('dev'));
}

// API routes
app.use('/api', router);

export default app;