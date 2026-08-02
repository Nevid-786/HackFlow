import { rateLimit } from "express-rate-limit";

// Factory for general-purpose limiters — lets you tune max per router/route
export const makeLimiter = (max = 150, message = "Too many requests.") =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 50 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Upload limit exceeded.",
  },
});

// Pre-built instances for your routers — adjust numbers as you see real traffic
export const hackLimiter = makeLimiter(400);
export const userLimiter = makeLimiter(400);
export const teamLimiter = makeLimiter(400);
export const adminLimiter = makeLimiter(400, "Too many admin requests.");