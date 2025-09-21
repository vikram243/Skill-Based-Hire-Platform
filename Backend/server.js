import http from "http";
import {connectDB, gracefullShutdown} from "./src/config/db.config.js"
import config from "./src/config/config.js";
import app from "./src/app.js";
import { initializeSocket } from "./src/config/socket.io.config.js";

const PORT = config.port;

(async () => {
    try {
        await connectDB();

        // Create HTTP server & attach app
        let server = http.createServer(app);

        // Initialize socket.io
        console.log('Setting up socket.io');
        const io = initializeSocket(server);
        if (!io) {
            throw new Error('Failed to initialize socket.io');
        }

        // Make io available to the app (if controllers need to emit)
        app.set('io', io);

        server.listen(PORT, () => {
            console.log(`✅ Server listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
})();

// Graceful shutdown
const shutdown = async (signal) => {
    try {
        console.log(`\n${signal} received. Shutting down gracefully...`);
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        // Use the DB module's graceful shutdown helper (it will close the connection and exit)
        await gracefullShutdown(signal);
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED REJECTION', reason);
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION', err);
    process.exit(1);
});