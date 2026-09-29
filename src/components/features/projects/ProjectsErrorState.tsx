"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import ErrorIcon from "@/../public/error.svg";

interface ReusableErrorStateProps {
  title?: string;
  description?: React.ReactNode;
  buttonText?: string;
  onRetry?: () => void;
  className?: string;
}

export const ProjectsErrorState: React.FC<ReusableErrorStateProps> = ({
  title = "Something went wrong",
  description = "We are having trouble retrieving your data right now. Please try again in a moment.",
  buttonText = "Retry Connection",
  onRetry,
  className = "",
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center min-h-[60vh] px-4 max-w-md mx-auto ${className}`}
    >
      {/* Error Icon Box */}
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 shrink-0">
        <ErrorIcon className="w-7 h-6 text-red-600" />
      </div>

      <Typography
        variant="title-md"
        className="font-bold text-neutral-900 mb-2"
      >
        {title}
      </Typography>

      <Typography
        variant="body-md"
        className="text-neutral-muted mb-6 leading-relaxed max-w-sm"
      >
        {description}
      </Typography>

      <Button variant="primary" onClick={handleRetry} className="px-6 py-2.5">
        {buttonText}
      </Button>
    </div>
  );
};
