import React from "react";
import { TASK_STATUSES } from "./tasksConfig";
import { TaskColumn } from "./TaskColumn";

export function TaskBoard() {
  return (
    <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200">
      <div className="flex gap-4 min-w-max">
        {TASK_STATUSES.map((status) => (
          <TaskColumn key={status.id} status={status} />
        ))}
      </div>
    </div>
  );
}