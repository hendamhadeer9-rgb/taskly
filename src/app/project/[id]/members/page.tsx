"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { membersList } from "@/api/services/servicesApi";

interface PageProps {
  params: Promise<{
    id: string;
  }>;}

export default function page({ params }: PageProps) {
    const resolvedParams = use(params);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [targetDate, setTargetDate] = useState("");

   const projectId = resolvedParams?.id 

   async function onSubmit(data: ProjectUpdateData) {
       try {
         
   
         const response = await membersList(projectId!, data);
         console.log("Update Response:", response);
   
         if (response && response.success) {
           toast.success("Project updated successfully");
           
         } else {
           toast.error("Failed To update Project, Try Again Later");
         }
       } catch (error) {
         console.error("Submission Error:", error);
         toast.error("An error occurred while creating the project");
       } finally {
         setIsSubmitting(false);
       }
     }
const membersData: Member[] = [
  {
    id: "1",
    name: "Mahmoud Taha",
    email: "mahmoud.taha@example.com",
    role: "Owner",
    initials: "MT",
    isOwner: true,
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    role: "Member",
    initials: "SJ",
  },
  {
    id: "3",
    name: "David Lee",
    email: "david.lee@example.com",
    role: "Member",
    initials: "DL",
  },
  {
    id: "4",
    name: "Aisha Meyer",
    email: "aisha.m@example.com",
    role: "Member",
    initials: "AM",
  },
];
  
  return (
    <div className="min-h-screen bg-Surface-Low p-6 md:p-10 space-y-6 max-w-[1200px] mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-muted">
        <Link href="/projects" className="hover:underline uppercase tracking-wider">
          Projects
        </Link>
        <span>/</span>
        <Link href="/projects/product-name" className="hover:underline uppercase tracking-wider">
          Project Name
        </Link>
        <span>/</span>
        <span className="text-neutral-dark font-medium uppercase tracking-wider">
          Members
        </span>
      </nav>

      {/* Header & Action Button */}
      <div className="flex items-center justify-between">
        <Typography variant="headline-lg" className="font-bold text-neutral-dark">
          Project Members
        </Typography>

        <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium">
          <span>+</span> Invite Members
        </Button>
      </div>

      {/* Main Members Card / Table Container */}
      <div className="bg-white rounded-xl border border-neutral-border/40 shadow-sm overflow-hidden max-w-[577px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-3 border-b border-neutral-border/20 text-[11px] font-semibold text-neutral-muted uppercase tracking-wider">
          <div className="col-span-8">Member</div>
          <div className="col-span-4 text-right pr-2">Role</div>
        </div>

        {/* Members List */}
        <div className="divide-y divide-neutral-border/10">
          {membersData.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-12 items-center px-6 py-4 hover:bg-neutral-50/50 transition-colors"
            >
              {/* Member Info (Avatar + Name & Email) */}
              <div className="col-span-8 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0">
                  {member.initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-neutral-dark truncate">
                    {member.name}
                  </span>
                  <span className="text-xs text-neutral-muted truncate">
                    {member.email}
                  </span>
                </div>
              </div>

              {/* Role Badge */}
              <div className="col-span-4 flex justify-end">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    member.isOwner
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-muted border border-neutral-200"
                  }`}
                >
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}