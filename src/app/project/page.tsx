import React from "react";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import {
  ProjectCard,
  Project,
} from "@/components/features/projects/ProjectCard";
import { AddProjectCard } from "@/components/features/projects/AddProjectCard";
import { getProjects } from "@/api/services/servicesApi";
import { ProjectsEmptyState } from "@/components/features/projects/ProjectsEmptyState";
import { ProjectsErrorState } from "@/components/features/projects/ProjectsErrorState";
import Pagination from "@/components/Pagination/Pagination";
import { MobileInfiniteScroll } from "@/components/Pagination/MobileInfiniteScroll";

interface ProjectsListProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function ProjectsList({
  searchParams,
}: ProjectsListProps) {
  const limit = 10;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(
    1,
    parseInt(resolvedSearchParams.page || "1", 10),
  );
  const offset = (currentPage - 1) * limit;

  const result = await getProjects(limit, offset);

  if (!result || !result.success) {
    return <ProjectsErrorState />;
  }

  const projectsList: Project[] = result?.data || [];
  const totalCount: number = result?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (projectsList.length === 0) {
    return <ProjectsEmptyState />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Typography variant="headline-lg" className="font-bold">
            Projects
          </Typography>
          <Typography
            variant="body-md"
            className="text-neutral-muted font-regular mt-1"
          >
            Manage and curate your projects
          </Typography>
        </div>

        <Link href="/project/add" className="hidden sm:block">
          <Button variant="primary" className="px-5 py-2.5 font-medium">
            Create New Project
          </Button>
        </Link>
      </div>

      {/* 1. Desktop View: العرض الخاص بالشاشات المتوسطة والكبيرة */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsList.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <AddProjectCard />
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>

      {/* 2. Mobile View: العرض الخاص بالموبايل مع الـ Infinite Scroll */}
      <div className="block md:hidden">
        <MobileInfiniteScroll
          initialProjects={projectsList}
          initialTotalCount={totalCount}
          limit={limit}
        />
      </div>

      {/* Floating Action Button للموبايل */}
      <Link href="/project/add">
        <Button
          variant="primary"
          className="sm:hidden fixed bottom-20 right-5 w-12 h-12 bg-primary font-medium text-white rounded-xl flex items-center justify-center z-50"
        >
          <span className="text-2xl font-light">+</span>
        </Button>
      </Link>
    </div>
  );
}
