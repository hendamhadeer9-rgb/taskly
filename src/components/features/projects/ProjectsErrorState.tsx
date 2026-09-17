"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface ProjectsErrorStateProps {
  onRetry?: () => void;
}

export const ProjectsErrorState: React.FC<ProjectsErrorStateProps> = ({
  onRetry,
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4 max-w-md mx-auto">
      {/* Cloud Offline Icon Box */}
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 ">
        <Image src="/error.svg" alt="error" width={27} height={24} />
      </div>

      {/* Heading */}
      <Typography
        variant="title-md"
        className="font-bold text-neutral-900 mb-2"
      >
        Something went wrong
      </Typography>

      {/* Subtitle Message */}
      <Typography
        variant="body-md"
        className="text-neutral-muted mb-6 leading-relaxed"
      >
        We are having trouble retrieving your <br />
        projects right now. Please try
        <br />
        again in a moment.
      </Typography>

      {/* Retry Button */}
      <Button variant="primary" onClick={handleRetry} className="px-6 py-2.5">
        Retry Connection
      </Button>
    </div>
  );
};
