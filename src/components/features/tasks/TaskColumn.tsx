"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { TaskStatusConfig } from "./tasksConfig";
import { getPaginatedTasksByStatus } from "@/api/services/servicesApi";
import { Task } from "@/components/features/tasks/tasksConfig";

interface TaskColumnProps {
  projectId: string;
  status: TaskStatusConfig;
  searchTerm?: string;
  onAddTask?: (statusId: string) => void;
  onTaskClick?: (taskId: string) => void;
}

export function TaskColumn({
  projectId,
  status,
  searchTerm = "",
  onAddTask,
  onTaskClick,
}: TaskColumnProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const limit = 10;

  const containerRef = useRef<HTMLDivElement>(null);
  const currentSearchTermRef = useRef(searchTerm);

  useEffect(() => {
    currentSearchTermRef.current = searchTerm;
  }, [searchTerm]);

  const fetchInitialTasks = useCallback(
    async (isSubscribed: () => boolean) => {
      setIsLoading(true);
      setError(null);

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }

      const result = await getPaginatedTasksByStatus(
        projectId,
        status.apiValue ,
        limit,
        0,
        searchTerm
      );

      if (!isSubscribed()) return;

      if (result.success) {
        setTasks(result.data);
        setTotalCount(result.totalCount);
        setOffset(result.data.length);

        if (result.data.length >= result.totalCount || result.data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        setError("Failed to load tasks");
      }
      setIsLoading(false);
    },
    [projectId, status.apiValue, status.id, searchTerm]
  );

  useEffect(() => {
    let isActive = true;

    fetchInitialTasks(() => isActive);

    return () => {
      isActive = false; 
    };
  }, [fetchInitialTasks]);

  const loadMoreTasks = async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    const activeSearch = currentSearchTermRef.current;

    const result = await getPaginatedTasksByStatus(
      projectId,
      status.apiValue ,
      limit,
      offset,
      activeSearch
    );

    if (activeSearch !== currentSearchTermRef.current) {
      setIsFetchingMore(false);
      return;
    }

    if (result.success) {
      setTasks((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTasks = result.data.filter((t) => !existingIds.has(t.id));
        const updatedList = [...prev, ...newTasks];

        if (
          result.data.length < limit ||
          updatedList.length >= result.totalCount
        ) {
          setHasMore(false);
        }

        return updatedList;
      });

      setTotalCount(result.totalCount);
      setOffset((prev) => prev + result.data.length);
    } else {
      setError("Failed to load more tasks");
    }

    setIsFetchingMore(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !isFetchingMore && hasMore) {
      loadMoreTasks();
    }
  };

  return (
    <div className="w-[280px] shrink-0 flex flex-col gap-3">
      {/* 1. Column Header */}
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full ${status.color}`} />
        <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
          {status.label}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
          {isLoading ? "-" : totalCount}
        </span>
      </div>

      {/* 2. Add New Task Button */}
      <button
        type="button"
        onClick={() => onAddTask?.(status.id)}
        className="w-full h-11 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-500 transition-colors bg-white/50 cursor-pointer"
      >
        <span>ADD NEW TASK</span>
      </button>

      {/* 3. Content Container with Scroll Listener */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-[450px] bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col p-3 gap-3 overflow-y-auto"
      >
        {/* Initial Loading */}
        {isLoading && (
          <div className="space-y-3 animate-pulse pt-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-200/70 rounded-lg w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="my-auto p-4 bg-red-50 border border-red-200 rounded-lg text-center flex flex-col gap-2">
            <p className="text-xs text-red-600 font-medium">{error}</p>
            <button
              onClick={() => {
                let active = true;
                fetchInitialTasks(() => active);
              }}
              className="text-xs font-semibold text-red-700 underline hover:text-red-800 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="my-auto flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              {searchTerm.trim() ? "NO MATCHING TASKS" : "NO TASKS"}
            </span>
            {searchTerm.trim() && (
              <span className="text-[11px] text-slate-400 mt-1">
                No tasks match "{searchTerm.trim()}"
              </span>
            )}
          </div>
        )}

        {/* Task Cards */}
        {!isLoading &&
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick?.(task.id)}
              className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1.5 cursor-pointer hover:border-slate-300 transition-colors"
            >
              <h4 className="text-xs font-bold text-slate-700 line-clamp-2">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          ))}

        {/* Loading Indicator for More Tasks */}
        {isFetchingMore && (
          <div className="py-2 text-center">
            <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
          </div>
        )}
      </div>
    </div>
  );
}