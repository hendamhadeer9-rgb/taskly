export interface TaskStatusConfig {
  id: string;
  label: string;
  color: string; // لون نقطة الحالة
}

export const TASK_STATUSES: TaskStatusConfig[] = [
  { id: "TO_DO", label: "TO DO", color: "bg-to-do" },
  { id: "IN_PROGRESS", label: "IN PROGRESS", color: "bg-Primary-Container" },
  { id: "BLOCKED", label: "BLOCKED", color: "bg-error" },
  { id: "IN_REVIEW", label: "IN REVIEW", color: "bg-neutral-muted" },
  { id: "READY_FOR_QA", label: "READY FOR QA", color: "bg-ready-for" },
  { id: "REOPENED", label: "REOPENED", color: "bg-error" },
  { id: "READY_FOR_PROD", label: "READY FOR PROD", color: "bg-production" },
  { id: "DONE", label: "DONE", color: "bg-done" },
];
