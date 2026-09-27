"use server";

import { RegisterFormValues } from "./SignupForm";

export async function registerAction(data: RegisterFormValues) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey =
    process.env.NEXT_PUBLIC_SUPABASE_KEY!;

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
