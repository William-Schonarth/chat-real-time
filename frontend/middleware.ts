import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ERoutes } from "./shared/utils";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const user = req.cookies.get("user");

  if (!token || !user) {
    return NextResponse.redirect(new URL(ERoutes.LOGIN, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};
