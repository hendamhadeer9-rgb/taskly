import React from "react";
import { Epic } from "@/api/services/servicesApi";
import Created from "@/../public/created.svg";
import Cal from "@/../public/cal.svg";

interface EpicCardProps {
  epic: Epic;
  onClick?: () => void;
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
      onClick={onClick}
      className="bg-white rounded-lg p-5 border-l-4 border-primary flex flex-col justify-between h-full w-full min-w-0 shadow-sm  cursor-pointer"
    >
      <div>
        {/* 1. Epic Badge ID */}
        <div className="mb-3">
          <span className="inline-block bg-surface-highest text-primary text-xs font-semibold px-2.5 py-1 rounded-sm ">
            {epic.epic_id}
          </span>
        </div>

        {/* 2. Epic Title */}
        <h3 className="font-semibold text-neutral-dark text-title-md mb-4 ">
          {epic.title}
        </h3>

        {/* 3. Assignee Info */}
        <div className="flex rounded-lg items-center gap-2 mb-6">
          {epic.assignee?.avatar_url ? (
            <img
              src={epic.assignee.avatar_url}
              alt={epic.assignee.name}
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center text-label-sm font-bold shrink-0">
              {getInitials(epic.assignee?.name)}
            </div>
          )}
          <div className="flex flex-col text-xs">
            <span className="text-medium-dark font-medium">Assignee</span>
            <span className="text-neutral-dark text-body-lg font-semibold truncate max-w-35">
              {epic.assignee?.name}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Footer: Created By & Deadline */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1 truncate max-w-37.5">
          <Created />
          <span className="truncate">
            Created by:
            <strong className="font-medium text-slate-600">
              {epic.created_by?.name}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Cal />
          <span>{formatDate(epic.deadline)}</span>
        </div>
      </div>
    </div>
  );
};
