import React from "react";

interface MembersSkeletonProps {
  count?: number;
}

export default function MembersSkeleton({ count = 5 }: MembersSkeletonProps) {
  return (
    <div className="divide-y divide-neutral-border/10 w-full animate-pulse">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="grid grid-cols-12 items-center px-6 py-4">
          {/* Member Info (Avatar + Name & Email) */}
          <div className="col-span-8 flex items-center gap-3">
            {/* Avatar Circle */}
            <div className="w-9 h-9 rounded-full bg-neutral-200 shrink-0" />

            {/* Text details */}
            <div className="flex flex-col gap-1.5 min-w-0">
              {/* Display Name */}
              <div className="h-4 w-32 bg-neutral-200 rounded" />
              {/* Email */}
              <div className="h-3 w-44 bg-neutral-100 rounded" />
            </div>
          </div>

          {/* Role Badge */}
          <div className="col-span-4 flex justify-end">
            <div className="h-6 w-16 bg-neutral-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
