"use server";

import { RegisterFormValues } from "./RgisterForm";

export async function registerAction(data: RegisterFormValues) {
  try {
    const res = await fetch(
      `https://yubvtliweecqbmsqmlrr.supabase.co/auth/v1/signup`,
      {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
          apikey:
            process.env.API_key ||
            "sb_publishable_oFcILbgYv5m9OURLvPGRqw_dAPaH8-P",
        },
      },
    );

    return res.ok;
  } catch (error) {
    return error;
  }
}
