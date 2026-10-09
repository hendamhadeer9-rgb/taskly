"use client";

import React, { useEffect, useState } from "react";
import { Epic, getEpicDetails } from "@/api/services/servicesApi";
import { Button } from "@/components/ui/Button";
import Plus from "@/../public/plus.svg";
import Background from "@/../public/Background.svg";
import Task from "@/../public/task.svg";
import Copy from "@/../public/copy.svg";
import Close from "@/../public/close.svg";
import Cal from "@/../public/cal.svg";
import Down from "@/../public/down.svg";

interface EpicDetailsModalProps {
  projectId: string;
  epicId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EpicDetailsModal({
  projectId,
  epicId,
  isOpen,
  onClose,
}: EpicDetailsModalProps) {
  const [epic, setEpic] = useState<Epic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !epicId) return;

    let isMounted = true;
    setLoading(true);
    setError(false);
    setEpic(null);
    async function fetchEpicDetails() {
      try {
        const result = await getEpicDetails(projectId, epicId);

        if (isMounted) {
          if (result.success && result.data) {
            setEpic(result.data);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchEpicDetails();

    return () => {
      isMounted = false;
    };
  }, [projectId, epicId, isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Oct 10, 2025";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Oct 10, 2025";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-155 max-h-[90vh] overflow-y-auto p-7 relative shadow-2xl border border-nav-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section with Copy Link & Close */}
        <div className="flex items-center justify-between pb-3 text-medium-dark">
          <div className="flex items-center gap-2 text-xs font-semibold text-nuetral-dark">
            {/* Epic Icon */}
            <Task />
            <span className="uppercase text-neutral-dark tracking-wider">
              {epic?.epic_id || "EPIC-101"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-medium-dark transition-colors font-medium"
            >
              <Copy />
              Copy link
            </button>
            <button onClick={onClose} aria-label="Close modal">
              <Close />
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
            <p className="text-medium-dark text-sm font-medium">
              Loading epic details...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-error font-semibold mb-4">
              Failed to load epic details.
            </p>
            <Button
              variant="secondary"
              onClick={onClose}
              className="px-4 py-2 border border-nav-border text-neutral-dark rounded-lg"
            >
              Close
            </Button>
          </div>
        )}

        {epic && (
          <div className="space-y-4 mt-2">
            {/* Title Container */}
            <div className="p-3.5 bg-surface-highest border border-nav-border rounded-xl">
              <h2 className="text-base font-bold text-neutral-dark">
                {epic.title}
              </h2>
            </div>

            {/* Description Container */}
            <div className="p-4 bg-surface-highest border border-nav-border rounded-xl min-h-[100px]">
              <p className="text-xs sm:text-sm text-neutral-dark leading-relaxed whitespace-pre-wrap">
                {epic.description && epic.description.trim() !== ""
                  ? epic.description
                  : "A comprehensive review and upgrade of the core architectural frameworks."}
              </p>
            </div>

            {/* Details 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* ASSIGNEE */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/30 block mb-1">
                  ASSIGNEE
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {getInitial(epic.assignee?.name || "John Doe")}
                    </div>
                    <span className="font-medium text-slate-800 truncate">
                      {epic.assignee?.name || "John Doe"}
                    </span>
                  </div>
                  <svg
                    className="w-3.5 h-3.5 text-neutral-dark/30 shrink-0 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* DEADLINE */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/30 block mb-1">
                  DEADLINE
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-slate-700 truncate">
                    <Cal />
                    <span className="font-medium">
                      {formatDate(epic.created_at)}
                    </span>
                  </div>
                  <Down />
                </div>
              </div>

              {/* CREATED BY */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/30  block mb-1">
                  CREATED BY
                </label>
                <div className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {getInitial(epic.created_by?.name)}
                    </div>
                    <span className="font-medium text-slate-800 truncate">
                      {epic.created_by?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* CREATED AT */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/30  block mb-1">
                  CREATED AT
                </label>
                <div className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-slate-700 truncate">
                    <Cal />
                    <span className="font-medium">
                      {formatDate(epic.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Epic Tasks Section */}
            <div className="pt-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-neutral-dark">Tasks</h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  + Add Task
                </button>
              </div>

              {/* Empty Tasks Box */}
              <div className="bg-surface-low rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3">
                <Background />

                <p className="text-xs text-neutral-darl font-medium">
                  No tasks have been added to this epic yet
                </p>
                <Button
                  variant="primary"
                  className=" text-white text-xs px-4 py-2 h-auto font-medium rounded-lg flex items-center gap-1.5 "
                  disabled
                >
                  <Plus /> Add Task
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
