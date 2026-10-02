"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getProjects } from "@/api/services/servicesApi";
import {
  ProjectCard,
  Project,
} from "@/components/features/projects/ProjectCard";
import { AddProjectCard } from "@/components/features/projects/AddProjectCard";

interface MobileInfiniteScrollProps {
  initialProjects: Project[];
  initialTotalCount: number;
  limit?: number;
}

export function MobileInfiniteScroll({
  initialProjects,
  initialTotalCount,
  limit = 10,
}: MobileInfiniteScrollProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [offset, setOffset] = useState<number>(initialProjects.length);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = projects.length < totalCount;

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const loadMoreProjects = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getProjects(limit, offset);

      if (response && response.success) {
        setProjects((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newProjects = response.data.filter(
            (p: Project) => !existingIds.has(p.id),
          );
          return [...prev, ...newProjects];
        });

        if (response.totalCount !== undefined) {
          setTotalCount(response.totalCount);
        }
        setOffset((prevOffset) => prevOffset + limit);
      } else {
        setError("Failed to load projects");
      }
    } catch (err: any) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [limit, offset, loading, hasMore]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProjects();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loadMoreProjects, hasMore, loading]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <AddProjectCard />
      </div>

      {projects.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-neutral-muted">
          No projects found
        </div>
      )}

      <div ref={observerTarget} className="py-6 text-center">
        {loading && (
          <div className="flex justify-center items-center gap-2 text-sm text-neutral-muted">
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            Loading more projects...
          </div>
        )}

        {error && (
          <div className="text-error text-sm my-2">
            {error}
            <button
              onClick={loadMoreProjects}
              className="ml-2 text-primary underline text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
