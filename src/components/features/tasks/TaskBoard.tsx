"use client";

import React, { useState } from "react";
import { TASK_STATUSES } from "./tasksConfig";
import { TaskColumn } from "./TaskColumn";
import { CreateTask } from "../../modals/CreateTask";

interface TaskBoardProps {
  projectId: string;
}

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("TO_DO");

  const handleOpenModal = (statusId: string) => {
    setSelectedStatus(statusId);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="flex gap-4 min-w-max">
          {TASK_STATUSES.map((status) => (
            <TaskColumn
              key={status.id}
              status={status}
              onAddTask={handleOpenModal}
            />
          ))}
        </div>
      </div>

      <CreateTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        defaultStatus={selectedStatus}
      />
    </>
  );
}
