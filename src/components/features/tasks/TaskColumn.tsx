import React from "react";
import { TaskStatusConfig } from "./tasksConfig";

interface TaskColumnProps {
  status: TaskStatusConfig;
}

export function TaskColumn({ status }: TaskColumnProps) {
  return (
    <div className="w-[280px] shrink-0 flex flex-col gap-3">
      {/* 1. Column Header */}
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full ${status.color}`} />
        <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
          {status.label}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
          0
        </span>
      </div>

      {/* 2. Add New Task UI Button */}
      <button
        type="button"
        className="w-full h-11 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-500 transition-colors bg-white/50 cursor-default"
      >
        <span>ADD NEW TASK</span>
      </button>

      {/* 3. Empty State Container */}
      <div className="w-full min-h-[420px] bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col items-center justify-center p-6 text-slate-300">
        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          NO TASKS
        </span>
      </div>
    </div>
  );
}