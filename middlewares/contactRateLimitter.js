import rateLimit from 'express-rate-limit'

// ⏳ Limit: 5 requests per IP per 10 minutes
export const contactRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    success: false,
    errorCode: 'RATE_LIMIT',
    message: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
})
