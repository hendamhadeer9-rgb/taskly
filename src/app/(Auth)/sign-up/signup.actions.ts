"use server";

import { RegisterFormValues } from "./SignupForm";

export async function registerAction(data: RegisterFormValues) {
  try {
    const res = await fetch(`${process.env.BASE_URL}/auth/v1/signup`, {
      method: "post",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        data:{
          name: data.name,
          job_title: data.jobTitle,
        }
      }),
      headers: {
        "content-type": "application/json",
        apikey: process.env.API_KEY!,
      },
    });

    return res.ok;
  } catch (error) {
    return error;
  }
}
