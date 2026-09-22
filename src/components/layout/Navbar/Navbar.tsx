"use client";

import { useEffect, useState } from "react";
import { Typography } from "../../ui/Typography";
import { getUserData } from "@/api/services/servicesApi";
import Menu from "@/../public/menu.svg";
interface usertype {
  user_metadata: {
    name: string;
    job_title: string;
  };
}
export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [user, setUser] = useState<usertype | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const data = await getUserData();
      if (data) {
        setUser(data);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const userName = user?.user_metadata?.name || "User name";

  const userRole = user?.user_metadata?.job_title || "job title";

  const getAvatarLetters = (name: string) => {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 0 || !parts[0]) return "U";

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const avatarLetter = getAvatarLetters(userName);

  return (
    <header className="h-20 md:h-16 w-full border-b border-b-nav-border bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden"
          aria-label="Open sidebar"
        >
          <Menu />
        </button>
        <Typography variant="title-md" className="md:hidden  font-bold">
          TASKLY
        </Typography>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-3 pl-3 md:pl-4">
          {loading ? (
            <div className="hidden sm:flex flex-col gap-1">
              <div className="w-16 h-3 bg-gray-200 animate-pulse rounded" />
              <div className="w-10 h-2 bg-gray-200 animate-pulse rounded" />
            </div>
          ) : (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-weight-semibold text-neutral-dark capitalize">
                {userName}
              </span>
              <span className="text-weight-bold text-primary">{userRole}</span>
            </div>
          )}

          <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {loading ? "..." : avatarLetter}
          </div>
        </div>
      </div>
    </header>
  );
}
