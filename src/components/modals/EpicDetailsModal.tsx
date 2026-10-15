"use client";

import React, { useEffect, useState, useRef } from "react";
import { Epic, getEpicDetails, getEpicTasks, membersList, updateEpic } from "@/api/services/servicesApi";
import { Button } from "@/components/ui/Button";
import Plus from "@/../public/plus.svg";
import Background from "@/../public/Background.svg";
import Task from "@/../public/task.svg";
import Copy from "@/../public/copy.svg";
import Close from "@/../public/close.svg";
import Cal from "@/../public/cal.svg";
import Down from "@/../public/down.svg";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [epic, setEpic] = useState<Epic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Tasks States
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(false);
  const [tasksError, setTasksError] = useState<boolean>(false);

  // Field Input States
  const [titleInput, setTitleInput] = useState<string>("");
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [deadlineInput, setDeadlineInput] = useState<string>("");

  // Assignee Dropdown State
  const [members, setMembers] = useState<any[]>([]);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState<boolean>(false);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);

  // Close assignee dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        assigneeDropdownRef.current &&
        !assigneeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAssigneeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Epic Details, Members & Tasks on Open
  useEffect(() => {
    if (!isOpen || !epicId) return;

    let isMounted = true;
    setLoading(true);
    setTasksLoading(true);
    setError(false);
    setTasksError(false);
    setEpic(null);
    setTasks([]);
    setIsAssigneeOpen(false);

    async function fetchData() {
      try {
        const [epicResult, membersResult, tasksResult] = await Promise.all([
          getEpicDetails(projectId, epicId),
          membersList(projectId),
          getEpicTasks(epicId),
        ]);

        if (isMounted) {
          if (epicResult.success && epicResult.data) {
            setEpic(epicResult.data);
            setTitleInput(epicResult.data.title || "");
            setDescriptionInput(epicResult.data.description || "");
            setDeadlineInput(epicResult.data.deadline ? epicResult.data.deadline.split("T")[0] : "");
          } else {
            setError(true);
          }

          if (membersResult) {
            setMembers(membersResult);
          }

          if (tasksResult.success) {
            setTasks(tasksResult.data);
          } else {
            setTasksError(true);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          setTasksError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setTasksLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [projectId, epicId, isOpen]);

  // Generic Update Handler with Optimistic UI & Rollback
  const executeFieldUpdate = async (
    fieldsToUpdate: Record<string, any>,
    rollbackAction: () => void
  ) => {
    const result = await updateEpic(epicId, fieldsToUpdate);
    if (!result.success) {
      rollbackAction();
      toast.error("Failed to update epic");
    } else {
      router.refresh();
      toast.success("Epic updated successfully");
    }
  };

  const handleTitleBlur = () => {
    if (!epic) return;
    const trimmed = titleInput.trim();
    if (!trimmed) {
      setTitleInput(epic.title);
      return;
    }
    if (trimmed === epic.title) return;

    const previous = epic.title;
    setEpic({ ...epic, title: trimmed });

    executeFieldUpdate({ title: trimmed }, () => {
      setTitleInput(previous);
      setEpic((prev) => (prev ? { ...prev, title: previous } : null));
    });
  };

  const handleDescriptionBlur = () => {
    if (!epic) return;
    const trimmed = descriptionInput.trim();
    const finalVal = trimmed === "" ? null : descriptionInput;
    if (finalVal === epic.description) return;

    const previous = epic.description;
    setEpic({ ...epic, description: finalVal ?? undefined });

    executeFieldUpdate({ description: finalVal }, () => {
      setDescriptionInput(previous || "");
      setEpic((prev) => (prev ? { ...prev, description: previous } : null));
    });
  };

  const handleSelectAssignee = (member: any | null) => {
    if (!epic) return;
    const newAssigneeId = member ? (member.id || member.sub) : null;
    const currentAssigneeId = epic.assignee.sub || null;

    if (newAssigneeId === currentAssigneeId) {
      setIsAssigneeOpen(false);
      return;
    }

    const previousAssignee = epic.assignee;
    const memberName = member ? (member.metadata?.name ) : null;
    const updatedAssigneeInfo = member ? { id: member.sub, name: memberName } : null;

    setEpic({ ...epic, assignee: updatedAssigneeInfo as any });
    setIsAssigneeOpen(false);

    executeFieldUpdate({ assignee_id: newAssigneeId }, () => {
      setEpic((prev) => (prev ? { ...prev, assignee: previousAssignee } : null));
    });
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!epic) return;
    const newDate = e.target.value; 
    const finalDateVal = newDate === "" ? null : newDate;

    if (finalDateVal === epic.deadline) return;

    const previousDeadline = epic.deadline;
    setDeadlineInput(newDate);
    setEpic({ ...epic, deadline: finalDateVal || "" });

    executeFieldUpdate({ deadline: finalDateVal }, () => {
      setDeadlineInput(previousDeadline ? previousDeadline.split("T")[0] : "");
      setEpic((prev) => (prev ? { ...prev, deadline: previousDeadline } : null));
    });
  };

  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper for Task Due Date format (DD MMM YYYY)
  const formatTaskDueDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const currentAssigneeName = epic?.assignee?.name;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-155 max-h-[90vh] overflow-y-auto p-7 relative shadow-2xl border border-surface-highest"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 text-medium-dark">
          <div className="flex items-center gap-2 text-xs font-semibold text-nuetral-dark">
            <Task />
            <span className="uppercase text-neutral-dark tracking-wider">
              {epic?.epic_id}
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
            <p className="text-medium-dark text-sm font-medium">Loading epic details...</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-error font-semibold mb-4">Failed to load epic details.</p>
            <Button
              variant="secondary"
              onClick={onClose}
              className="px-4 py-2 border border-surface-highest text-neutral-dark rounded-lg"
            >
              Close
            </Button>
          </div>
        )}

        {epic && (
          <div className="space-y-4 mt-2">
            {/* Title Editable Input */}
            <div className="p-2 bg-white border border-surface-highest rounded-xl">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleBlur}
                className="w-full bg-transparent font-bold text-neutral-dark text-base focus:outline-none px-1.5 py-1"
                placeholder="Epic title..."
              />
            </div>

            {/* Description Editable Textarea */}
            <div className="p-3 bg-white border border-surface-highest rounded-xl min-h-25">
              <textarea
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                onBlur={handleDescriptionBlur}
                className="w-full bg-transparent text-xs sm:text-sm text-neutral-dark leading-relaxed focus:outline-none resize-none whitespace-pre-wrap min-h-20"
                placeholder="No description provided"
              />
            </div>

            {/* Grid for Details */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* ASSIGNEE */}
              <div className="relative" ref={assigneeDropdownRef}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/30 block mb-1">
                  ASSIGNEE
                </label>
                <div
                  onClick={() => setIsAssigneeOpen(!isAssigneeOpen)}
                  className="flex items-center justify-between px-3 py-2 bg-white border border-surface-highest rounded-xl text-xs cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      {getInitial(currentAssigneeName)}
                    </div>
                    <span className="font-medium text-neutral-dark truncate">
                      {currentAssigneeName || "Unassigned"}
                    </span>
                  </div>
                  <Down />
                </div>

                {isAssigneeOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-surface-highest rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto p-1 divide-y divide-slate-100">
                    <div
                      onClick={() => handleSelectAssignee(null)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                    >
                      <span className="font-medium text-slate-400">Unassigned</span>
                    </div>
                    {members.map((member) => {
                      const memberId = member.id;
                      const memberName = member.metadata?.name;
                      return (
                        <div
                          key={memberId}
                          onClick={() => handleSelectAssignee(member)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-dark hover:bg-slate-50 rounded-lg cursor-pointer truncate"
                        >
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                            {getInitial(memberName)}
                          </div>
                          <span className="truncate font-medium">{memberName}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* DEADLINE */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/30 block mb-1">
                  DEADLINE
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-surface-highest rounded-xl text-xs relative">
                  <div className="flex items-center gap-2 text-slate-700 truncate w-full">
                    <Cal />
                    <input
                      type="date"
                      value={deadlineInput}
                      onChange={handleDeadlineChange}
                      className="bg-transparent font-medium text-slate-700 focus:outline-none w-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* CREATED BY */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/30 block mb-1">
                  CREATED BY
                </label>
                <div className="flex items-center px-3 py-2 bg-white border border-surface-highest rounded-xl text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      {getInitial(epic.created_by?.name)}
                    </div>
                    <span className="font-medium text-neutral-dark truncate">
                      {epic.created_by?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* CREATED AT */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-dark/30 block mb-1">
                  CREATED AT
                </label>
                <div className="flex items-center px-3 py-2 bg-white border border-surface-highest rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-slate-700 truncate">
                    <Cal />
                    <span className="font-medium">
                      {formatDate(epic.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="pt-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-neutral-dark">Tasks</h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-primary hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  + Add Task
                </button>
              </div>

              {/* Loading State (Skeleton Loader) */}
              {tasksLoading && (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 bg-white border border-surface-highest rounded-xl animate-pulse flex justify-between items-center">
                      <div className="space-y-2 w-1/2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-4 bg-slate-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {!tasksLoading && tasksError && (
                <div className="bg-surface-low rounded-2xl p-6 text-center">
                  <p className="text-xs text-error font-medium">Failed to load tasks.</p>
                </div>
              )}

              {/* Empty State */}
              {!tasksLoading && !tasksError && tasks.length === 0 && (
                <div className="bg-surface-low rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3">
                  <Background />
                  <p className="text-xs text-neutral-dark font-medium">
                    No tasks have been added to this epic yet
                  </p>
                  <Button
                    variant="primary"
                    className="text-white text-xs px-4 py-2 h-auto font-medium rounded-lg flex items-center gap-1.5"
                  >
                    <Plus /> Add Task
                  </Button>
                </div>
              )}

              {/* Tasks List (Figma Design Layout) */}
              {!tasksLoading && !tasksError && tasks.length > 0 && (
                <div className="bg-white border border-surface-highest rounded-2xl overflow-hidden divide-y divide-surface-highest">
                  {tasks.map((task) => {
                    const assigneeName = task.assignee?.name || task.assignee_name || "Unassigned";
                    const formattedDueDate = formatTaskDueDate(task.due_date);

                    return (
                      <div key={task.id || task.task_id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-1 truncate pr-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-neutral-dark truncate">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                              {getInitial(task.assignee?.name || task.assignee_name)}
                            </div>
                            <span className="text-xs font-medium text-slate-600 truncate">
                              {assigneeName}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            DUE DATE
                          </span>
                          <span className="text-xs font-medium text-slate-700">
                            {formattedDueDate || "No due date"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}