"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { getProjectById, membersList } from "@/api/services/servicesApi";
import Invite from "@/../../public/invite.svg"
import MemberListTable, { Member } from "@/components/features/members/MemberListTable";
import { ProjectsErrorState } from "@/components/features/projects/ProjectsErrorState";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const resolvedParams = use(params);
  const projectId = resolvedParams?.id;

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projectName, setProjectName] = useState<string>("")


 

  const fetchMembers = async () => {
    if (!projectId) return;
    
    setLoading(true);
    setError(false);

    try {
       const project = await getProjectById(projectId);
      
      const data = await membersList(projectId);
      if (data === null) {
        setError(true)
        return;
      }
      setMembers(data );
      setProjectName(project.name);
    } catch (err) {
      console.error("Failed to fetch members:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  if (error) {
    return (
      <div className="min-h-screen bg-Surface-Low flex items-center justify-center p-6">
        <ProjectsErrorState
          title="Something went wrong"
          description="We're having trouble retrieving your project members right now. Please try again in a moment."
          buttonText="Retry Connection"
          onRetry={fetchMembers}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-Surface-Low p-6 md:p-10 space-y-6 max-w-300 mx-auto">
      {/* Breadcrumbs */}
      <nav className="hidden sm:flex items-center gap-2 text-xs font-bold text-neutral-muted/60">
        <Link
          href="/project"
          className=" uppercase tracking-wider"
        >
          Projects
        </Link>
        <span>/</span>
        <Link
          href={`/project/${projectId}`}
          className=" uppercase tracking-wider"
        >
          {projectName}
        </Link>
        <span>/</span>
        <span className=" font-medium uppercase text-primary tracking-wider">
          Members
        </span>
      </nav>

      {/* Header & Action Button */}
      <div className="flex items-center justify-between">
        <Typography
          variant="headline-lg"
          className="font-semibold text-neutral-dark "
        >
          Project Members
        </Typography>

        <Button variant="primary" className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-sm text-body-md text-white font-bold">
          <Invite className="w-5 h-4"/> Invite Members
        </Button>
      </div>

      {/* Main Members Card / Table Container */}
      <div className=" rounded-lg shadow-sm overflow-hidden w-full sm:w-xl mx-auto sm:my-15">
        {/* Table Header */}
        <div className="bg-surface-low grid grid-cols-12 px-6 py-3 border-b border-nav-border text-label-sm font-bold text-neutral-muted uppercase tracking-wider">
          <div className="col-span-8 ">Member</div>
          <div className="col-span-4 text-right pr-2 ">Role</div>
        </div>

        {/* Members List Component */}
        <MemberListTable members={members} />
        
      </div>

       <Button variant="primary" className="flex ml-auto sm:hidden items-center justify-center w-10 h-10 rounded-lg text-white">
          <Invite  /> 
        </Button>
    </div>
    
  );
}