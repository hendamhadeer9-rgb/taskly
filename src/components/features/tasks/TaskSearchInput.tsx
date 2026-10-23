"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Search from "@/../public/search.svg";

export function TaskSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (searchTerm === currentSearch) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      } else {
        params.delete("search");
      }

      params.delete("page");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, currentSearch, pathname, router, searchParams]);

  return (
    <div className="relative w-full sm:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted w-4 h-4" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks..."
        className="w-full pl-9 pr-3 py-2 text-sm bg-primary-container/20 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-neutral-dark placeholder:text-neutral-muted transition-all"
      />
    </div>
  );
}