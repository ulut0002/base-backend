export function assertConfigVarsExist(vars: [string, unknown][]) {
  const missing = vars.filter(([_, value]) => !value).map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration values: ${missing.join(", ")}`
    );
  }
}
