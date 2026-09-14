"use server";

import { cookies } from "next/headers";

export async function getUserData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const baseUrl = process.env.BASE_URL || "https://yubvtliweecqbmsqmlrr.supabase.co";
  const apiKey = process.env.API_KEY || "sb_publishable_oFcILbgYv5m9OURLvPGRqw_dAPaH8-P";

  try {
    const res = await fetch(`${baseUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Supabase error response:", await res.text());
      return null;
    }

    const data = await res.json();
    console.log("Fetched User Data successfully:", data); // سيظهر في VS Code Terminal
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}