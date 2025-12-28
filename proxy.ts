import { NextResponse, NextRequest } from "next/server";
export const PROTECTED_PATHS = ["/account"];

export function proxy(request: NextRequest) {
  // Debug: Log tất cả cookies để kiểm tra
  const allCookies = request.cookies.getAll();
  console.log("All cookies:", allCookies.map(c => ({ name: c.name, value: c.value?.substring(0, 20) + "..." })));
  
  const refreshToken = request.cookies.get("refresh_token")?.value;
  console.log("refreshToken found:", !!refreshToken);
  console.log("Request URL:", request.url);
  console.log("Request headers:", {
    host: request.headers.get("host"),
    origin: request.headers.get("origin"),
    referer: request.headers.get("referer"),
  });
  
  const pathname = request.nextUrl.pathname;
  
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  
  if (isProtected && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
  ],
};



/**
 * NGUYÊN NHÂN refreshToken undefined trên Vercel:
 * 
 * 1. COOKIE ATTRIBUTES TỪ BACKEND KHÔNG PHÙ HỢP:
 *    - SameSite: Backend cần set SameSite=None (cho cross-domain) hoặc SameSite=Lax (cho same-domain)
 *    - Secure: Phải có Secure flag khi dùng HTTPS (Vercel luôn dùng HTTPS)
 *    - Domain: Nếu backend và frontend khác domain, cần set domain phù hợp
 *    - Path: Đảm bảo path="/" hoặc path phù hợp
 * 
 * 2. CROSS-DOMAIN ISSUE:
 *    - Nếu backend ở api.example.com và frontend ở example.com, cookie cần:
 *      * SameSite=None
 *      * Secure=true
 *      * Domain=.example.com (với dấu chấm ở đầu để share giữa subdomains)
 * 
 * 3. COOKIE CHƯA ĐƯỢC SET:
 *    - Kiểm tra trong DevTools > Application > Cookies xem cookie có được set không
 *    - Kiểm tra Network tab xem response từ /auth/login có Set-Cookie header không
 * 
 * 4. TIMING ISSUE:
 *    - Cookie có thể chưa được set khi middleware chạy ngay sau khi login
 *    - Cần đảm bảo redirect sau khi cookie đã được set
 * 
 * GIẢI PHÁP:
 * 
 * 1. Kiểm tra backend response khi login:
 *    - Response phải có header: Set-Cookie: refresh_token=xxx; HttpOnly; Secure; SameSite=None; Path=/
 *    - Nếu cross-domain: Domain=.example.com
 * 
 * 2. Kiểm tra trong browser:
 *    - Mở DevTools > Application > Cookies
 *    - Xem cookie refresh_token có tồn tại không
 *    - Kiểm tra domain, path, secure, sameSite attributes
 * 
 * 3. Nếu vẫn không work, thử:
 *    - Set cookie từ frontend sau khi login thành công (không khuyến khích cho refresh token)
 *    - Hoặc dùng server-side API route để proxy request và forward cookie
 */
