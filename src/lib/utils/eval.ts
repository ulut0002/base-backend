/**
 * Converts various input types to a boolean `true` if they represent a "truthy" value.
 * Supports booleans, strings (e.g., "true", "1", "yes"), and numbers (e.g., 1).
 */
const isTrue = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;

  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "y", "on"].includes(normalized);
  }

  return false;
};

const minutesToMilliseconds = (minutes: number): number => {
  if (typeof minutes !== "number" || isNaN(minutes) || minutes < 0) {
    throw new Error("Invalid input: minutes must be a non-negative number.");
  }
  if (!Number.isInteger(minutes)) {
    throw new Error("Invalid input: minutes must be an integer.");
  }
  if (minutes === 0) return 0; // Handle zero case explicitly
  if (minutes < 0) {
    throw new Error("Invalid input: minutes cannot be negative.");
  }
  // Convert minutes to milliseconds
  return minutes * 60 * 1000;
};

const minutesToSeconds = (minutes: number): number => {
  if (typeof minutes !== "number" || isNaN(minutes) || minutes < 0) {
    throw new Error("Invalid input: minutes must be a non-negative number.");
  }
  if (!Number.isInteger(minutes)) {
    throw new Error("Invalid input: minutes must be an integer.");
  }
  if (minutes === 0) return 0; // Handle zero case explicitly
  if (minutes < 0) {
    throw new Error("Invalid input: minutes cannot be negative.");
  }
  // Convert minutes to seconds
  return minutes * 60;
};

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function parseNumberEnv(key: string, defaultValue?: number): number {
  const value = process.env[key];
  const parsed = value !== undefined ? parseInt(value, 10) : NaN;
  if (!isNaN(parsed)) {
    return parsed;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Invalid or missing numeric env var: ${key}`);
}

function createUrl(host: string, port?: string): string {
  const url = new URL(host);
  if (port) url.port = port;
  return url.toString().replace(/\/$/, ""); // Remove trailing slash if any
}

export {
  isTrue,
  minutesToMilliseconds,
  minutesToSeconds,
  getRequiredEnv,
  parseNumberEnv,
  createUrl,
};
