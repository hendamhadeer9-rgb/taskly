import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('token')?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL('/logIn', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/project/:path*'],
};