import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { Server } from "socket.io";
import connectDB from "./src/config/db.config.js"
import config from "./src/config/config.js";

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
connectDB()


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = config.port;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));