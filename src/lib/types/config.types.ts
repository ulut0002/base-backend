/**
 * Partial environment config used throughout the backend app.
 * All values are read from `.env` files via dotenv and loaded into this shape.
 */
type EnvConfig = Partial<{
  BACKEND_URL: string; // Base URL for the backend server (e.g. http://localhost)
  BACKEND_PORT: string; // Port number backend listens on (e.g. 3000)
  BACKEND_MONGODB_URI: string; // MongoDB connection string
  BACKEND_JWT_SECRET_KEY: string; // Secret key used for signing JWTs
}>;
