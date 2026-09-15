"use server";
import { cookies } from "next/headers";

export async function logoutAction() {
  const baseUrl =
    process.env.BASE_URL || "https://yubvtliweecqbmsqmlrr.supabase.co";
  const apiKey =
    process.env.API_KEY || "sb_publishable_oFcILbgYv5m9OURLvPGRqw_dAPaH8-P";

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
  } catch (error) {
    console.log("logout error", error);
  } finally {
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    cookieStore.delete("token");
  }

  return true;
}
