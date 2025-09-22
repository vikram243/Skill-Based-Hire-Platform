import { Server } from 'socket.io';
import origin from './config.js';

let io = null;

function initializeSocket(server) {
    if (io) return io;
    console.log('Initializing socket.io...');
    io = new Server(server, {
        cors: {
            origin: origin.origin ? origin.origin.split(',') : true,
            credentials: true,
            methods: ['GET', 'POST'],
        },
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