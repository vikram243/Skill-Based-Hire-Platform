
# Skill-Based Hire Platform — Backend

This repository contains the backend service for the Skill-Based Hire Platform. It's an Express.js application that implements authentication, user and skill management, orders and payments, notifications, file uploads (Cloudinary), and socket-based real-time features.

## Contents

- `server.js` — Entrypoint that starts the HTTP server.
- `src/app.js` — Express application setup (middleware, routes, error handlers).
- `src/config/` — Configuration for database, Cloudinary, and Redis.
- `src/controllers/` — Route handlers (auth, user, skill, order, payment, notification).
- `src/models/` — Mongoose models (user, skill, order, payment, notification, cart).
- `src/routes/` — Express routes registration.
- `src/middlewares/` — Custom middleware (auth, error handling, async wrapper, upload handling).
- `src/sockets/` — Socket.IO handlers for chat and notifications.
- `src/utils/` — Utilities like email handling, geolocation helpers, and a job queue.

## Quick start

Prerequisites:

- Node.js 14+ (LTS recommended)
- npm or yarn
- MongoDB (connection URI)
- Redis (optional; used for job queue/notifications)
- Cloudinary account (for file uploads)

1. Clone the repo and change directory to the backend folder:

	cd "c:\Users\Asus\OneDrive\Documents\Web-learning\Skill-Based Hire Platform\Backend"

2. Install dependencies:

	npm install

3. Create a `.env` file in the backend folder (copy `.env.example` or use the variables below).

4. Start the server in development mode:

	npm run dev

Or start in production mode:

	npm start

## Environment variables

The app expects several environment variables. Create a `.env` file with at least the following keys:

- PORT=3000
- NODE_ENV=development
- MONGODB_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- JWT_EXPIRES_IN=1d
- CLOUDINARY_CLOUD_NAME=...
- CLOUDINARY_API_KEY=...
- CLOUDINARY_API_SECRET=...
- REDIS_URL=redis://localhost:6379 (optional)
- EMAIL_SERVICE (if using email utils)
- EMAIL_USER
- EMAIL_PASS

Adjust values according to your environment and secrets management practice.

## Scripts

- `npm start` — Start the server (production).
- `npm run dev` — Start the server with nodemon for development.
- `npm run lint` — Run ESLint (if configured).

Check `package.json` for additional scripts.

## Key features

- Authentication (signup/login) with JWT.
- Role-based access middleware.
- Skill CRUD and search APIs.
- Order and payment handling with payment controller (integrate with provider).
- Notifications stored in MongoDB and optionally emitted via Socket.IO.
- File upload middleware using Cloudinary config.
- Background jobs using a simple job queue utility.

## Architecture notes

- The project uses Express.js and Mongoose for a RESTful API.
- Sockets are handled via Socket.IO in `src/sockets/` and are wired to the server entrypoint.
- Configuration files under `src/config/` centralize third-party service settings.
- Controllers contain business logic and call models and utils; middlewares handle auth and error flow.

## Development tips

- Keep sensitive credentials out of source control — use `.env` and a secrets manager for production.
- Use Postman or HTTP client to exercise routes. The routes are defined in `src/routes/`.
- If using Cloudinary, ensure `src/config/cloudinary.config.js` is populated and working before testing uploads.
- Run MongoDB locally or use a managed DB (MongoDB Atlas) for easier setup.

## Testing

There are no tests included by default. Recommended next steps:

- Add unit tests for controllers and utils with Jest or Mocha.
- Add integration tests for API endpoints using Supertest.

## Deployment

- For production, set `NODE_ENV=production` and ensure all environment variables are provided.
- Use a process manager like PM2, or deploy to a container/orchestration platform (Docker, Kubernetes).
- Ensure MongoDB and Redis are reachable from the deployment environment.

## Troubleshooting

- Server won't start: check `MONGODB_URI` and other required env vars.
- Uploads failing: verify Cloudinary credentials in `src/config/cloudinary.config.js`.
- Socket features not working: ensure client connects to the same host/port and CORS/socket URL is correct.

## Contributing

If you plan to contribute:

1. Fork the repo and create a feature branch.
2. Run `npm install` and make your changes.
3. Add tests for new behavior.
4. Open a pull request with a description of changes.

## License & authors

Check the root project for license information. Contributors: see project commit history.

## Contact

If you need help running the backend or want to discuss architecture, share details and I can help further.
