"use server";

import { resetFormValues } from "./page";

export type ResetPayload = resetFormValues & {
  token: string;
};

export async function resetAction(data: ResetPayload) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

  try {
    const response = await fetch(`${baseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify({
        password: data.password,
      }),
    });

    const finalRes = await response.json();

    // 🟢 طباعة استجابة السيرفر وتفاصيل الـ Status
    console.log("=== RESET ACTION RESPONSE ===");
    console.log("Status Code:", response.status);
    console.log("Response Body:", finalRes);

    if (response.ok) {
      return { success: true, data: finalRes };
    }

    // 🔴 طباعة الخطأ إذا كانت الاستجابة غير ناجحة (مثل 400 أو 422 أو 500)
    console.error("=== RESET ACTION API ERROR ===");
    console.error("Error Details:", finalRes);

    return { success: false, error: finalRes };
  } catch (error) {
    // 🔴 طباعة أخطاء الـ Catch (مثل انقطاع الشبكة أو فشل الـ JSON Parsing)
    console.error("=== RESET ACTION CATCH ERROR ===");
    console.error("Catch Block Error:", error);

    return { success: false, error };
  }
}