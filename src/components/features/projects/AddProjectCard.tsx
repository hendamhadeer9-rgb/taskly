import React from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";

export const AddProjectCard = () => {
  return (
    <Link
      href="/project/add"
      className="bg-white border-2 border-dashed border-neutral-border rounded-lg p-6 flex flex-col items-center justify-center min-h-55 hover:border-primary transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
        <Icon name="Loupe" width={20} height={20}></Icon>
      </div>
      <Typography variant="body-md" className="font-bold">
        ADD PROJECT
      </Typography>
    </Link>
  );
};
