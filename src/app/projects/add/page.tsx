"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { projectSchema } from "./add.schema";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { addNewProject } from "@/api/services/servicesApi";
import { toast } from "sonner";

export type ProjectFormData = z.infer<typeof projectSchema>;

export default function AddNewProject() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  const descriptionValue = watch("description") || "";

  async function onSubmit(data: ProjectFormData) {
    try {
      setIsSubmitting(true);
      const response = await addNewProject(data);

      if (response) {
        toast.success("Project created successfully");
      } else {
        toast.error("Failed To Add New Project, Try Again Later");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("An error occurred while creating the project");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="pt-8 hidden md:block">
        <Typography variant="label-sm" className="px-8">
          Projects <span className="mx-1">/</span>{" "}
          <span className="text-primary">Add New Project</span>
        </Typography>
        <Typography variant="headline-lg" className="pl-8 pt-4">
          Add New Project
        </Typography>
      </div>

      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="p-4 sm:p-6 border-b border-neutral-border flex items-start gap-4">
              <div className="sm:heddin  p-3 sm:p-4 bg-background rounded-sm flex items-center justify-center shrink-0">
                <Image
                  src="/new.svg"
                  alt="new-project"
                  width={22}
                  height={20}
                />
              </div>
              <div>
                <Typography variant="title-md" className="font-semibold">
                  Initialize New Project
                </Typography>
                <Typography variant="body-md">
                  Define the scope and foundational details of your project.
                </Typography>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 sm:p-8 space-y-5"
            >
              <Input
                label="PROJECT TITLE *"
                placeholder="project name"
                error={errors.title?.message}
                {...register("title")}
              />

              {/* Description Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold text-neutral-muted uppercase tracking-wider">
                    <Typography
                      variant="label-sm"
                      className="text-neutral-muted"
                    >
                      Description
                    </Typography>
                  </label>
                  <span className="text-xs text-neutral-muted">Optional</span>
                </div>
                <textarea
                  rows={4}
                  {...register("description")}
                  placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                  className="w-full px-3.5 py-2.5 bg-surface-highest rounded-sm text-sm placeholder:text-neutral-muted focus:outline-none"
                />
                <div className="text-right text-xs text-neutral-muted mt-1">
                  {descriptionValue.length} / 500 characters
                </div>
              </div>

              {/* Action Buttons - تعديل الترتيب والعرض للشاشات الصغيرة */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4">
                <Button
                  variant="ghost"
                  type="button"
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-full sm:w-auto px-8 py-2.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="mr-2">creating...</div>
                  ) : (
                    <div>Create Project</div>
                  )}
                </Button>
              </div>
            </form>

            {/* Pro Tip Section */}
            <div className=" px-4 sm:px-6 py-3.5 bg-surface-low flex items-center gap-2 text-xs text-neutral-muted rounded-b-lg">
              <span>
                <Image
                  src="/pro.svg"
                  alt="pro-tip"
                  width={11}
                  height={15}
                  className="inline me-1"
                />
                <strong className="text-neutral-muted font-semibold">
                  Pro Tip:
                </strong>{" "}
                You can invite project members and assign epics immediately
                after the initial creation process.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
