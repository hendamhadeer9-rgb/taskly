"use server";

import { ProjectUpdateData } from "@/app/project/[id]/edit/page";
import { newEpicFormValues } from "@/app/project/[id]/epics/new/newEpicSchema";
import { ProjectFormData } from "@/app/project/add/page";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export async function getUserData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${baseUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Supabase error response:", await res.text());
      return null;
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export async function addNewProject(data: ProjectFormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(`${baseUrl}/rest/v1/projects`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.title,
        description: data.description,
      }),
    });
    if (response.ok) {
      revalidatePath("/project");

      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
}

export async function getProjects() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(`${baseUrl}/rest/v1/rpc/get_projects`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    }

    return { success: false, data: [] };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, data: [] };
  }
}

export async function getProjectById(projectId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/projects?id=eq.${projectId}`,
      {
        method: "GET",
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();

      return data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function updateProject(
  projectId: string,
  data: ProjectUpdateData,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/projects?id=eq.${projectId}`,
      {
        method: "PATCH",
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name: data.title,
          description: data.description,
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, data: [] };
  }
}

export async function membersList(projectId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/get_project_members?project_id=eq.${projectId}`,
      {
        method: "GET",
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("members123", data);

      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching members:", error);
    return null;
  }
}

export async function newEpic(projectId: string, data: newEpicFormValues) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(`${baseUrl}/rest/v1/epics`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        assignee_id: data.assignee_id,
        project_id: projectId,
        deadline: data.deadline,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create epic");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching members:", error);
    return error;
  }
}
