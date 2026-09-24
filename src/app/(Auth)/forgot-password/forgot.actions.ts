import { ForgotFormValues } from "./page";

export async function forgotPasswordAction(data: ForgotFormValues) {
  const baseUrl =
    process.env.BASE_URL || "https://yubvtliweecqbmsqmlrr.supabase.co";
  const apiKey =
    process.env.API_KEY || "sb_publishable_oFcILbgYv5m9OURLvPGRqw_dAPaH8-P";
  try {
    const response = await fetch(`${baseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
      }),
    });

    const finalRes = await response.json();

   

    if (response.ok) {
      return { success: true, data: finalRes };
    }

    return { success: false, error: finalRes };
  } catch (error) {
    console.error("Catch Block Error:", error);
    return { success: false, error };
  }
}