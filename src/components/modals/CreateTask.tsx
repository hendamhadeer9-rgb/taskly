"use client";

import React, { useEffect, useState } from "react";
import { TASK_STATUSES } from "../features/tasks/tasksConfig";
import {
  addNewTask,
  getProjectEpics,
  membersList,
  Epic,
} from "@/api/services/servicesApi";
import { toast } from "sonner";
import Down from "@/../public/down.svg";

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
  onTaskCreated?: (newTask?: any) => void;
}

export function CreateTask({
  isOpen,
  onClose,
  projectId,
  defaultStatus = "TO_DO",
  preselectedEpicId = null,
  onTaskCreated,
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
      if (onTaskCreated) {
        onTaskCreated(res.data);
      }
      onClose();
      toast.success("task created successfully");
    } else {
      setErrorMessage(res.error);
    }
  };

  const truncateTitle = (text: string, maxLength: number = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-999 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Form Details & Actions */}
        <div className="flex-1 p-7 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header */}
            <h2 className="text-lg font-bold text-neutral-dark mb-6">
              Add New Task
            </h2>

            {errorMessage && (
              <div className="p-3 mb-4  text-error text-xs ">
                {errorMessage}
              </div>
            )}

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-label-sm font-bold text-medium-dark uppercase tracking-wider mb-2">
                  TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g., Finalize structural schematics"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) setTitleError("");
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs  border border-surface-highest rounded-xl focus:outline-none placeholder:text-medium-dark/60 `}
                />
                {titleError && (
                  <p className="text-xs text-error mt-1">{titleError}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-label-sm font-bold text-medium-dark uppercase tracking-wider mb-2">
                  DESCRIPTION
                </label>
                <textarea
                  rows={10}
                  placeholder="Provide detailed context for this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-3 text-xs  border border-surface-highest rounded-xl focus:outline-none resize-none placeholder:text-medium-dark/60 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-6 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-neutral-dark bg-surface-highest  rounded-xl  cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 text-xs font-semibold text-white bg-primary rounded-lg transition-colors cursor-pointer"
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </div>

        {/* Right Side Controls Sidebar */}
        <div className="w-full md:w-72 bg-condition-box p-6 flex flex-col gap-5 ">
          {/* Status */}
          <div>
            <label className="block text-label-sm font-bold text-medium-dark uppercase tracking-wider mb-2">
              STATUS
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl appearance-none focus:outline-none font-medium cursor-pointer"
              >
                {TASK_STATUSES.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Down />
              </div>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-[11px] font-bold text-medium-dark uppercase tracking-wider mb-2">
              ASSIGNEE
            </label>
            <div className="relative">
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                disabled={loadingData}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl appearance-none focus:outline-none font-medium cursor-pointer"
              >
                <option value="">Select Team Member</option>
                {members.map((mem) => (
                  <option key={mem.user_id} value={mem.user_id}>
                    {mem.name || mem.email}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Down />
              </div>
            </div>
          </div>

          {/* Epic */}
          <div>
            <label className="block text-[11px] font-bold text-medium-dark uppercase tracking-wider mb-2">
              EPIC
            </label>
            <div className="relative">
              <select
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
                disabled={loadingData}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl appearance-none focus:outline-none font-medium cursor-pointer"
              >
                <option value="">Select Epic</option>
                {epics.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.epic_id ? `[${ep.epic_id}] ` : ""}
                    {truncateTitle(ep.title)}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Down />
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-[11px] font-bold text-medium-dark uppercase tracking-wider mb-2">
              DUE DATE
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-highest rounded-xl appearance-none focus:outline-none font-medium cursor-pointer"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
