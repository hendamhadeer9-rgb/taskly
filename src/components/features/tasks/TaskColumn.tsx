"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { TaskStatusConfig } from "./tasksConfig";
import { getPaginatedTasksByStatus } from "@/api/services/servicesApi";
import { Task } from "@/components/features/tasks/tasksConfig";

interface TaskColumnProps {
  projectId: string;
  status: TaskStatusConfig;
  searchTerm?: string;
  onAddTask?: (statusId: string) => void;
  onTaskClick?: (taskId: string) => void;
}

// Inline SVG Icons to ensure exact sizing and styling
function PlusCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5.5v5M5.5 8h5" />
    </svg>
  );
}

function CalendarIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="12" height="11" rx="2" />
      <path d="M11 1.5v3M5 1.5v3M2 7h12" />
    </svg>
  );
}

function AlertTriangleIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.134 2.5a1 1 0 0 1 1.732 0l5.196 9A1 1 0 0 1 13.196 13H2.804a1 1 0 0 1-.866-1.5l5.196-9z" />
      <path d="M8 6v3.5M8 11.5h.01" />
    </svg>
  );
}

// Helper to format due date to match Image 1 ("OCT 12", "TODAY", or "DELAYED")
function formatCardDate(dueDate?: string | null, isBlockedStatus?: boolean) {
  if (isBlockedStatus) {
    return { text: "DELAYED", isDelayed: true, isToday: false };
  }

  if (!dueDate) {
    return null;
  }

  const date = new Date(dueDate);
  if (isNaN(date.getTime())) {
    return { text: dueDate, isDelayed: false, isToday: false };
  }

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return { text: "TODAY", isDelayed: false, isToday: true };
  }

  // Check if date is strictly in the past (overdue)
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  if (dateMidnight < todayMidnight) {
    return { text: "DELAYED", isDelayed: true, isToday: false };
  }

  // Format as e.g. "OCT 12"
  const formatted = date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase();

  return { text: formatted, isDelayed: false, isToday: false };
}

// Helper to get 2-letter uppercase initials for avatar
function getAssigneeInitials(assignee: any): string {
  if (!assignee) return "MT";
  if (typeof assignee === "string") {
    const parts = assignee.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return assignee.slice(0, 2).toUpperCase();
  }
  const name = assignee.name || assignee.email || "";
  if (!name) return "MT";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Helper for avatar background and text color matching design
function getAvatarStyle(initials: string) {
  if (initials === "SK") return "bg-blue-600 text-white";
  if (initials === "MT" || initials === "JD") return "bg-blue-100 text-blue-700";

  const styles = [
    "bg-blue-100 text-blue-700",
    "bg-blue-600 text-white",
    "bg-indigo-100 text-indigo-700",
    "bg-sky-100 text-sky-700",
  ];
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return styles[Math.abs(hash) % styles.length];
}

export function TaskColumn({
  projectId,
  status,
  searchTerm = "",
  onAddTask,
  onTaskClick,
}: TaskColumnProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const limit = 10;

  const containerRef = useRef<HTMLDivElement>(null);
  const currentSearchTermRef = useRef(searchTerm);

  const isBlocked =
    status.id.toUpperCase() === "BLOCKED" ||
    status.apiValue?.toUpperCase() === "BLOCKED";

  useEffect(() => {
    currentSearchTermRef.current = searchTerm;
  }, [searchTerm]);

  const fetchInitialTasks = useCallback(
    async (isSubscribed: () => boolean) => {
      setIsLoading(true);
      setError(null);

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }

      const result = await getPaginatedTasksByStatus(
        projectId,
        status.apiValue,
        limit,
        0,
        searchTerm
      );

      if (!isSubscribed()) return;

      if (result.success) {
        setTasks(result.data);
        setTotalCount(result.totalCount);
        setOffset(result.data.length);

        if (result.data.length >= result.totalCount || result.data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        setError("Failed to load tasks");
      }
      setIsLoading(false);
    },
    [projectId, status.apiValue, status.id, searchTerm]
  );

  useEffect(() => {
    let isActive = true;

    fetchInitialTasks(() => isActive);

    return () => {
      isActive = false;
    };
  }, [fetchInitialTasks]);

  const loadMoreTasks = async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    const activeSearch = currentSearchTermRef.current;

    const result = await getPaginatedTasksByStatus(
      projectId,
      status.apiValue,
      limit,
      offset,
      activeSearch
    );

    if (activeSearch !== currentSearchTermRef.current) {
      setIsFetchingMore(false);
      return;
    }

    if (result.success) {
      setTasks((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTasks = result.data.filter((t) => !existingIds.has(t.id));
        const updatedList = [...prev, ...newTasks];

        if (
          result.data.length < limit ||
          updatedList.length >= result.totalCount
        ) {
          setHasMore(false);
        }

        return updatedList;
      });

      setTotalCount(result.totalCount);
      setOffset((prev) => prev + result.data.length);
    } else {
      setError("Failed to load more tasks");
    }

    setIsFetchingMore(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !isFetchingMore && hasMore) {
      loadMoreTasks();
    }
  };

  return (
    <div className="w-[280px] shrink-0 flex flex-col gap-3">
      {/* 1. Column Header */}
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
        <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
          {status.label}
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            isBlocked
              ? "bg-red-50 text-red-500"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {isLoading ? "-" : totalCount}
        </span>
      </div>

      {/* 2. Add New Task Button */}
      <button
        type="button"
        onClick={() => onAddTask?.(status.id)}
        className="w-full h-11 border border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors bg-white/50 hover:bg-white cursor-pointer tracking-wider"
      >
        <PlusCircleIcon className="w-4 h-4 text-slate-400" />
        <span>ADD NEW TASK</span>
      </button>

      {/* 3. Content Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-[520px] flex flex-col p-1 gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200"
      >
        {/* Initial Loading */}
        {isLoading && (
          <div className="space-y-3 animate-pulse pt-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="my-auto p-4 bg-red-50 border border-red-200 rounded-xl text-center flex flex-col gap-2">
            <p className="text-xs text-red-600 font-medium">{error}</p>
            <button
              onClick={() => {
                let active = true;
                fetchInitialTasks(() => active);
              }}
              className="text-xs font-semibold text-red-700 underline hover:text-red-800 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="my-auto flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              {searchTerm.trim() ? "NO MATCHING TASKS" : "NO TASKS"}
            </span>
            {searchTerm.trim() && (
              <span className="text-[11px] text-slate-400 mt-1">
                No tasks match "{searchTerm.trim()}"
              </span>
            )}
          </div>
        )}

        {/* Task Cards matching Image 1 */}
        {!isLoading &&
          tasks.map((task) => {
            const dateInfo = formatCardDate(
              task.due_date || task.created_at,
              isBlocked
            );
            const initials = getAssigneeInitials(task.assignee);
            const avatarStyle = getAvatarStyle(initials);

            return (
              <div
                key={task.id}
                onClick={() => onTaskClick?.(task.id)}
                className={`p-4 rounded-xl border flex flex-col justify-between min-h-[105px] gap-3 cursor-pointer transition-all hover:shadow-md ${
                  isBlocked
                    ? "bg-[#FEF2F2] border-[#FEE2E2] hover:border-red-200"
                    : "bg-white border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-200"
                }`}
              >
                {/* Title */}
                <h4 className="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2">
                  {task.title}
                </h4>

                {/* Footer: Date / Delayed indicator + Assignee Avatar */}
                <div className="flex items-center justify-between pt-1 mt-auto">
                  {/* Left: Date / Delayed */}
                  {dateInfo ? (
                    <div
                      className={`flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase ${
                        dateInfo.isDelayed
                          ? "text-red-500"
                          : dateInfo.isToday
                          ? "text-blue-600"
                          : "text-slate-400 font-semibold"
                      }`}
                    >
                      {dateInfo.isDelayed ? (
                        <AlertTriangleIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      ) : (
                        <CalendarIcon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            dateInfo.isToday ? "text-blue-600" : "text-slate-400"
                          }`}
                        />
                      )}
                      <span>{dateInfo.text}</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Right: Assignee Avatar */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarStyle}`}
                    title={
                      typeof task.assignee === "object"
                        ? task.assignee?.name
                        : task.assignee || "Assignee"
                    }
                  >
                    {task.assignee?.avatar_url ? (
                      <img
                        src={task.assignee.avatar_url}
                        alt={initials}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {/* Loading Indicator for More Tasks */}
        {isFetchingMore && (
          <div className="py-2 text-center">
            <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
          </div>
        )}
      </div>
    </div>
  );
}
