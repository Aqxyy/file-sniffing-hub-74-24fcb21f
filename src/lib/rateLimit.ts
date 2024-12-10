interface RateLimitStore {
  [key: string]: {
    count: number;
    timestamp: number;
  };
}

const rateLimits: RateLimitStore = {};

export const rateLimit = (action: string, maxAttempts: number, windowMs: number = 300000) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Nettoyage des anciennes entrées
  Object.keys(rateLimits).forEach(key => {
    if (rateLimits[key].timestamp < windowStart) {
      delete rateLimits[key];
    }
  });

  // Vérification du rate limit
  if (!rateLimits[action]) {
    rateLimits[action] = { count: 1, timestamp: now };
    return true;
  }

  if (rateLimits[action].count >= maxAttempts) {
    return false;
  }

  rateLimits[action].count++;
  rateLimits[action].timestamp = now;
  return true;
};