"use server";
import { cookies } from "next/headers";

export async function logoutAction() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    cookieStore.delete("token");
    return true;
  }

  try {
    await fetch(`${baseUrl}/auth/v1/logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: apiKey!,
        Authorization: `Bearer ${token}`,
      },
    });
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    cookieStore.delete("token");
  } catch (error) {
    console.log("logout error", error);
  }

  return true;
}
