import { NextMiddleware, NextResponse } from "next/server";

export const middleware: NextMiddleware = (req) => {
  const token = req.cookies.get("court_auth_token");

  if (!token) {
    const loginUrl = new URL("/auth/register", req.url)
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ]
}
