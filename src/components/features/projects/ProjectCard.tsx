import React from "react";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import Epics from "@/../public/epics.svg";
import Tasks from "@/../public/tasks.svg";
import Members from "@/../public/members.svg";

export interface Project {
  id: string | number;
  name: string;
  description: string;
  created_at: string;
}

export interface ProjectCardProps {
  project: Project;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg p-6 min-h-55 flex flex-col justify-between h-full">
      <div>
        {/* الضغط على الاسم أو الوصف يوجه لصفحة الـ epics كافتراضي */}
        <Link href={`/project/${project.id}/epics`}>
          <Typography
            variant="title-md"
            className="font-medium text-neutral-dark mb-2 hover:text-primary transition-colors"
          >
            {project.name}
          </Typography>

          <Typography
            variant="body-md"
            className="text-neutral-muted font-regular line-clamp-2 text-sm mb-6"
          >
            {project.description}
          </Typography>
        </Link>
      </div>

      <div>
        {/* لينكات الأقسام الفرعية متوافقة مع مسارات الـ Sidebar */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-1 py-4 border-b border-nav-border text-label-sm text-primary font-semibold mb-3">
          <Link
            href={`/project/${project.id}/epics`}
            className="flex items-center gap-1 [&_path]:fill-primary"
          >
            <Epics className="w-4 h-4" />
            <span>Epics</span>
          </Link>

          <Link
            href={`/project/${project.id}/tasks`}
            className="flex items-center gap-1 [&_path]:fill-primary"
          >
            <Tasks className="w-4 h-4" />
            <span>Tasks</span>
          </Link>

          <Link
            href={`/project/${project.id}/members`}
            className="flex items-center gap-1 [&_path]:fill-primary"
          >
            <Members className="w-4 h-4" />
            <span>Members</span>
          </Link>
        </div>

        <div className="flex justify-between items-center text-xs text-neutral-muted">
          <Typography variant="label-sm" className="text-neutral-muted">
            CREATED AT
          </Typography>
          <Typography variant="label-sm" className="text-neutral-muted">
            {formatDate(project.created_at)}
          </Typography>
        </div>
      </div>
    </div>
  );
};