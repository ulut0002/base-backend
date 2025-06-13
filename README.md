# Backend API Server

This is a TypeScript-based Express.js backend application with the following features:

- JWT-based authentication (Passport.js)
- MongoDB with Mongoose
- Socket.IO for real-time features
- Rate limiting, security headers, localization (i18n)
- Swagger-based API documentation
- Modular folder structure
- Uses `pnpm` for dependency management

---

## Installation

Ensure you have `pnpm` installed:

```bash
npm install -g pnpm
```

Then install project dependencies:

```bash
pnpm run dev
```

## Running the Server

**Development**

```bash
pnpm run dev
```

This uses ts-node-dev or a similar tool to run the app with automatic restarts.

**Production**

Build and run the compiled output:

````bash
pnpm run build
pnpm start```



## Project Structure
````

src/
├── controllers/ # Passport strategies and logic
├── jobs/ # Background tasks (e.g., schedulers)
├── lib/ # Utilities: DB, logger, config, socket setup
├── middleware/ # Custom Express middlewares
├── routes/ # Express route definitions
├── index.ts # Main entry point

````


##Routes


`/`: Root route or health check
`/auth`: Login, register, and JWT handling
`/profile`: Authenticated user profile
`/security`: Security settings like 2FA
`/admin`: Admin-only actions
`/recovery`: Password recovery/reset flows
`/docs`: Swagger API documentation (if enabled)



## Configuration
All configuration is loaded via .env and config/. Ensure your .env file includes:

```env
BACKEND_PORT=4000
BACKEND_MONGODB_URI=mongodb://localhost:27017/yourdbname
BACKEND_JWT_SECRET_KEY=yourSecretKey
````

## WebSockets

Socket.IO is initialized on the same server instance, and is CORS-enabled with credentials: true.

## Graceful Shutdown

On SIGINT (e.g., Ctrl+C), the server disconnects from MongoDB and shuts down the HTTP server cleanly.

## Swagger Docs

If configured, the Swagger UI is available at:

```
http://localhost:PORT/docs
```
