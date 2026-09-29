"use server";

import { LoginFormValues } from "./LoginForm";
import { cookies } from "next/headers";

export async function loginAction(data: LoginFormValues) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

  try {
    const res = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: apiKey!,
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const finalRes = await res.json();
    console.log("register", finalRes);

    if (res.ok && finalRes.access_token) {
      const cookieStore = await cookies();

      cookieStore.set("token", finalRes.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        ...(data.rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
      });

      return { ok: true, data: finalRes };
    }

    return {
      ok: false,
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
}
