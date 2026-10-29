"use client";

import React from "react";

interface KpiCardsProps {
  totalTasks: number;
  doneTasks: number;
  overdueTasks: number;
  isLoading?: boolean;
}

export default function KpiCards({
  totalTasks,
  doneTasks,
  overdueTasks,
  isLoading,
}: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Total Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            TOTAL TASKS
          </span>
          <div className="mt-1">
            {isLoading ? (
              <div className="h-9 w-16 bg-gray-100 animate-pulse rounded-md" />
            ) : (
              <span className="text-3xl font-extrabold text-[#111827]">
                {totalTasks}
              </span>
            )}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#EBF3FF] flex items-center justify-center text-[#2563EB]">
          {/* Clipboard Icon */}
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
      </div>

      {/* 2. Completed Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            COMPLETED TASKS
          </span>
          <div className="mt-1">
            {isLoading ? (
              <div className="h-9 w-16 bg-gray-100 animate-pulse rounded-md" />
            ) : (
              <span className="text-3xl font-extrabold text-[#111827]">
                {doneTasks}
              </span>
            )}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#EAF7EE] flex items-center justify-center text-[#16A34A]">
          {/* Check Circle Icon */}
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* 3. Overdue Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            OVERDUE TASKS
          </span>
          <div className="mt-1">
            {isLoading ? (
              <div className="h-9 w-16 bg-gray-100 animate-pulse rounded-md" />
            ) : (
              <span className="text-3xl font-extrabold text-[#DC2626]">
                {overdueTasks}
              </span>
            )}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
          {/* Warning Triangle Icon */}
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>
  );
}