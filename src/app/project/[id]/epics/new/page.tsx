"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EpicCard } from "@/components/features/epics/EpicCard";
import { membersList, newEpic } from "@/api/services/servicesApi";
import { toast } from "sonner";
import { newEpicFormValues } from "./newEpicSchema";
import { Typography } from "@/components/ui/Typography";
import Right from "@/../public/right.svg";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      if (!projectId) return;

      try {
        setIsFetchingMembers(true);
        const data = await membersList(projectId);

        if (data && Array.isArray(data)) {
          // استخراج الاسم والـ ID بالظبط كما هو معرف في MemberListTable
          const formattedMembers = data.map((m: any) => ({
            id: m.id,
            name: m.metadata?.name,
          }));

          setMembers(formattedMembers);
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
        toast.error("Failed to load project members");
      } finally {
        setIsFetchingMembers(false);
      }
    }

    fetchMembers();
  }, [projectId]);

  const handleSubmit = async (data: newEpicFormValues) => {
    try {
      setIsLoading(true);

      await newEpic(projectId, data);

      toast.success("Epic created successfully");
      router.push(`/project/${projectId}/epics`);
      router.refresh();
    } catch (error) {
      console.error("Failed to create epic:", error);
      toast.error("Can not create new epic, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/project/${projectId}/epics`);
  };

  return (
    <div className="p-6">
      <div className="mx-auto mb-6 max-w-4xl">
        <div className="flex justify-ceenter items-center gap-2 mb-5 text-xs font-semibold uppercase text-medium-dark/60">
          PROJECTS <Right /> PROJECT ALPHA <Right /> EPICS <Right />
          <span className="text-neutral-dark">NEW EPIC</span>
        </div>
        <Typography variant="headline-lg">Create New Epic</Typography>
        <p className="mt-2 text-body-lg text-medium-dark ">
          Define a major project phase or high-level milestone to group <br />{" "}
          related tasks and track architectural progress.
        </p>
      </div>

      <EpicCard
        projectId={projectId}
        members={members}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading || isFetchingMembers}
      />
    </div>
  );
}
