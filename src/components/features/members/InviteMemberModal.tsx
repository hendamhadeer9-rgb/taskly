"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteMemberSchema, InviteMemberFormValues } from "@/app/project/[id]/members/inviteSchema";
import { inviteMember } from "@/api/services/servicesApi";

interface InviteMemberModalProps {
  projectId: string;
  projectName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InviteMemberModal({
  projectId,
  projectName = "the project",
  isOpen,
  onClose,
  onSuccess,
}: InviteMemberModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "" },
  });

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    setServerError(null);
    setSuccessMessage(null);
    onClose();
  };

  const onSubmit = async (values: InviteMemberFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const result = await inviteMember({
      email: values.email,
      projectId,
    });

    if (result.success) {
      setSuccessMessage("Invitation sent successfully.");
      reset();
      if (onSuccess) onSuccess();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } else {
      setServerError(result.error || "Failed to send invitation.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon Header */}
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-bold text-neutral-900">Invite Team Member</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Send an invitation to join the {projectName} workspace.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          {serverError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
              {successMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter email address"
                disabled={isSubmitting}
                {...register("email")}
                className={`w-full rounded-xl border bg-blue-50/30 px-3.5 py-2.5 pr-10 text-sm outline-none transition placeholder:text-neutral-400 focus:bg-white focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-200 focus:border-blue-600 focus:ring-blue-100"
                } disabled:bg-neutral-100 disabled:cursor-not-allowed`}
              />
              <span className="pointer-events-none absolute right-3 top-3 text-neutral-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-800 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-[130px] items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Send Invitation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}