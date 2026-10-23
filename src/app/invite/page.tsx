"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { acceptInvitation, getUserData } from "@/api/services/servicesApi";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function verifyAuth() {
      if (!token || token.trim() === "") {
        setErrorMessage("This invitation link is invalid. Missing token.");
        setCheckingAuth(false);
        return;
      }

      const user = await getUserData();
      if (!user) {
        const currentUrl = encodeURIComponent(`/invite?token=${token}`);
        router.push(`/login?redirect=${currentUrl}`);
        return;
      }

      setCheckingAuth(false);
    }

    verifyAuth();
  }, [token, router]);

  const handleAccept = async () => {
    if (!token) return;

    setSubmitting(true);
    setErrorMessage(null);

    const response = await acceptInvitation(token);

    if (response.success) {
      setSuccessMessage("Invitation accepted successfully!");
      
      const targetProjectId =
        response.data?.project_id || response.data?.id;

      setTimeout(() => {
        if (targetProjectId) {
          router.push(`/project/${targetProjectId}/tasks`);
        } else {
          router.push("/project");
        }
      }, 1200);
    } else {
      if (response.unauthorized) {
        setErrorMessage("You need to log in to accept this invitation.");
      } else {
        setErrorMessage(
          response.error || "This invitation link is invalid or expired."
        );
      }
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 to-white px-4">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 mb-8 text-blue-900 font-bold text-xl tracking-tight">
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        TASKLY
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md rounded-2xl bg-white border-t-4 border-blue-600 p-8 shadow-xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 mb-6">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          New Project Invitation
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          You have been invited to join <br /> new project
        </h2>

        {/* Notifications */}
        {errorMessage && (
          <div className="mt-4 rounded-xl bg-red-50 p-3.5 text-sm text-red-600 border border-red-200 text-left">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-xl bg-green-50 p-3.5 text-sm text-green-700 border border-green-200">
            {successMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleAccept}
          disabled={submitting || !!successMessage || !token}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Accept Invitation"
          )}
        </button>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}