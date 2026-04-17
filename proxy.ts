import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const csp = [
    "default-src 'self'",
    "frame-src https://*.paddle.com https://sandbox-buy.paddle.com",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.paddle.com https://cdn.paddle.com https://public.profitwell.com",
    "style-src 'self' 'unsafe-inline' https://*.paddle.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.paddle.com https://sandbox-api.paddle.com https://checkout-service.paddle.com",
    "frame-ancestors 'self' http://localhost:3000",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: "/(.*)",
};
