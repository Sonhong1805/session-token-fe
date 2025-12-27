import { NextResponse, NextRequest } from "next/server";
export const PROTECTED_PATHS = ["/account"];

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  console.log("refreshToken", refreshToken);
  const pathname = request.nextUrl.pathname;
  
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  if (isProtected && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log("next response");

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
  ],
};
