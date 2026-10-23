import React, { Suspense } from "react";
import { TaskBoard } from "@/components/features/tasks/TaskBoard";
import { TaskSearchInput } from "@/components/features/tasks/TaskSearchInput";
import { getProjectById } from "@/api/services/servicesApi";
import Right from "@/../public/right.svg";

interface TasksPageProps {
  params: Promise<{ id: string }>;
}

export default async function TasksPage({ params }: TasksPageProps) {
  const { id: projectId } = await params;
  const project = await getProjectById(projectId);

  return (
    <div className="p-4 sm:p-6 md:p-8 sm:max-w-312.5 max-w-97.5 mx-auto min-h-screen flex flex-col gap-4 sm:gap-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold tracking-wider text-neutral-muted uppercase mb-2">
            <span>PROJECTS</span>
            <Right />
            <span>{project?.name}</span>
            <Right />
            <span className="text-neutral-dark">TASKS</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Active Workboard
          </h1>

          <p className="hidden sm:block text-xs sm:text-sm text-neutral-muted mt-1">
            Curating {project?.name || "Project"}'s production pipeline and milestones.
          </p>
        </div>

        {/* التفاعل الحي للبحث */}
        <Suspense fallback={<div className="w-89.5 md:w-72 h-9 bg-slate-100 rounded-md animate-pulse" />}>
          <TaskSearchInput />
        </Suspense>
      </div>

      {/* 2. Kanban Board */}
      <div className="mt-2">
        <Suspense fallback={null}>
          <TaskBoard projectId={projectId} />
        </Suspense>
      </div>
    </div>
  );
}