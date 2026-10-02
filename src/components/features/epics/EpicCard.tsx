"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Details from "@/../public/details.svg";
import { Button } from "@/components/ui/Button";
import {
  newEpicFormValues,
  newEpicSchema,
} from "@/app/project/[id]/epics/new/newEpicSchema";

interface Member {
  id: string;
  name: string;
}

interface EpicCardProps {
  projectId: string;
  members?: Member[];
  onSubmit: (data: newEpicFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  apiError?: string | null;
}

export function EpicCard({
  projectId,
  members = [],
  onSubmit,
  onCancel,
  isLoading = false,
  apiError = null,
}: EpicCardProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<newEpicFormValues>({
    resolver: zodResolver(newEpicSchema),
    defaultValues: {
      title: "",
      description: "",
      assignee_id: "",
      deadline: "",
    },
  });

  const descriptionValue = watch("description") || "";

  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-6 shadow-sm md:p-8">
      {/* عرض أخطاء الـ API عند الفشل دون مسح البيانات */}
      {apiError && (
        <div className="mb-6 p-3 text-sm text-error">{apiError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* TITLE */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:items-start">
          <label
            htmlFor="title"
            className="pt-2 text-xs font-bold uppercase tracking-wider text-medium-dark"
          >
            TITLE <span className="text-error">*</span>
          </label>
          <div className="flex flex-col gap-1.5 md:col-span-3">
            <input
              id="title"
              type="text"
              placeholder="e.g. Structural Foundation Phase"
              {...register("title")}
              className={`w-full rounded-sm px-4 py-3 text-sm outline-none transition-colors bg-surface-highest ${
                errors.title
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1.5 text-label-sm font-bold uppercase text-error">
                <Details className=" [&_path]:fill-error " />
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:items-start">
          <div className="flex flex-col pt-1">
            <label
              htmlFor="description"
              className="text-xs font-bold uppercase tracking-wider text-medium-dark"
            >
              DESCRIPTION
            </label>
            <span className="text-xs text-gray-400 capitalize">Optional</span>
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-3">
            <textarea
              id="description"
              rows={4}
              maxLength={500}
              placeholder="Describe the scope and objectives of this epic..."
              {...register("description")}
              className="w-full  rounded-sm bg-surface-highest px-4 py-3 text-sm outline-none "
            />
            <div className="text-right text-[11px] font-medium text-gray-400">
              {descriptionValue?.length || 0} / 500 characters
            </div>
          </div>
        </div>

        {/* ASSIGNEE & DEADLINE */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* ASSIGNEE */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="assignee_id"
              className="text-xs font-bold uppercase tracking-wider text-medium-dark"
            >
              ASSIGNEE
            </label>
            <select
              id="assignee_id"
              {...register("assignee_id")}
              className="w-full rounded-lg bg-surface-highest px-4 py-3 text-sm text-medium-dark outline-none cursor-pointer"
            >
              <option value="">Select a member...</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* DEADLINE */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="deadline"
              className="text-xs font-bold uppercase tracking-wider text-medium-dark"
            >
              DEADLINE
            </label>
            <input
              id="deadline"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              {...register("deadline")}
              className={`w-full rounded-lg px-4 py-3 text-sm text-medium-dark outline-none bg-surface-highest transition-colors ${
                errors.deadline
              }`}
            />
            {errors.deadline && (
              <p className="flex items-center gap-1.5 text-label-sm font-bold text-error">
                {errors.deadline.message}
              </p>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex items-center justify-end gap-4 pt-2">
          <Button
            variant="ghost"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className=" px-6"
          >
            Cancel
          </Button>
          <Button variant="primary" className="px-6" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Epic"}
          </Button>
        </div>
      </form>
    </div>
  );
}
