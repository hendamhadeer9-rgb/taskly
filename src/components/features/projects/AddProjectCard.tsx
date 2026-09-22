import React from "react";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import Add from "@/../public/add.svg";

export const AddProjectCard = () => {
  return (
    <Link
      href="/project/add"
      className="bg-white border-2 border-dashed border-neutral-border rounded-lg p-6 flex flex-col items-center justify-center min-h-55 hover:border-primary transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center mb-2 ">
        <Add />
      </div>
      <Typography variant="body-md" className="font-bold">
        ADD PROJECT
      </Typography>
    </Link>
  );
};
