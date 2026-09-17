import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export const ProjectsEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
      {/* الصورة/الأيقونة الخاصة بالحالة الفارغة */}
      <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
        <Image
          src="/empty.svg" // ضعي مسار صورة فيجما هنا
          alt="No Projects"
          width={288}
          height={288}
        />
      </div>

      {/* Title */}
      <Typography
        variant="headline-lg"
        className="font-bold text-neutral-900 mb-2"
      >
        No Projects
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body-md"
        className="text-neutral-muted mb-6 leading-relaxed"
      >
        You do not have any projects yet. Start by defining your first
        architectural workspace to begin tracking tasks and epics.
      </Typography>

      {/* Create Button */}
      <Link href="/project/add">
        <Button variant="primary" className="px-6 py-2.5">
          Create New Project
        </Button>
      </Link>
    </div>
  );
};
