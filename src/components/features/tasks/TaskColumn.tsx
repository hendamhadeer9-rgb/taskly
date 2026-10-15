"use client";

import React, { useEffect, useState, useCallback } from "react";
import { TaskStatusConfig } from "./tasksConfig";
import { Task } from "@/components/features/tasks/tasksConfig";
import { getTasksByStatus } from "@/api/services/servicesApi"; // أو الـ Server Action الخاص بك
// import { TaskCard } from "./TaskCard"; // قم باستيراد كارت التاسك الخاص بك

interface TaskColumnProps {
  projectId: string;
  status: TaskStatusConfig;
  onAddTask?: (statusId: string) => void;
}

export function TaskColumn({ projectId, status, onAddTask }: TaskColumnProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // جلب المهام بناءً على الـ label أو الـ apiValue المطابق للـ backend
      const data = await getTasksByStatus(projectId, status.label);
      setTasks(data);
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, status.label]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="w-[280px] shrink-0 flex flex-col gap-3">
      {/* 1. Column Header */}
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full ${status.color}`} />
        <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
          {status.label}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
          {isLoading ? "..." : tasks.length}
        </span>
      </div>

      {/* 2. Add New Task UI Button */}
      <button
        type="button"
        onClick={() => onAddTask?.(status.id)}
        className="w-full h-11 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-500 transition-colors bg-white/50 cursor-pointer"
      >
        <span>ADD NEW TASK</span>
      </button>

      {/* 3. Content Container (Loading / Error / Empty / Success) */}
      <div className="w-full min-h-[420px] bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col p-3 gap-3 overflow-y-auto">
        {/* Loading State (Skeleton) */}
        {isLoading && (
          <div className="space-y-3 animate-pulse pt-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-200/70 rounded-lg w-full" />
            ))}
          </div>
        )}

        {/* Error State with Retry */}
        {!isLoading && error && (
          <div className="my-auto p-4 bg-red-50 border border-red-200 rounded-lg text-center flex flex-col gap-2">
            <p className="text-xs text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchTasks}
              className="text-xs font-semibold text-red-700 underline hover:text-red-800 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="my-auto flex flex-col items-center justify-center p-6 text-slate-300">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              NO TASKS
            </span>
          </div>
        )}

        {/* Success State (Task Cards) */}
        {!isLoading &&
          !error &&
          tasks.length > 0 &&
          tasks.map((task) => (
            // استبدل الـ div أدناه بـ <TaskCard task={task} /> الخاص بك
            <div
              key={task.id}
              className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1.5"
            >
              <h4 className="text-xs font-bold text-slate-700 line-clamp-2">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}