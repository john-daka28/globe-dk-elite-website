import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/admin/dashboard", "/admin/applicants", "/admin/subjects"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (!protectedRoutes.some(route => url.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check cookie instead of Supabase token
  const isAdminLoggedIn = req.cookies.get("isAdminLoggedIn")?.value;

  if (!isAdminLoggedIn) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
