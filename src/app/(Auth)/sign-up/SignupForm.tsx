"use client";

import Link from "next/link";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { registerSchema } from "./signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAction } from "./signup.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Image from "next/image";

export type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const route = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      jobTitle: "",
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

  const onSubmit = async (data: RegisterFormValues) => {
    const isRegistered = await registerAction(data);
    if (isRegistered) {
      toast.success("Email created successfully");
      route.push("/logIn");
    } else {
      toast.error("User already registered");
    }
  };

  return (
    <div className="min-h-screen w-full bg-Surface-Low flex flex-col justify-between p-4 sm:p-8">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-start py-2 gap-2">
        <Image src="/Icon.svg" alt="logo" width={16} height={20} />
        <Typography variant="title-md" className="font-bold">
          TASKLY
        </Typography>
      </header>

      <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
        <div className="w-full max-w-xl bg-white rounded-lg sm:shadow-card sm:border sm:border-neutral-border/20 p-6 sm:p-12 space-y-6">
          <div className="text-center space-y-2">
            <Typography
              variant="headline-lg"
              className="text-neutral-dark font-bold"
            >
              Create your workspace
            </Typography>
            <Typography variant="body-md" className="text-neutral-muted">
              Join the editorial approach to task management.
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="NAME"
                placeholder="Enter your full name"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-error mt-1">{errors.name.message}</p>
              ) : (
                <Typography
                  variant="label-sm"
                  className="text-neutral-muted mt-1.5 block text-[10px] tracking-normal normal-case font-normal"
                >
                  3-50 characters, letters only.
                </Typography>
              )}
            </div>

            <Input
              type="email"
              label="EMAIL"
              placeholder="yourname@company.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-error mt-1">{errors.email.message}</p>
            )}

            <Input
              label="JOB TITLE (OPTIONAL)"
              placeholder="e.g. Project Manager"
              {...register("jobTitle")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="PASSWORD"
                    placeholder="Password"
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-neutral-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    <Icon
                      name={showPassword ? "visibility_off" : "visibility"}
                      width={20}
                      height={20}
                    />
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
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-8 text-neutral-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    <Icon
                      name={
                        showConfirmPassword ? "visibility_off" : "visibility"
                      }
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-error mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-condition-box space-y-2">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-2">
                  <Icon
                    name={
                      rule.isMet ? "check_circle " : "radio_button_unchecked"
                    }
                    width={16}
                    height={16}
                    className={
                      rule.isMet ? "text-success!" : "text-neutral-muted"
                    }
                  />
                  <Typography
                    variant="label-sm"
                    className=" text-neutral-muted"
                  >
                    {rule.label}
                  </Typography>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full mt-2 bg-Primary-Gradient">
              Create Account
            </Button>
          </form>

          <div className="text-center pt-2">
            <Typography
              variant="body-md"
              className="text-xs text-neutral-muted"
            >
              Already have an account?{" "}
              <Link
                href="/logIn"
                className="text-primary font-bold hover:underline"
              >
                Log in
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
