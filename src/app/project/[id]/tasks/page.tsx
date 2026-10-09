import React from "react";
import { TaskBoard } from "@/components/features/tasks/TaskBoard";
import Search from "@/../public/search.svg";
import { getProjectById } from "@/api/services/servicesApi";
import Right from "@/../public/right.svg";

interface TasksPageProps {
  params: Promise<{ id: string }>;
}

export default async function TasksPage({ params }: TasksPageProps) {
  const { id: projectId } = await params;
  const project = await getProjectById(projectId);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen flex flex-col gap-4 sm:gap-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Breadcrumbs - يُخفى في الموبايل ويظهر بدءاً من شاشات sm */}
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

          {/* Subtitle - يُخفى في الموبايل ويظهر بدءاً من شاشات sm */}
          <p className="hidden sm:block text-xs sm:text-sm text-neutral-muted mt-1">
            Curating Project Alpha's production pipeline and milestones.
          </p>
        </div>

        {/* Presentational Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            readOnly
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-primary-container/20 rounded-md focus:outline-none cursor-default text-medium-dark placeholder:text-medium-dark"
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
