"use client";

import Link from "next/link";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/../public/Icon.svg";
import Eyeoff from "@/../public/eyeoff.svg";
import Eyeon from "@/../public/eyeon.svg";
import Circle from "@/../public/circle.svg";
import Check_circle from "@/../public/check_circle.svg";
import Back from "@/../public/back.svg";
import { resetSchema } from "./reset-password.schema";
import { resetAction } from "./reset.actions";

export type resetFormValues = zod.infer<typeof resetSchema>;

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));

    const token = params.get("access_token");
    const type = params.get("type");
    const error = params.get("error");
    const errorCode = params.get("error_code");

    if (error || errorCode || (type && type !== "recovery") || !token) {
      setIsTokenInvalid(true);
    } else {
      setAccessToken(token);
      setIsTokenInvalid(false);
    }

    setIsCheckingToken(false);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<resetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

  const rules = [
    {
      id: 1,
      label: "At least 8 characters",
      isMet: passwordValue.length >= 8,
    },
    {
      id: 2,
      label: "One uppercase, lowercase, and digit",
      isMet:
        /[A-Z]/.test(passwordValue) &&
        /[a-z]/.test(passwordValue) &&
        /[0-9]/.test(passwordValue),
    },
    {
      id: 3,
      label: "One special character",
      isMet: /[^A-Za-z0-9]/.test(passwordValue),
    },
  ];

  const onSubmit = async (data: resetFormValues) => {
    if (!accessToken || isTokenInvalid) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    const isSuccess = await resetAction({
      password: data.password,
      confirmPassword: data.confirmPassword,
      token: accessToken,
    });

    if (isSuccess) {
      toast.success(
        "Your password has been updated successfully. You can now log in",
      );
      setTimeout(() => {
        router.push("/logIn");
      }, 3000);
    } else {
      toast.error("Failed to update password. Please try again.");
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-Surface-Low">
        <Typography variant="body-md" className="text-neutral-muted">
          Checking reset link...
        </Typography>
      </div>
    );
  }

  if (isTokenInvalid || !accessToken) {
    return (
      <div className="min-h-screen w-full bg-Surface-Low flex flex-col justify-between p-4 sm:p-8">
        <header className="w-full max-w-7xl mx-auto flex items-center justify-start py-2 gap-2">
          <Logo />
          <Typography variant="title-md" className="font-bold">
            TASKLY
          </Typography>
        </header>

        <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
          <div className="w-full max-w-xl bg-white rounded-lg sm:shadow-card sm:border sm:border-neutral-border/20 p-6 sm:p-12 text-center space-y-6">
            <Typography variant="headline-lg" className="text-error font-bold">
              Invalid or expired reset link.
            </Typography>
            <Typography variant="body-md" className="text-neutral-muted">
              The password reset link you used is invalid, incomplete, or has
              expired. Please request a new link.
            </Typography>

            <Link href="/forgot-password" className="block pt-2">
              <Button className="w-full bg-Primary-Gradient cursor-pointer">
                Request New Link
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-Surface-Low flex flex-col justify-between p-4 sm:p-8">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-start py-2 gap-2">
        <Logo />
        <Typography variant="title-md" className="font-bold">
          TASKLY
        </Typography>
      </header>

      <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
        <div className="w-lg  bg-white rounded-lg sm:shadow-card sm:border sm:border-neutral-border/20 p-6 sm:p-12 space-y-6">
          <div className="text-center space-y-2">
            <Typography
              variant="headline-lg"
              className="text-neutral-dark font-bold"
            >
              Create a New Password
            </Typography>
            <Typography variant="body-md" className="text-neutral-muted">
              Create a new, strong password to secure your workstation access.
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label=" NEW PASSWORD"
                  placeholder="Password"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-neutral-muted hover:text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <Eyeon /> : <Eyeoff />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="CONFIRM PASSWORD"
                  placeholder="Repeat your password"
                  className="pr-10"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-error mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="p-4 rounded-lg bg-condition-box space-y-2">
              <div className="pb-2 mb-1 border-b border-nav-border">
                <Typography variant="label-sm" className="text-label-sm ">
                  Security Requirements
                </Typography>
              </div>{" "}
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-2 text-label-sm  "
                >
                  <div>{rule.isMet ? <Check_circle /> : <Circle />}</div>
                  <Typography
                    variant="label-sm"
                    className={
                      rule.isMet
                        ? "text-primary font-medium"
                        : "text-neutral-muted"
                    }
                  >
                    {rule.label}
                  </Typography>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !accessToken}
              className="w-full mt-2 bg-Primary-Gradient disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>

            <Link href="/logIn">
              <Button variant="ghost" className="w-full mt-2" type="button">
                <div className="flex justify-center gap-2 text-primary">
                  <Back className="mt-0.5" />
                  <span>Back to log in</span>
                </div>
              </Button>
            </Link>
          </form>
        </div>
      </main>
    </div>
  );
}
