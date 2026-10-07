"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Epic, getPaginatedProjectEpics } from "@/api/services/servicesApi";
import { ProjectEpicCard } from "@/components/features/epics/ProjectEpicCard";
import { EpicDetailsModal } from "@/components/modals/EpicDetailsModal";

interface MobileEpicsInfiniteScrollProps {
  projectId: string;
  initialEpics: Epic[];
  totalCount: number;
  limit?: number;
}

export function MobileEpicsInfiniteScroll({
  projectId,
  initialEpics,
  totalCount: initialTotalCount,
  limit = 10,
}: MobileEpicsInfiniteScrollProps) {
  const [epics, setEpics] = useState<Epic[]>(initialEpics);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [offset, setOffset] = useState<number>(initialEpics.length);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // حالة التحكم في الـ Modal والـ Epic المحدد
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const hasMore = epics.length < totalCount;
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const handleEpicClick = (epicId: string) => {
    setSelectedEpicId(epicId);
    setIsModalOpen(true);
  };

  const loadMoreEpics = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getPaginatedProjectEpics(projectId, limit, offset);

      if (response && response.success) {
        setEpics((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          const newEpics = response.data.filter(
            (e: Epic) => !existingIds.has(e.id),
          );
          return [...prev, ...newEpics];
        });

        if (response.totalCount !== undefined) {
          setTotalCount(response.totalCount);
        }

        setOffset((prevOffset) => prevOffset + limit);
      } else {
        setError("Failed to load epics");
      }
    } catch (err) {
      console.error("Failed to load more epics on mobile:", err);
      setError("Failed to load epics");
    } finally {
      setLoading(false);
    }
  }, [projectId, limit, offset, loading, hasMore]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreEpics();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loadMoreEpics, hasMore, loading]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4">
        {epics.map((epic) => (
          <ProjectEpicCard
            key={epic.id}
            epic={epic}
            onClick={() => handleEpicClick(epic.id)}
          />
        ))}
      </div>

      {epics.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-slate-500">No epics found</div>
      )}

      <div ref={observerTarget} className="py-6 text-center">
        {loading && (
          <div className="flex justify-center items-center gap-2 text-sm text-slate-500">
            <span className="w-4 h-4 border-2 border-[#003D9B] border-t-transparent rounded-full animate-spin"></span>
            Loading more epics...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm my-2">
            {error}
            <button
              onClick={loadMoreEpics}
              className="ml-2 text-[#003D9B] underline text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* الـ Modal الخاص بتفاصيل الـ Epic */}
      <EpicDetailsModal
        projectId={projectId}
        epicId={selectedEpicId?? ""}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEpicId(null);
        }}
      />
    </div>
  );
}
