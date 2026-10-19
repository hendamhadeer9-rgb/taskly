"use client";

import React, { useState } from "react";
import { TASK_STATUSES } from "./tasksConfig";
import { TaskColumn } from "./TaskColumn";
import { CreateTask } from "../../modals/CreateTask";
import { TaskDetailsModal } from "../../modals/TaskDetailsModal"; // تأكدي من المسار الصحيح للمكون

interface TaskBoardProps {
  projectId: string;
}

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("TO_DO");

  // حالات فتح Task Details Modal
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const handleOpenModal = (statusId: string) => {
    setSelectedStatus(statusId);
    setIsModalOpen(true);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="flex gap-4 min-w-max">
          {TASK_STATUSES.map((status) => (
            <TaskColumn
              key={status.id}
              projectId={projectId}
              status={status}
              onAddTask={handleOpenModal}
              onTaskClick={handleTaskClick} // ربط كليك الكارد
            />
          ))}
        </div>
      </div>

      {/* Modal إضافة مهمة */}
      <CreateTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        defaultStatus={selectedStatus}
      />

      {/* Modal عرض تفاصيل المهمة */}
      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTaskId(null);
        }}
        projectId={projectId}
        taskId={selectedTaskId}
      />
    </>
  );
}