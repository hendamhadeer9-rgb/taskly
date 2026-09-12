import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  
  const token = req.cookies.get("token")?.value;


  if (token) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/logIn",req.url));
}

export const config = {
  matcher: ["/"],
};