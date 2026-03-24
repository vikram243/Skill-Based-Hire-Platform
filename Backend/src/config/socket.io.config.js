import { Server } from 'socket.io';
import origin from './config.js';
import jwt from 'jsonwebtoken';

let io = null;

function initializeSocket(server) {
    if (io) return io;
    console.log('Initializing socket.io...');
    io = new Server(server, {
        cors: {
            origin: origin?.origin ? origin.origin.split(',') : true,
            credentials: true,
            methods: ['GET', 'POST'],
        },
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Unauthorized: Token missing"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Attach user data to socket
            next();
        } catch (err) {
            console.error("Socket Auth Error:", err.message);
            next(new Error("Unauthorized"));
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);
        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
    return io;
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

export { initializeSocket, getIO };