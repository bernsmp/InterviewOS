import { NextRequest, NextResponse } from "next/server";
import { aiRateLimiter } from "./rate-limiter";

/**
 * Rate limiting middleware for API routes
 */
export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Get client IP or use a fallback
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "anonymous";

  const { success, remaining, reset } = await aiRateLimiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { 
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((reset - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString()
        }
      }
    );
  }

  // Add rate limit headers to response
  const response = await handler(request);
  response.headers.set("X-RateLimit-Limit", "10");
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", reset.toString());

  return response;
}