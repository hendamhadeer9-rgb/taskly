"use server";

import { resetFormValues } from "./page";

export type ResetPayload = resetFormValues & {
  token: string;
};

export async function resetAction(data: ResetPayload) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // تأكدي من تطابق اسم المتغير مع ملف .env الخاص بك
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  try {
    const response = await fetch(`${baseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey!,
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify({
        password: data.password,
      }),
    });

    const finalRes = await response.json();

    if (response.ok && !finalRes.error) {
      return { success: true, data: finalRes };
    }

    return { success: false, error: finalRes };
  } catch (error) {
    console.error("Catch Block Error:", error);
    return { success: false, error };
  }
}