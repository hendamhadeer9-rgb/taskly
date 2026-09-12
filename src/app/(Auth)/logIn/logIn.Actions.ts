"use server";

import { LoginFormValues } from "./LoginForm";
import { cookies } from "next/headers";

export async function logInAction(data: LoginFormValues) {
  try {
    const res = await fetch(
      `https://yubvtliweecqbmsqmlrr.supabase.co/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey:
            process.env.API_key ||
            "sb_publishable_oFcILbgYv5m9OURLvPGRqw_dAPaH8-P",
        },

        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      },
    );

    const finalRes = await res.json();

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

    return { ok: false };
  } catch (error) {
    return { ok: false, error };
  }
}
