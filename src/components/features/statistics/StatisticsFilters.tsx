"use client";

import React, { useState, useRef, useEffect } from "react";
import { TASK_STATUSES } from "@/components/features/tasks/tasksConfig";

export interface FilterState {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  projectId: string; // "ALL" or UUID
  status: string;    // "ALL" or status apiValue
}

export interface ProjectOption {
  id: string;
  name: string;
}

interface StatisticsFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  projects: ProjectOption[];
}

export default function StatisticsFilters({
  filters,
  onChange,
  projects,
}: StatisticsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(filters.startDate);
  const [tempEnd, setTempEnd] = useState(filters.endDate);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  // إغلاق النافذة عند النقر بالخارج
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // تنسيق التاريخ للعرض: "May 11 - May 17, 2025"
  const formatDisplayRange = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return "Select Dates";
    const s = new Date(startStr);
    const e = new Date(endStr);
    const startFormatted = s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endFormatted = e.toLocaleDateString("en-US", {
      month: s.getMonth() === e.getMonth() ? undefined : "short",
      day: "numeric",
      year: "numeric",
    });
    return `${startFormatted} - ${endFormatted}`;
  };

  // التنقل أسبوع للأمام أو للخلف مباشرة من الأسهم
  const shiftWeek = (direction: "prev" | "next") => {
    const s = new Date(filters.startDate);
    const e = new Date(filters.endDate);
    const daysToShift = direction === "next" ? 7 : -7;

    s.setDate(s.getDate() + daysToShift);
    e.setDate(e.getDate() + daysToShift);

    const fmt = (d: Date) => d.toISOString().split("T")[0];
    onChange({
      ...filters,
      startDate: fmt(s),
      endDate: fmt(e),
    });
  };

  const handleApply = () => {
    if (!tempStart || !tempEnd) {
      setErrorMsg("Both dates required");
      return;
    }
    const s = new Date(tempStart);
    const e = new Date(tempEnd);
    if (s > e) {
      setErrorMsg("Start date must be before end date");
      return;
    }
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diff > 7) {
      setErrorMsg("Maximum 7 calendar days allowed");
      return;
    }

    setErrorMsg(null);
    onChange({
      ...filters,
      startDate: tempStart,
      endDate: tempEnd,
    });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 relative">
      {/* Date Range Picker Pill with chevrons */}
      <div className="relative" ref={popoverRef}>
        <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-xs text-sm font-semibold text-[#111827]">
          {/* Prev week arrow */}
          <button
            onClick={() => shiftWeek("prev")}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Date text (opens Popover) */}
          <button
            onClick={() => {
              setTempStart(filters.startDate);
              setTempEnd(filters.endDate);
              setErrorMsg(null);
              setIsOpen(!isOpen);
            }}
            className="px-3 hover:text-primary transition-colors cursor-pointer"
          >
            {formatDisplayRange(filters.startDate, filters.endDate)}
          </button>

          {/* Next week arrow */}
          <button
            onClick={() => shiftWeek("next")}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Date Picker Popover (Figma Screenshot 2) */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl border border-gray-100 shadow-xl p-5 w-80 animate-in fade-in zoom-in-95">
            <h4 className="text-sm font-bold text-[#111827] mb-3">Select Date Range (Max 7 Days)</h4>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">End Date</label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-semibold mb-3">
                ⚠️ {errorMsg}
              </p>
            )}

            {/* Bottom Actions: Cancel & Apply Range */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-[#1565C0] hover:bg-[#0D47A1] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Apply Range
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Dropdowns: All Projects & All Statuses */}
      <div className="flex items-center gap-3">
        {/* Project Select */}
        <div className="relative">
          <select
            value={filters.projectId}
            onChange={(e) => onChange({ ...filters, projectId: e.target.value })}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-9 text-sm font-semibold text-[#111827] shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Status Select */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-9 text-sm font-semibold text-[#111827] shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Statuses</option>
            {TASK_STATUSES.map((status) => (
              <option key={status.id} value={status.apiValue}>
                {status.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}