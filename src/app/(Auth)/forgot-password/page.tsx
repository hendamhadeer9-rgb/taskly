"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { forgotSchema } from "./forgot-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordAction } from "./forgot.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Back from "@/../public/back.svg";
import Success from "@/../public/success.svg";
import Logo from "@/../public/Icon.svg";

export type ForgotFormValues = zod.infer<typeof forgotSchema>;

export default function Page() {
  const route = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 دقائق
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const maxAttempts = 3;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailValue = watch("email");

  // إدارة العداد التنازلي
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const onSubmit = async (data: ForgotFormValues) => {
    if (isLoading || isSubmitting) return; // منع التكرار

    setIsLoading(true);
    try {
      const emailSent = await forgotPasswordAction(data);

      if (emailSent && emailSent.success) {
        toast.success("If an account exists, a reset link has been sent.");
        setTimeLeft(300);
        setIsTimerRunning(true);
        setHasSubmitted(true);
      } else {
        toast.error( "Unable to send reset email. Please try again.");
      }
    } catch (error) {
      // معالجة أخطاء الشبكة أو السيرفر دون إظهار تفاصيل تقنية حساسة
      toast.error("An unexpected network or server error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendAttempts >= maxAttempts || isTimerRunning || isLoading) return;

    setIsLoading(true);
    try {
      const emailSent = await forgotPasswordAction({ email: emailValue });

      if (emailSent && emailSent.success) {
        toast.success("Reset link resent successfully.");
        setResendAttempts((prev) => prev + 1);
        setTimeLeft(300);
        setIsTimerRunning(true);
      } else {
        toast.error("Failed to resend the reset link. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const remainingAttempts = maxAttempts - resendAttempts;
  const isPending = isLoading || isSubmitting;

  return (
    <div className="w-full bg-Surface-Low flex flex-col justify-between p-4 sm:p-8 min-h-screen">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-start py-2 gap-2">
        <Logo />
        <Typography variant="title-md" className="font-bold">
          TASKLY
        </Typography>
      </header>

      <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
        <div className="w-md bg-white rounded-lg sm:shadow-card sm:border sm:border-neutral-border/20 p-6 sm:p-12 space-y-6">
          <div className="text-center space-y-2">
            <Typography
              variant="headline-lg"
              className="text-neutral-dark font-semibold"
            >
              Forgot password?
            </Typography>
            <Typography
              variant="body-md"
              className="text-neutral-muted font-regular"
            >
              No worries, we'll send you reset instructions.
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="email"
              label="Email address"
              placeholder="Enter your email"
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-error mt-1">{errors.email.message}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 bg-Primary-Gradient disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            <Link href="/logIn">
              <Button
                variant="ghost"
                className="w-full mt-2"
                disabled={isPending}
              >
                <div className="flex justify-center gap-2 text-primary">
                  <Back className="mt-0.5" />
                  <span>Back to log in</span>
                </div>
              </Button>
            </Link>
          </form>
        </div>
      </main>

      {hasSubmitted && (
        <div className="w-full max-w-md rounded-md mx-auto bg-success/30 p-4 mt-8">
          <div className="flex items-start gap-3 pb-3">
            <Success />
            <p className="text-xs font-medium text-green">
              If an account exists with this email, we've sent a password reset
              link.
            </p>
          </div>

          <div className="border-t border-nav-border my-1" />

          <div className="flex items-center justify-between pt-2 text-[11px] font-bold tracking-wider">
            <span className="text-green/60 uppercase">
              DIDN'T RECEIVE EMAIL?
            </span>

            {resendAttempts >= maxAttempts ? (
              <span className="text-error uppercase">
                MAX RESEND ATTEMPTS REACHED
              </span>
            ) : isTimerRunning ? (
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-primary uppercase">
                  RESEND IN {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] text-neutral-muted font-normal lowercase">
                  ({remainingAttempts}{" "}
                  {remainingAttempts === 1 ? "attempt" : "attempts"} remaining)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-muted font-normal lowercase">
                  ({remainingAttempts} left)
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isPending}
                  className="text-primary uppercase hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "RESENDING..." : "RESEND"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}