export interface TaskStatusConfig {
  id: string;
  label: string;
  color: string; // لون نقطة الحالة
}

export const TASK_STATUSES: TaskStatusConfig[] = [
  { id: "todo", label: "TO DO", color: "bg-to-do" },
  { id: "in_progress", label: "IN PROGRESS", color: "bg-Primary-Container" },
  { id: "blocked", label: "BLOCKED", color: "bg-error" },
  { id: "in_review", label: "IN REVIEW", color: "bg-neutral-muted" },
  { id: "ready_for_qa", label: "READY FOR QA", color: "bg-ready-for" },
  { id: "reopened", label: "REOPENED", color: "bg-error" },
  { id: "ready_for_prod", label: "READY FOR PROD", color: "bg-production" },
  { id: "done", label: "DONE", color: "bg-done" },
];