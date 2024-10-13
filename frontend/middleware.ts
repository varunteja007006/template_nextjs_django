import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { LOGIN_ROUTES, UNPROTECTED_ROUTES } from "@/constants/routes.constant";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const hasToken = request.cookies.has("token");
  const hasAccessToken = request.cookies.has("access_token");
  const hasRefreshToken = request.cookies.has("refresh_token");

  // If user has token and is going to login routes then redirect to home
  // Also check if user has access token and refresh token
  if (
    (hasToken || hasAccessToken || hasRefreshToken) &&
    LOGIN_ROUTES.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user has no token and is going to protected routes then redirect to login
  // Also check if user has access token and refresh token
  else if (
    !hasToken &&
    !hasAccessToken &&
    !hasRefreshToken &&
    !UNPROTECTED_ROUTES.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let token = request.cookies.get("token");
  let access_token = request.cookies.get("access_token");
  let refresh_token = request.cookies.get("refresh_token");

  console.log("\n------MIDDLEWARE LOGGING:-------");
  console.log("pathname:", request.nextUrl.pathname);
  console.log("token:", token?.value);
  console.log("access_token:", access_token?.value);
  console.log("refresh_token:", refresh_token?.value);
  console.log("------------------------------------\n");

  //   const allCookies = request.cookies.getAll();
  //   console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  //   request.cookies.has("token"); // => true
  //   request.cookies.delete("token");
  //   request.cookies.has("token"); // => false

  // Setting cookies on the response using the `ResponseCookies` API
  //   const response = NextResponse.next();
  //   response.cookies.set({
  //     name: "company",
  //     value: "flare",
  //     path: "/",
  //   });
  //   const cookie = response.cookies.get("company");
  //   console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  //  The outgoing response will have a `Set-Cookie:vercel=fast;path=/` header.

  // proceed to the requested url
  return NextResponse.next();
}

// matcher allows you to filter Middleware to run on specific paths.
// filter multiple paths
export const config = {
  matcher: [
    "/",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
