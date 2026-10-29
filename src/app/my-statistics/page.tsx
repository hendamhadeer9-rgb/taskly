"use client";

import React, { useEffect, useState, useCallback } from "react";
import StatisticsFilters, {
  FilterState,
  ProjectOption,
} from "@/components/features/statistics/StatisticsFilters";
import KpiCards from "@/components/features/statistics/KpiCards";
import WeeklyCalendar from "@/components/features/statistics/WeeklyCalendar";
import TasksByStatusChart from "@/components/features/statistics/TasksByStatusChart";
import AllProjectsList from "@/components/features/statistics/AllProjectsList";
import {
  getTasksCalendarStats,
  getTasksCountPerProject,
  getProjects,
  CalendarStatsResponse,
  ProjectTaskCount,
} from "@/api/services/servicesApi";

// دالة لحساب الأسبوع الحالي (7 أيام تبدأ من الأحد كما في فيجما)
function getDefaultWeekRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const start = new Date(now);
  start.setDate(now.getDate() - day);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return {
    startDate: fmt(start),
    endDate: fmt(end),
  };
}

export default function MyStatisticsPage() {
  const initialRange = getDefaultWeekRange();

  // حالة الفلاتر
  const [filters, setFilters] = useState<FilterState>({
    startDate: initialRange.startDate,
    endDate: initialRange.endDate,
    projectId: "ALL",
    status: "ALL",
  });

  // البيانات
  const [projectsList, setProjectsList] = useState<ProjectOption[]>([]);
  const [statsData, setStatsData] = useState<CalendarStatsResponse | null>(null);
  const [projectCounts, setProjectCounts] = useState<ProjectTaskCount[]>([]);

  // حالات التحميل والخطأ
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. جلب قائمة المشاريع مرة واحدة عند فتح الصفحة لتعبئة الـ Dropdown
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await getProjects(100, 0);
        if (res.success && Array.isArray(res.data)) {
          setProjectsList(
            res.data.map((p: any) => ({
              id: p.id || p.project_id,
              name: p.name || p.title || "Untitled Project",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load projects dropdown:", err);
      }
    }
    loadProjects();
  }, []);

  // 2. جلب بيانات الإحصائيات عند تغير أي فلتر
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const p_project_id = filters.projectId === "ALL" ? null : filters.projectId;
      const p_status = filters.status === "ALL" ? null : (filters.status as any);

      // استدعاء الدالتين بالتوازي لسرعة الأداء
      const [statsRes, projectsRes] = await Promise.all([
        getTasksCalendarStats({
          p_start_date: filters.startDate,
          p_end_date: filters.endDate,
          p_project_id,
          p_status,
        }),
        getTasksCountPerProject(filters.startDate, filters.endDate),
      ]);

      if (statsRes.success && statsRes.data) {
        setStatsData(statsRes.data);
      } else {
        setError(statsRes.error || "Failed to load calendar statistics.");
      }

      if (projectsRes.success && projectsRes.data) {
        setProjectCounts(projectsRes.data);
      }
    } catch (err: any) {
      console.error("Error fetching statistics dashboard:", err);
      setError("An unexpected error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1300px] mx-auto space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Weekly Planner
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Manage your deadlines and track team velocity.
          </p>
        </div>

        {/* Filters Bar */}
        <StatisticsFilters
          filters={filters}
          onChange={setFilters}
          projects={projectsList}
        />

        {/* Error Alert with Retry button */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between text-red-700 text-sm">
            <span>⚠️ {error}</span>
            <button
              onClick={fetchDashboardData}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* KPI Cards Row */}
        <KpiCards
          totalTasks={statsData?.total_tasks || 0}
          doneTasks={statsData?.done_tasks || 0}
          overdueTasks={statsData?.overdue_tasks || 0}
          isLoading={isLoading}
        />

        {/* Weekly Calendar Columns */}
        <WeeklyCalendar
          startDate={filters.startDate}
          endDate={filters.endDate}
          dailyStats={statsData?.daily || []}
          isLoading={isLoading}
        />

        {/* Bottom Section: Tasks by Status & All Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <TasksByStatusChart
            totals={statsData?.totals || {}}
            totalTasks={statsData?.total_tasks || 0}
          />
          <AllProjectsList
            projects={projectCounts}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}