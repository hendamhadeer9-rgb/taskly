import React from "react";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import Empty from "@/../public/empty.svg";

export const ProjectsEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-lg mx-auto w-full">
      <div className="w-full max-w-70 sm:max-w-[320px] aspect-square mb-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
        <Empty />
      </div>

      <Typography
        variant="headline-lg"
        className="font-bold text-neutral-dark mb-2"
      >
        No Projects
      </Typography>

      <Typography
        variant="body-md"
        className="text-neutral-muted mb-6 leading-relaxed max-w-md"
      >
        You do not have any projects yet. Start by defining your first
        architectural workspace to begin tracking tasks and epics.
      </Typography>

      <Link href="/project/add">
        <Button className="px-6 py-2.5 bg-Primary-Gradient cursor-pointer">
          Create New Project
        </Button>
      </Link>
    </div>
  );
};
