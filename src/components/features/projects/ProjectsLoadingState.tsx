import React from "react";
import { Typography } from "@/components/ui/Typography";

// مكون كارت الـ Skeleton الفردي
export const ProjectSkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg p-5 animate-pulse flex flex-col justify-between h-62">
      <div>
        {/* Title Skeleton */}
        <div className="w-full bg-background rounded-md h-3/4 mb-3"></div>
        {/* Description Skeleton */}
        <div className="h-4 bg-background rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-background rounded-md w-1/2 mb-6"></div>
      </div>
    </div>
  );
};

// المكون الرئيسي للهيكل بالكامل (مع الهيدر والشبكة)
export const ProjectsLoadingState = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Typography
            variant="headline-lg"
            className="font-bold text-neutral-900"
          >
            Projects
          </Typography>
          <Typography variant="body-md" className="text-neutral-muted mt-1">
            Manage and curate your projects
          </Typography>
        </div>
      </div>

      {/* Grid: 1 col mobile, 2 tablet, 3 desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProjectSkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};
