"use client";

import React, { useEffect, useState } from "react";
import { TASK_STATUSES } from "../features/tasks/tasksConfig";
import {
  addNewTask,
  getProjectEpics,
  membersList,
  Epic,
} from "@/api/services/servicesApi";

interface Member {
  user_id: string;
  name?: string;
  email?: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  defaultStatus?: string;
  preselectedEpicId?: string | null;
}

export function CreateTask({
  isOpen,
  onClose,
  projectId,
  defaultStatus = "TO_DO",
  preselectedEpicId = null,
}: CreateTaskModalProps) {
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(defaultStatus);
  const [assigneeId, setAssigneeId] = useState("");
  const [epicId, setEpicId] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Data & UI States
  const [epics, setEpics] = useState<Epic[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");

  // Reset form and fetch options when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
      setAssigneeId("");
      setEpicId(preselectedEpicId || "");
      setDueDate("");
      setErrorMessage("");
      setTitleError("");

      const fetchData = async () => {
        setLoadingData(true);
        try {
          const [epicsRes, membersRes] = await Promise.all([
            getProjectEpics(projectId),
            membersList(projectId),
          ]);

          if (epicsRes?.success && epicsRes.data) {
            setEpics(epicsRes.data);
          }
          if (membersRes) {
            setMembers(Array.isArray(membersRes) ? membersRes : []);
          }
        } catch (err) {
          console.error("Error loading modal data:", err);
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();
    }
  }, [isOpen, projectId, defaultStatus, preselectedEpicId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError("Task title is required");
      return;
    }

    setTitleError("");
    setErrorMessage("");
    setIsSubmitting(true);

    const res = await addNewTask({
      project_id: projectId,
      title,
      description,
      status,
      assignee_id: assigneeId || null,
      epic_id: epicId || null,
      due_date: dueDate || null,
    });

    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || "Failed to create task");
    }
  };

  const truncateTitle = (text: string, maxLength: number = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Task</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Main Section */}
            <div className="md:col-span-2 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  TITLE <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Finalize structural schematics"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) setTitleError("");
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border ${
                    titleError ? "border-red-500" : "border-slate-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B]`}
                />
                {titleError && (
                  <p className="text-xs text-red-500 mt-1">{titleError}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  DESCRIPTION
                </label>
                <textarea
                  rows={6}
                  placeholder="Provide detailed context for this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] resize-none"
                />
              </div>
            </div>

            {/* Right Sidebar Controls */}
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B]"
                >
                  {TASK_STATUSES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  ASSIGNEE
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  disabled={loadingData}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B]"
                >
                  <option value="">Select Team Member</option>
                  {members.map((mem) => (
                    <option key={mem.user_id} value={mem.user_id}>
                      {mem.name || mem.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Epic */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  EPIC
                </label>
                <select
                  value={epicId}
                  onChange={(e) => setEpicId(e.target.value)}
                  disabled={loadingData}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B]"
                >
                  <option value="">Select Epic</option>
                  {epics.map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      {ep.epic_id ? `[${ep.epic_id}] ` : ""}
                      {truncateTitle(ep.title)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  DUE DATE
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#003D9B] hover:bg-blue-800 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Creating..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}