"use client";

import React from "react";
import { TASK_STATUSES } from "@/components/features/tasks/tasksConfig";

interface TasksByStatusChartProps {
  totals: Record<string, number>;
  totalTasks: number;
}

// مطابقة ألوان فيجما بدقة للحالات الرئيسية
const STATUS_COLORS: Record<string, string> = {
  IN_PROGRESS: "#1565C0", // أزرق غامق
  DONE: "#0B6E4F",        // أخضر
  BLOCKED: "#C62828",     // أحمر
  TO_DO: "#90CAF9",       // أزرق فاتح
  IN_REVIEW: "#9E9E9E",
  READY_FOR_QA: "#FB8C00",
  REOPENED: "#E53935",
  READY_FOR_PRODUCTION: "#6A1B9A",
};

export default function TasksByStatusChart({ totals = {}, totalTasks = 0 }: TasksByStatusChartProps) {
  // تصفية الحالات التي لها مهام فقط
  const activeEntries = Object.entries(totals).filter(([_, count]) => count > 0);

  // حساب أقواس الـ SVG Donut بدقة وبدون أي مكتبة خارجية ثقيلة
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-full">
      <h3 className="text-base font-bold text-[#111827] mb-6">Tasks by Status</h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Donut Chart */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Circle if 0 tasks */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {totalTasks > 0 &&
              activeEntries.map(([statusKey, count]) => {
                const percent = count / totalTasks;
                const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
                const strokeDashoffset = -circumference * accumulatedPercent;
                accumulatedPercent += percent;

                const color = STATUS_COLORS[statusKey] || "#94A3B8";

                return (
                  <circle
                    key={statusKey}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-[#111827] leading-none">
              {totalTasks}
            </span>
            <span className="text-xs text-gray-400 font-medium mt-1">Total</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col gap-3 w-full max-w-[240px]">
          {activeEntries.length === 0 ? (
            <div className="text-sm text-gray-400 italic">No tasks in this period</div>
          ) : (
            activeEntries.map(([statusKey, count]) => {
              const statusConfig = TASK_STATUSES.find((s) => s.apiValue === statusKey);
              const label = statusConfig?.label || statusKey;
              const color = STATUS_COLORS[statusKey] || "#94A3B8";

              return (
                <div key={statusKey} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-gray-600 font-medium truncate capitalize">
                      {label.toLowerCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div
                      className="h-1 rounded-full w-12 hidden sm:block opacity-60"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-bold text-[#111827] min-w-[18px] text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}