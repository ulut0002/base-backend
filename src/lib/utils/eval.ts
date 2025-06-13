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

export { isTrue };
