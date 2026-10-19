"use client";

import React, { useEffect, useState } from "react";
import { getTaskDetails } from "@/api/services/servicesApi";
import { TASK_STATUSES } from "@/components/features/tasks/tasksConfig";
import { Button } from "@/components/ui/Button";
import TaskIcon from "@/../public/task.svg";
import Copy from "@/../public/copy.svg";
import Close from "@/../public/close.svg";
import Cal from "@/../public/cal.svg";
import Down from "@/../public/down.svg";
import { toast } from "sonner";

interface TaskDetailsModalProps {
  projectId: string;
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailsModal({
  projectId,
  taskId,
  isOpen,
  onClose,
}: TaskDetailsModalProps) {
  const [task, setTask] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // جلب تفاصيل المهمة عند فتح المودال أو تغير الـ taskId
  useEffect(() => {
    if (!isOpen || !taskId || !projectId) return;

    let isMounted = true;
    setLoading(true);
    setError(false);
    setTask(null);

    async function fetchDetails() {
      const result = await getTaskDetails(projectId, taskId!);
      if (isMounted) {
        if (result.success) {
          setTask(result.data);
        } else {
          setError(true);
        }
        setLoading(false);
      }
    }

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [isOpen, taskId, projectId]);

  // إغلاق المودال بـ Escape Key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // تنسيق التاريخ بالشكل المطلوب: Oct 15, 2025
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // استخراج الحرف الأول بأمان للـ Avatar
  const getInitial = (val: any) => {
    if (!val) return "U";
    if (typeof val === "string") return val.trim().charAt(0).toUpperCase() || "U";
    if (typeof val === "object" && val.name) return val.name.trim().charAt(0).toUpperCase() || "U";
    return "U";
  };

  // استخراج الاسم الصريح
  const getName = (val: any) => {
    if (!val) return null;
    if (typeof val === "string") return val;
    if (typeof val === "object" && val.name) return val.name;
    return null;
  };

  // مطابقة الـ status القادمة من الـ API مع TASK_STATUSES
  const getStatusConfig = (statusValue?: string) => {
    if (!statusValue) return { label: "TO DO", color: "bg-to-do" };
    
    const matched = TASK_STATUSES.find(
      (s) =>
        s.id.toLowerCase() === statusValue.toLowerCase() ||
        s.apiValue?.toLowerCase() === statusValue.toLowerCase() ||
        s.label.toLowerCase() === statusValue.toLowerCase()
    );

    return matched || { label: statusValue.toUpperCase(), color: "bg-slate-300" };
  };

  const statusConfig = getStatusConfig(task?.status);

  // معالجة عنوان معرف المهمة الهيدر ليكون مطابقاً لـ Figma دون تكرار (e.g., TASK-125)
  const formatTaskIdHeader = (taskData: any) => {
    if (!taskData) return "TASK";
    const rawId = taskData.task_id || taskData.id || "";
    if (!rawId) return "TASK";
    if (typeof rawId === "string" && rawId.toUpperCase().startsWith("TASK-")) {
      return rawId.toUpperCase();
    }
    return `TASK-${rawId.slice(0, 5).toUpperCase()}`;
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border border-surface-highest"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Title & Description */}
        <div className="flex-1 p-7 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            {/* Header / Task ID */}
            <div className="flex items-center justify-between pb-4 text-medium-dark">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-dark">
                <TaskIcon />
                <span className="uppercase text-neutral-dark font-bold tracking-wider">
                  {formatTaskIdHeader(task)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard");
                  }}
                  className="flex items-center gap-1.5 text-xs text-medium-dark transition-colors font-medium cursor-pointer hover:text-primary"
                >
                  <Copy />
                  Copy link
                </button>
                <button onClick={onClose} aria-label="Close modal" className="cursor-pointer">
                  <Close />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="py-24 flex flex-col items-center justify-center gap-3">
                <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
                <p className="text-medium-dark text-sm font-medium">Loading task details...</p>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <p className="text-error font-semibold text-sm">Failed to load task details</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setLoading(true);
                    setError(false);
                    getTaskDetails(projectId, taskId!).then((res) => {
                      if (res.success) setTask(res.data);
                      else setError(true);
                      setLoading(false);
                    });
                  }}
                  className="px-4 py-2 text-xs"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Empty State / Task Not Found */}
            {!loading && !error && !task && (
              <div className="py-24 text-center">
                <p className="text-neutral-dark font-medium text-sm">Task not found</p>
              </div>
            )}

            {/* Task Content */}
            {!loading && !error && task && (
              <div className="space-y-5 mt-2">
                {/* Title Display */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/40 block mb-1">
                    TITLE
                  </label>
                  <div className="p-3 bg-white border border-surface-highest rounded-xl">
                    <h3 className="font-bold text-neutral-dark text-base leading-snug">
                      {task.title}
                    </h3>
                  </div>
                </div>

                {/* Description Display */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/40 block mb-1">
                    DESCRIPTION
                  </label>
                  <div className="p-4 bg-white border border-surface-highest rounded-xl min-h-[220px]">
                    <p className="text-xs sm:text-sm text-neutral-dark leading-relaxed whitespace-pre-wrap">
                      {task.description || "No description provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          {!loading && (
            <div className="pt-6 mt-4 border-t border-surface-highest flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-neutral-dark bg-surface-highest rounded-xl cursor-pointer"
              >
                Close
              </Button>
            </div>
          )}
        </div>

        {/* Right Side Controls Sidebar (The 6 Metadata Fields from Figma) */}
        {!loading && !error && task && (
          <div className="w-full md:w-72 bg-condition-box p-6 flex flex-col gap-5 overflow-y-auto max-h-[90vh]">
            {/* 1. STATUS */}
            <div>
              <label className="block text-[11px] font-bold text-medium-dark uppercase tracking-wider mb-2">
                STATUS
              </label>
              <div className="px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                  <span className="font-semibold text-neutral-dark">{statusConfig.label}</span>
                </div>
                <Down />
              </div>
            </div>

            {/* 2. ASSIGNEE */}
            <div>
              <label className="block text-[11px] font-bold text-medium-dark uppercase tracking-wider mb-2">
                ASSIGNEE
              </label>
              <div className="px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl font-medium flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  {getName( task.assignee) ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                        {getInitial( task.assignee)}
                      </div>
                      <span className="truncate text-neutral-dark font-medium">
                        {getName( task.assignee)}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-400">Unassigned</span>
                  )}
                </div>
                <Down />
              </div>
            </div>

            {/* 3. EPIC */}
            <div>
              <label className="block text-[11px] font-bold text-medium-dark uppercase tracking-wider mb-2">
                EPIC
              </label>
              <div className="px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl font-medium flex items-center justify-between">
                <span className="text-neutral-dark truncate">
                  {task.epic.title || "None"}
                </span>
                <Down />
              </div>
            </div>

            {/* 4. DUE DATE */}
            <div>
              <label className="block text-[11px] font-bold text-medium-dark uppercase tracking-wider mb-2">
                DUE DATE
              </label>
              <div className="px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl font-medium flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700">
                  <Cal />
                  <span>{formatDate(task.due_date)}</span>
                </div>
                <Down />
              </div>
            </div>

            {/* 5. CREATED BY */}
            <div>
              <label className="block text-[11px] font-bold text-medium-dark uppercase tracking-wider mb-2">
                CREATED BY
              </label>
              <div className="px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl font-medium flex items-center gap-2">
                {getName( task.created_by) ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      {getInitial( task.created_by)}
                    </div>
                    <span className="truncate text-neutral-dark font-medium">
                      {getName( task.created_by)}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">N/A</span>
                )}
              </div>
            </div>

            {/* 6. CREATED AT */}
            <div>
              <label className="block text-[11px] font-bold text-medium-dark uppercase tracking-wider mb-2">
                CREATED AT
              </label>
              <div className="px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl font-medium flex items-center gap-2 text-slate-700">
                <Cal />
                <span>{formatDate(task.created_at)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}