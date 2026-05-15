const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const wildcardToRegex = (pattern) => {
  const escaped = pattern.split("*").map(escapeRegex).join(".*");
  return new RegExp(`^${escaped}$`);
};

export const createOriginChecker = (allowedOrigins = []) => {
  const exactOrigins = [];
  const wildcardOrigins = [];

  for (const origin of allowedOrigins) {
    if (!origin) continue;

    if (origin.includes("*")) {
      wildcardOrigins.push(wildcardToRegex(origin));
    } else {
      exactOrigins.push(origin);
    }
  }

  return (origin) => {
    if (!origin) return true;
    if (exactOrigins.includes(origin)) return true;
    return wildcardOrigins.some((pattern) => pattern.test(origin));
  };
};

export const createCorsOptions = (allowedOrigins = []) => {
  const isAllowedOrigin = createOriginChecker(allowedOrigins);

  return {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true
  };
};
