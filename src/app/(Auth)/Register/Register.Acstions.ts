"use server";

import { RegisterFormValues } from "./RgisterForm";

export async function registerAction(data: RegisterFormValues) {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/auth/v1/signup}`,
      {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
          apikey: "sb_secret_5bMSdajbP4l4odusA5cFYw_Y_nYuL6y",
        },
      },
    );

    return res.ok;
  } catch (error) {
    return error;
  }
}
