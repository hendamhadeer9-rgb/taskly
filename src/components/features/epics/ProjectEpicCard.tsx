import React from "react";
import { Epic } from "@/api/services/servicesApi";

interface EpicCardProps {
  epic: Epic;
  onClick?: () => void; // 👈 إضافة خاصية الـ onClick هنا
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const ProjectEpicCard: React.FC<EpicCardProps> = ({ epic, onClick }) => {
  // توليد الحروف الأولى لرمز الـ Avatar في حال عدم وجود صورة
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      onClick={onClick} // 👈 ربط الـ onClick
      className="bg-white rounded-lg p-5 border border-slate-200 flex flex-col justify-between h-full w-full min-w-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" // 👈 إضافة cursor-pointer
    >
      <div>
        {/* 1. Epic Badge ID */}
        <div className="mb-3">
          <span className="inline-block bg-blue-50 text-[#003D9B] text-xs font-semibold px-2.5 py-1 rounded-[4px] border border-blue-100">
            {epic.epic_id}
          </span>
        </div>

        {/* 2. Epic Title */}
        <h3 className="font-semibold text-slate-800 text-base mb-4 line-clamp-2">
          {epic.title}
        </h3>

        {/* 3. Assignee Info */}
        <div className="flex items-center gap-2 mb-6">
          {epic.assignee?.avatar_url ? (
            <img
              src={epic.assignee.avatar_url}
              alt={epic.assignee.name}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#003D9B] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              {getInitials(epic.assignee?.name || "")}
            </div>
          )}
          <div className="flex flex-col text-xs">
            <span className="text-slate-400 font-normal">Assignee</span>
            <span className="text-slate-700 font-medium truncate max-w-[140px]">
              {epic.assignee?.name || "Unassigned"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Footer: Created By & Deadline */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1 truncate max-w-[150px]">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="truncate">
            Created by:{" "}
            <strong className="font-medium text-slate-600">
              {epic.created_by?.name || "N/A"}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(epic.deadline)}</span>
        </div>
      </div>
    </div>
  );
};
