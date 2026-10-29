"use client";

import React from "react";
import { ProjectTaskCount } from "@/api/services/servicesApi";

interface AllProjectsListProps {
  projects: ProjectTaskCount[];
  isLoading?: boolean;
}

export default function AllProjectsList({ projects, isLoading }: AllProjectsListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-full">
      <div>
        <h3 className="text-base font-bold text-[#111827] mb-6">All Projects</h3>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-sm text-gray-400 py-6 text-center italic">
            No projects found for selected period
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((item) => (
              <div
                key={item.project_id}
                className="flex items-center justify-between text-sm py-1"
              >
                <span className="font-medium text-gray-700 truncate max-w-[200px]">
                  {item.project_name}
                </span>
                <span className="font-bold text-[#111827]">
                  {item.tasks_count} Tasks
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}