import React from "react";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { EpicsEmptyState } from "@/components/features/epics/EpicsEmptyState";
import { ProjectsErrorState } from "@/components/features/projects/ProjectsErrorState";
import { Epic, getPaginatedProjectEpics } from "@/api/services/servicesApi";
import { MobileEpicsInfiniteScroll } from "@/components/features/epics/MobileEpicsInfiniteScroll";
import { DesktopEpicsList } from "@/components/features/epics/DesktopEpicsList";
import { EpicSearchInput } from "@/components/features/epics/EpicSearchInput";

interface ProjectEpicsPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string; search?: string }>;
}

export default async function ProjectEpicPage({
  params,
  searchParams,
}: ProjectEpicsPageProps) {
  const { id: projectId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(
    1,
    parseInt(resolvedSearchParams.page || "1", 10),
  );
  const searchTerm = resolvedSearchParams.search || "";

  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const paginationResult = await getPaginatedProjectEpics(
    projectId,
    limit,
    offset,
    searchTerm,
  );

  // 1. معالجة حالة فشل الـ API
  if (!paginationResult.success) {
    return <ProjectsErrorState description="Failed to search epics" />;
  }

  const epicsList: Epic[] = paginationResult.data;
  const totalCount = paginationResult.totalCount;
  const totalPages = Math.ceil(totalCount / limit);

  // 2. حالة المشروع الفارغ تماماً (لا توجد Epics أصلاً وبدون كلمة بحث)
  if (epicsList.length === 0 && !searchTerm) {
    return <EpicsEmptyState projectId={projectId} />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen flex flex-col justify-between">
      <div>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Typography
              variant="headline-lg"
              className="font-bold text-slate-800"
            >
              Project Epics
            </Typography>
          </div>

          {/* Search Input UI & New Epic Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <EpicSearchInput />

            <Link
              href={`/project/${projectId}/epics/new`}
              className="hidden sm:block"
            >
              <Button
                variant="primary"
                className="bg-[#003D9B] hover:bg-blue-800 px-5 py-2.5 font-medium text-white rounded-md h-[48px] whitespace-nowrap"
              >
                + New Epic
              </Button>
            </Link>
          </div>
        </div>

        {/* 3. معالجة حالة البحث بدون نتائج (Search Empty State) */}
        {epicsList.length === 0 && searchTerm ? (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
            <Typography
              variant="headline-lg"
              className="text-slate-600 font-medium"
            >
              No epics found matching your search
            </Typography>
            <p className="text-sm text-slate-400 mt-1">
              Try searching with a different term or clear the search input.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block">
              <DesktopEpicsList
                projectId={projectId}
                epicsList={epicsList}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
              <MobileEpicsInfiniteScroll
                projectId={projectId}
                initialEpics={epicsList}
                totalCount={totalCount}
                limit={limit}
              />
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <Link href={`/project/${projectId}/epics/new`}>
        <Button
          variant="primary"
          className="sm:hidden fixed bottom-20 right-5 w-12 h-12 bg-[#003D9B] font-medium text-white rounded-xl flex items-center justify-center z-50 shadow-lg"
        >
          <span className="text-2xl font-light">+</span>
        </Button>
      </Link>
    </div>
  );
}
