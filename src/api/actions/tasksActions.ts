
"use server";

import { getTasksByStatus } from "@/api/services/servicesApi";
import { Task } from "@/components/features/tasks/tasksConfig";

export async function fetchColumnTasksAction(projectId: string, statusValue: string): Promise<Task[]> {
  try {
    return await getTasksByStatus(projectId, statusValue);
  } catch (error) {
    throw error;
  }
}