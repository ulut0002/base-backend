/**
 * Returns a shallow copy of the loaded environment configuration.
 */
function loadConfig(): EnvConfig {
  return {
    BACKEND_URL: process.env.BACKEND_URL || "",
    BACKEND_PORT: process.env.BACKEND_PORT || "",
    BACKEND_MONGODB_URI: process.env.BACKEND_MONGODB_URI || "",
    BACKEND_JWT_SECRET_KEY: process.env.BACKEND_JWT_SECRET_KEY || "",
  };
}

/**
 * Constructs the backend URL using the host and port from environment config.
 * Returns undefined if either value is missing.
 */
function getBackendUrl(): string | undefined {
  const config = loadConfig();

  console.log("Loaded config:", config);

  const backendUrl = config.BACKEND_URL;
  const backendPort = config.BACKEND_PORT;

  if (!backendUrl || !backendPort) {
    return undefined;
  }

  return createUrl(backendUrl, backendPort);
}

/**
 * Helper function to join host and port into a full URL string.
 * Returns an empty string if host is not defined.
 */
function createUrl(host: string, port?: string): string {
  if (!host) {
    return "";
  }
  return port ? `${host}:${port}` : host;
}

export { loadConfig, getBackendUrl };
