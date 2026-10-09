import dotenv from 'dotenv'; dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import compression from 'compression';
import router from './routes/index.routes.js';
import config from "./config/config.js";
import {cleanupTmpDir} from "./middlewares/upload.middleware.js"
import { leakyBucketRateLimiter } from './middlewares/rateLimit.middleware.js';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import {errorHandler} from './middlewares/error.middleware.js';


const app = express();
cleanupTmpDir();
// Trust proxies if behind Render/NGINX
app.set('trust proxy', 1);

// Security & perf middlewares
app.use(helmet());
app.use(cors({ origin: `${config.origin}`, credentials: true, methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], }));
app.use(compression());

// Configure Redis-backed leaky bucket rate limiter
app.use(leakyBucketRateLimiter({
    maxRequests: 100,
    windowMs: 5 * 60 * 1000,
    message: 'Too many requests, please try again later.',
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"))
app.use(passport.initialize());


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  console.log('profile',profile)
  return done(null, profile);
}));

// Basic request logging (dev only)
if (config.nodeEnv !== 'production') {
    app.use(morgan('dev'));
}

// API routes
app.use('/api', router);
app.use(errorHandler);

export default app;