import React from "react";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import Epics from "@/../public/epics.svg";
import Tasks from "@/../public/tasks.svg";
import Members from "@/../public/members.svg";
import Edit from "@/../public/edit.svg";

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
    <div className="bg-white rounded-lg p-5 sm:p-6 flex flex-col justify-between h-full w-full min-w-0">
      <div className="min-w-0">
        <Link href={`/project/${project.id}`} className="block min-w-0">
          <Typography
            variant="title-md"
            className="font-medium text-neutral-dark mb-2 hover:text-primary transition-colors wrap-anywhere line-clamp-1"
          >
            {project.name}
          </Typography>

          <Typography
            variant="body-md"
            className="text-neutral-muted font-regular line-clamp-2 text-sm mb-6 wrap-anywhere"
          >
            {project.description}
          </Typography>
        </Link>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 py-3 border-b border-nav-border text-xs sm:text-label-sm text-primary font-semibold mb-3">
          <Link
            href={`/project/${project.id}/epics`}
            className="flex items-center gap-1 [&_path]:fill-primary "
          >
            <Epics />
            <span>Epics</span>
          </Link>

          <Link
            href={`/project/${project.id}/tasks`}
            className="flex items-center gap-1 [&_path]:fill-primary "
          >
            <Tasks />
            <span>Tasks</span>
          </Link>

          <Link
            href={`/project/${project.id}/members`}
            className="flex items-center gap-1 [&_path]:fill-primary "
          >
            <Members />
            <span>Members</span>
          </Link>

          <Link
            href={`/project/${project.id}/edit`}
            className="flex items-center gap-1 "
          >
            <Edit />
            <span>Edit</span>
          </Link>
        </div>

        <div className="flex justify-between items-center text-xs text-neutral-muted gap-2">
          <Typography
            variant="label-sm"
            className="text-neutral-muted shrink-0"
          >
            CREATED AT
          </Typography>
          <Typography
            variant="label-sm"
            className="text-neutral-muted truncate"
          >
            {formatDate(project.created_at)}
          </Typography>
        </div>
      </div>
    </div>
  );
};
