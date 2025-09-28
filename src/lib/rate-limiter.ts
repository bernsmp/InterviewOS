/**
 * Simple in-memory rate limiter for production use
 * For a production deployment with multiple instances, use Redis-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  async limit(identifier: string): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // Clean up old entries periodically
    if (this.limits.size > 1000) {
      this.cleanup();
    }

    if (!entry || now > entry.resetTime) {
      // Create new entry
      const resetTime = now + this.windowMs;
      this.limits.set(identifier, { count: 1, resetTime });
      return { success: true, remaining: this.maxRequests - 1, reset: resetTime };
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return { success: false, remaining: 0, reset: entry.resetTime };
    }

    // Increment count
    entry.count++;
    return { success: true, remaining: this.maxRequests - entry.count, reset: entry.resetTime };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Create rate limiters for different endpoints
export const apiRateLimiter = new InMemoryRateLimiter(60000, 20); // 20 requests per minute
export const aiRateLimiter = new InMemoryRateLimiter(60000, 10); // 10 AI requests per minute