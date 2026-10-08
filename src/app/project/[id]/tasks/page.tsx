import React from "react";
import { TaskBoard } from "@/components/features/tasks/TaskBoard";
import Search from "@/../public/search.svg"

interface TasksPageProps {
  params: Promise<{ id: string }>;
}

export default async function TasksPage({ params }: TasksPageProps) {
  const { id: projectId } = await params;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen flex flex-col gap-6">
      {/* 1. Header & Breadcrumbs Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">
            <span>PROJECTS</span>
            <span>&gt;</span>
            <span>Rafiq</span>
            <span>&gt;</span>
            <span className="text-slate-700">TASKS</span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Active Workboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Curating Project Alpha's production pipeline and milestones.
          </p>
        </div>

        {/* Presentational Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            readOnly
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-blue-50/50 border border-blue-100/80 rounded-md focus:outline-none cursor-default text-slate-600 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 2. Empty State Kanban Board */}
      <div className="mt-2">
       <TaskBoard projectId={projectId} />
      </div>
    </div>
  );
}
