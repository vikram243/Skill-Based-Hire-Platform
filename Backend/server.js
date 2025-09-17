import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));