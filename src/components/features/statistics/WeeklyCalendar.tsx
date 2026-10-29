"use client";

import React from "react";
import { DailyStat } from "@/api/services/servicesApi";

interface WeeklyCalendarProps {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  dailyStats: DailyStat[];
  isLoading?: boolean;
}

// ألوان الحالات داخل أعمدة الأيام كما في فيجما
const STATUS_STYLES: Record<string, { bg: string; text: string; label: string; border?: string }> = {
  TO_DO: { bg: "bg-[#F3F4F6]", text: "text-[#374151]", label: "TO DO" },
  IN_PROGRESS: { bg: "bg-[#EBF3FF]", text: "text-[#1D4ED8]", label: "IN PROGRESS", border: "border-l-[3px] border-[#1D4ED8]" },
  ACTIVE: { bg: "bg-[#EBF3FF]", text: "text-[#1D4ED8]", label: "ACTIVE" },
  BLOCKED: { bg: "bg-[#FEF2F2]", text: "text-[#DC2626]", label: "BLOCKED" },
  DONE: { bg: "bg-[#EAF7EE]", text: "text-[#15803D]", label: "DONE" },
  IN_REVIEW: { bg: "bg-[#F3F4F6]", text: "text-[#4B5563]", label: "IN REVIEW" },
  READY_FOR_QA: { bg: "bg-[#FFF7ED]", text: "text-[#C2410C]", label: "READY FOR QA" },
  REOPENED: { bg: "bg-[#FEF2F2]", text: "text-[#DC2626]", label: "REOPENED" },
  READY_FOR_PRODUCTION: { bg: "bg-[#FAF5FF]", text: "text-[#7E22CE]", label: "READY FOR PROD" },
};

export default function WeeklyCalendar({
  startDate,
  endDate,
  dailyStats,
  isLoading,
}: WeeklyCalendarProps) {
  // توليد قائمة الأيام بين startDate و endDate
  const days: { dateStr: string; dayName: string; formattedDate: string; isToday: boolean }[] = [];
  
  if (startDate && endDate) {
    const current = new Date(startDate);
    const end = new Date(endDate);
    const todayStr = new Date().toISOString().split("T")[0];

    while (current <= end && days.length < 7) {
      const dateStr = current.toISOString().split("T")[0];
      const dayName = current.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
      const formattedDate = current.toLocaleDateString("en-US", { day: "numeric", month: "short" });
      const isToday = dateStr === todayStr;

      days.push({ dateStr, dayName, formattedDate, isToday });
      current.setDate(current.getDate() + 1);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {days.map((day) => {
        // جلب حالات هذا اليوم
        const dayData = dailyStats.find((d) => d.day === day.dateStr);
        const statuses = dayData?.statuses || {};
        const entries = Object.entries(statuses).filter(([_, count]) => count > 0);
        const hasTasks = entries.length > 0;

        return (
          <div
            key={day.dateStr}
            className={`bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[380px] transition-all relative ${
              day.isToday
                ? "border-2 border-[#1D4ED8] shadow-[0_4px_16px_rgba(29,78,216,0.08)]"
                : "border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            }`}
          >
            {/* Today Badge Floating on top border */}
            {day.isToday && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0C3894] text-white text-[9px] font-extrabold tracking-widest px-3 py-0.5 rounded-full uppercase shadow-xs">
                TODAY
              </div>
            )}

            {/* Header: SUN / 11 May */}
            <div>
              <div className="mb-4">
                <span className={`text-[11px] font-bold tracking-wider ${day.isToday ? "text-[#1D4ED8]" : "text-gray-400"}`}>
                  {day.dayName}
                </span>
                <h4 className={`text-base font-extrabold mt-0.5 ${day.isToday ? "text-[#1D4ED8]" : "text-[#111827]"}`}>
                  {day.formattedDate}
                </h4>
              </div>

              {/* Status Chips List */}
              {isLoading ? (
                <div className="space-y-2 mt-4">
                  <div className="h-7 bg-gray-100 animate-pulse rounded-lg" />
                  <div className="h-7 bg-gray-100 animate-pulse rounded-lg" />
                </div>
              ) : hasTasks ? (
                <div className="flex flex-col gap-2 mt-2">
                  {entries.map(([statusKey, count]) => {
                    const style = STATUS_STYLES[statusKey] || {
                      bg: "bg-gray-100",
                      text: "text-gray-700",
                      label: statusKey,
                    };

                    return (
                      <div
                        key={statusKey}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold ${style.bg} ${style.text} ${style.border || ""}`}
                      >
                        <span className="truncate pr-1 text-[11px] uppercase tracking-wider">
                          {style.label}
                        </span>
                        <span className="font-extrabold ml-1">{count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* Empty State: NO TASKS Icon & Label */}
            {!isLoading && !hasTasks && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                {/* Outlined Calendar with X */}
                <div className="w-8 h-8 rounded-lg border-2 border-gray-200 border-dashed flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  NO TASKS
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}