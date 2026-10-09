"use server";

import { ProjectUpdateData } from "@/app/project/[id]/edit/page";
import { newEpicFormValues } from "@/app/project/[id]/epics/new/newEpicSchema";
import { ProjectFormData } from "@/app/project/add/page";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface UserInfo {
  sub: string;
  name: string;
  email: string;
  department?: string;
  avatar_url?: string;
}

export interface CreateTaskPayload {
  project_id: string;
  title: string;
  description?: string | null;
  epic_id?: string | null;
  assignee_id?: string | null;
  due_date?: string | null;
  status?: string;
}

export interface Epic {
  id: string;
  epic_id: string;
  title: string;
  description?: string;
  deadline: string;
  created_at: string;
  created_by: UserInfo;
  assignee: UserInfo;
}

export interface FetchProjectsResponse {
  data: any[];
  totalCount: number;
}
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

export async function getProjects(limit: number = 10, offset: number = 0) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();

      // 1. استخراج Content-Range header وقراءة إجمالي العدد totalCount
      const contentRange = response.headers.get("Content-Range");
      let totalCount = 0;

      if (contentRange) {
        const parts = contentRange.split("/");
        if (parts.length === 2) {
          const totalStr = parts[1].trim();
          if (totalStr !== "*") {
            const parsedTotal = parseInt(totalStr, 10);
            if (!isNaN(parsedTotal)) {
              totalCount = parsedTotal;
            }
          }
        }
      }

      return { success: true, data, totalCount };
    }

    return { success: false, data: [], totalCount: 0 };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, data: [], totalCount: 0 };
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
      // ✅ تم تصحيح الجدول
      method: "POST",
      headers: {
        apikey: apiKey!,
        Authorization: `Bearer ${token}`, // ✅ استخدام apiKey كـ fallback لو الـ token غير موجود
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        title: data.name, // ✅ تصحيح الاسم ليكون name
        description: data.description || null,
        // ✅ منع إرسال السلاسل الفارغة "" للحقول التي تتوقع UUID أو Date في Supabase
        assignee_id: data.assignee_id ? data.assignee_id : null,
        project_id: projectId,
        deadline: data.deadline ? data.deadline : null,
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("Supabase Error Details:", errorDetail);
      throw new Error(`Failed to create epic: ${errorDetail}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in newEpic execution:", error);
    throw error; // 🛑 مهم جداً: إلقاء الخطأ حتى يعرف الـ UI إن العملية فشلت
  }
}

export async function fetchPagination(
  limit: number,
  offset: number,
): Promise<FetchProjectsResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await fetch(
    `${baseUrl}/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "count=exact",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load projects");
  }

  const data = await response.json();

  // 1. استخراج Content-Range header
  const contentRange = response.headers.get("Content-Range");
  let totalCount = 0;

  if (contentRange) {
    // تنسيق الهيدر عادة يكون: "0-9/100"
    const parts = contentRange.split("/");
    if (parts.length === 2) {
      const parsedTotal = parseInt(parts[1], 10);
      if (!isNaN(parsedTotal)) {
        totalCount = parsedTotal;
      }
    }
  }

  return {
    data,
    totalCount,
  };
}

export async function getProjectEpics(
  projectId: string,
): Promise<{ success: boolean; data?: Epic[]; error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/project_epics?project_id=eq.${projectId}`,
      {
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch epics: ${response.statusText}`);
    }

    const data: Epic[] = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" };
  }
}

// دالة منفصلة تماماً للـ Pagination الخاصة بالـ Epics
export async function getPaginatedProjectEpics(
  projectId: string,
  limit: number = 10,
  offset: number = 0,
  search: string = "",
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const searchQuery = search.trim()
      ? `&title=ilike.*${encodeURIComponent(search.trim())}*`
      : "";
    const response = await fetch(
      `${baseUrl}/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}${searchQuery}`,
      {
        method: "GET",
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "count=exact", // ضروري لرجوع Total Count من Supabase
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return { success: false, data: [], totalCount: 0 };
    }

    const data = await response.json();

    // 1. قراءة الهيدر بغض النظر عن حالة الأحرف (Content-Range / content-range)
    const contentRange =
      response.headers.get("content-range") ||
      response.headers.get("Content-Range");

    let totalCount = 0;

    if (contentRange) {
      // القيمة تكون بالشكل: "0-9/25" أو "0-4/5"
      const totalStr = contentRange.split("/")[1];
      if (totalStr && totalStr !== "*") {
        totalCount = parseInt(totalStr, 10);
      }
    }

    // fallback إذا لم يتوفر الهيدر
    if (!totalCount) {
      totalCount = Array.isArray(data) ? data.length : 0;
    }

    console.log("Debug Pagination:", { contentRange, totalCount, limit });

    return {
      success: true,
      data: Array.isArray(data) ? data : [],
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching paginated project epics:", error);
    return { success: false, data: [], totalCount: 0 };
  }
}

export async function getEpicDetails(projectId: string, epicId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
      {
        method: "GET",
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return { success: false, data: null };
    }

    const data = await response.json();
    // Supabase يرجع Array تحتوي على عنصر واحد
    const epic = Array.isArray(data) && data.length > 0 ? data[0] : null;

    return {
      success: !!epic,
      data: epic,
    };
  } catch (error) {
    console.error("Error fetching epic details:", error);
    return { success: false, data: null };
  }
}

export async function addNewTask(data: CreateTaskPayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(`${baseUrl}/rest/v1/tasks`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        project_id: data.project_id,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        epic_id: data.epic_id || null,
        assignee_id: data.assignee_id || null,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
        status: data.status || "TO_DO",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase error response:", errorText);
      return { success: false, error: errorText || "Failed to create task" };
    }

    const result = await response.json();
    revalidatePath(`/project/${data.project_id}/tasks`);

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Fetch error creating task:", error);
    return { success: false, error: error.message || "Failed to create task" };
  }
}
