"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Search from "@/../public/search.svg";

export function EpicSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const isFirstRender = useRef(true);

  // تحديث الـ Input إذا تغير الـ URL من الخارج
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    // منع التشغيل في أول Render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // إذا كانت القيمة لم تتغير عن الـ URL الحالي لا تقم بعمل Navigation
    if (searchTerm === currentSearch) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]); // 👈 اقتصر الـ Dependencies على searchTerm فقط

  return (
    <div className="relative flex-1 sm:w-[303px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search epics..."
        className="w-full pl-9 pr-3 py-[6px] h-[48px] text-sm bg-slate-50 border border-slate-200 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B]"
      />
    </div>
  );
}
