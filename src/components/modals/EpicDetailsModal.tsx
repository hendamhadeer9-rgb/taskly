"use client";

import React, { useEffect, useState } from "react";
import { Epic, getEpicDetails } from "@/api/services/servicesApi"; // أو حسب مسار ملف الـ types في مشروعك
import { Button } from "@/components/ui/Button";

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
    setEpic(null); // تفريغ البيانات القديمة فوراً لمنع عرض بيانات Epic سابق أثناء التحميل

    async function fetchEpicDetails() {
      try {
        // ✅ استدعاء الـ Server Action مباشرة بدلاً من fetch
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

  // دالة تنسيق التاريخ ليكون بالشكل المقروء المطلوب: Dec 25, 2025
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // استخراج أول حرف للـ Avatar في حال عدم وجود صورة
  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-xl"
        onClick={(e) => e.stopPropagation()} // منع إغلاق النافذة عند الضغط بداخلها
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* 1. حالة التحميل (Loading State) */}
        {loading && (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-3 border-[#003D9B] border-t-transparent rounded-full animate-spin"></span>
            <p className="text-slate-500 text-sm font-medium">
              Loading epic details...
            </p>
          </div>
        )}

        {/* 2. حالة الخطأ (Error State) */}
        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-red-500 font-semibold mb-4">
              Failed to load epic details.
            </p>
            <Button
              variant="secondary"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700"
            >
              Close
            </Button>
          </div>
        )}

        {/* 3. عرض البيانات بعد النجاح (Success State) */}
        {epic && (
          <div className="space-y-6">
            {/* Epic Header & Title */}
            <div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {epic.epic_id}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2 ">
                {epic.title}
              </h2>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap ">
                {epic.description && epic.description.trim() !== ""
                  ? epic.description
                  : "No description provided"}
              </p>
            </div>

            {/* Creator, Assignee, Created At */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-100 py-4">
              {/* Created By */}
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Created by
                </span>
                <div className="flex items-center gap-2">
                  {epic.created_by?.avatar_url ? (
                    <img
                      src={epic.created_by.avatar_url}
                      alt={epic.created_by.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                      {getInitial(epic.created_by?.name)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-800 truncate">
                    {epic.created_by?.name}
                  </span>
                </div>
              </div>

              {/* Assignee */}
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Assignee
                </span>
                <div className="flex items-center gap-2">
                  {epic.assignee?.name ? (
                    <>
                      {epic.assignee.avatar_url ? (
                        <img
                          src={epic.assignee.avatar_url}
                          alt={epic.assignee.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {getInitial(epic.assignee.name)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-800 truncate">
                        {epic.assignee.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-medium text-slate-500">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>

              {/* Created At */}
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Created at
                </span>
                <span className="text-sm font-medium text-slate-800">
                  {formatDate(epic.created_at)}
                </span>
              </div>
            </div>

            {/* Epic Tasks Section (Empty State) */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Epic Tasks
                </h3>
                <Button
                  variant="primary"
                  className="bg-[#003D9B] text-white text-xs px-3 py-1.5 opacity-80 cursor-not-allowed"
                  disabled
                >
                  + Add New Task
                </Button>
              </div>

              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  No tasks have been added to this epic yet
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
