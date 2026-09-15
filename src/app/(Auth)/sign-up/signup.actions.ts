"use server";

import { RegisterFormValues } from "./SignupForm";

export async function registerAction(data: RegisterFormValues) {
  const baseUrl =
    process.env.BASE_URL || "https://yubvtliweecqbmsqmlrr.supabase.co";
  const apiKey =
    process.env.API_KEY || "sb_publishable_oFcILbgYv5m9OURLvPGRqw_dAPaH8-P";

  try {
    const res = await fetch(`${baseUrl}/auth/v1/signup`, {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        data: {
          name: data.name,
          job_title: data.jobTitle,
        },
      }),
      headers: {
        "content-type": "application/json",
        apikey: apiKey,
      },
    });

    const finalRes = await res.json();

    if (res.ok) {
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
