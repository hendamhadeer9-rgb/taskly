"use client";

import Link from "next/link";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { loginSchema } from "./logIn.Schema";
import { logInAction } from "./logIn.Actions";
import Icon from "@/components/ui/Icon";

export type LoginFormValues = zod.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const response = (await logInAction(data)) as { ok: boolean };
    if (response?.ok) {
      toast.success("Logged in successfully");
      router.refresh();
      router.push("/");
    } else {
      toast.error("Failed to log in");
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-between p-4 sm:p-8">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-start py-2">
        <div className="flex items-center gap-2 text-primary">
          <Typography
            variant="title-md"
            className="font-extrabold tracking-wider text-primary"
          >
            TASKLY
          </Typography>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
        <div className="w-full max-w-md bg-white rounded-lg sm:shadow-card sm:border sm:border-neutral-border/20 p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <Typography
              variant="headline-lg"
              className="text-neutral-dark font-bold text-2xl"
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body-md"
              className="text-neutral-muted text-xs"
            >
              Please enter your details to access your workspace
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                type="email"
                label="EMAIL"
                placeholder="yourname@company.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-error mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 sm:hidden">
                <label className="text-[10px] font-semibold tracking-wider text-neutral-dark uppercase">
                  Password
                </label>
                <Link
                  href="/forgotPass"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot?
                </Link>
              </div>

              <Input
                type="password"
                label="PASSWORD"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-error mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-dark font-medium">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="rounded border-neutral-border text-primary focus:ring-primary h-4 w-4"
                />
              
                <span>Remember Me</span>
              </label>

              <Link
                href="/forgotPass"
                className="hidden sm:inline-block text-primary font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-md transition-colors"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <Typography
              variant="body-md"
              className="text-xs text-neutral-muted"
            >
              Do not have an account?
              <Link
                href="/Register"
                className="text-primary font-bold hover:underline"
              >
                Sign Up
              </Link>
            </Typography>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-2">
        <Typography
          variant="label-sm"
          className="text-neutral-muted text-[10px]"
        >
          © 2026 TASKLY. ALL RIGHTS RESERVED.
        </Typography>
      </footer>
    </div>
  );
}
