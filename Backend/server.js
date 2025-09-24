import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { Server } from "socket.io";
import connectDB from "./src/config/db.config.js"
import config from "./src/config/config.js";
import userRouter from './src/routes/user.routes.js';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: config.origin } });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
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

connectDB()


app.use("/api/users",userRouter);


app.get("/", (req, res) => {
  res.send(`<h1>Home</h1><a href="/auth/google">Login With Google</a>`);
});

const PORT = config.port;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));