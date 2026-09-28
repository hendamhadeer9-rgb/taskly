"use client";

import React, { useEffect, useState } from "react";
import { getUserData } from "@/api/services/servicesApi";
import MembersSkeleton from "./MembersSkeleton";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  isOwner: boolean;
  metadata: {
    name: string;
    email: string;
  };
}

interface MemberListTableProps {
  members: Member[];
}

export default function MemberListTable({ members }: MemberListTableProps) {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    setLoading(true);
    try {
      const response = await getUserData();

      if (response) {
        const name = response.metadata?.name;
        const email = response.email;

        setCurrentUser({ name, email });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <MembersSkeleton />;
  }

  

  if (!members || members.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-neutral-muted">
        No members found in this project.
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-border/10">
      {members.map((member) => {
        const displayName = member.metadata?.name;
        const memberEmail = member.email;

        const displayRole = member.role;
        const isOwner = displayRole;

        const nameParts = displayName.trim().split(/\s+/);
        const initials =
          nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : `${nameParts[0][0]}`.toUpperCase();
        return (
          <div
            key={member.id }
            className="grid grid-cols-12 items-center px-6 py-4 "
          >
            {/* Member Info */}
            <div className="col-span-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-surface-highest text-primary font-semibold text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-body-md font-semibold text-neutral-dark">
                  {displayName}
                </span>

                <span className="text-label-sm font-regular text-neutral-muted">
                  {memberEmail}
                </span>
              </div>
            </div>

            {/* Role Badge */}
            <div className="col-span-4 flex justify-end">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isOwner
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-muted border border-neutral-200"
                }`}
              >
                {displayRole}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
