export interface TaskStatusConfig {
  id: string;
  label: string;
  color: string; 
  apiValue: string; 
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  project_id: string;
  created_at?: string;
  priority?: string;
  assignee?: {
    name?: string;
    avatar_url?: string;
  };
}

export const TASK_STATUSES: TaskStatusConfig[] = [
  { id: "TO_DO", label: "TO DO", color: "bg-to-do", apiValue: "TO_DO" },
  { id: "IN_PROGRESS", label: "IN PROGRESS", color: "bg-primary-container", apiValue: "IN_PROGRESS" },
  { id: "BLOCKED", label: "BLOCKED", color: "bg-error", apiValue: "BLOCKED" },
  { id: "IN_REVIEW", label: "IN REVIEW", color: "bg-neutral-muted", apiValue: "IN_REVIEW" },
  { id: "READY_FOR_QA", label: "READY FOR QA", color: "bg-ready-for", apiValue: "READY_FOR_QA" },
  { id: "REOPENED", label: "REOPENED", color: "bg-error", apiValue: "REOPENED" },
  { id: "READY_FOR_PROD", label: "READY FOR PROD", color: "bg-production", apiValue: "READY_FOR_PRODUCTION" },
  { id: "DONE", label: "DONE", color: "bg-done", apiValue: "DONE" },
];