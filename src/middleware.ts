import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = await getToken({ req });
  if (pathname !== "/" && !token) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
  if (pathname === "/" && token) {
    const url = new URL("/dashboard", req.nextUrl);
    return NextResponse.redirect(url);
  }
}
