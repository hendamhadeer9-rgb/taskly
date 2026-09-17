import React from "react";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import Icon from "@/components/ui/Icon";

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
    <Link href={`/project/${project.id}/epic`}>
      <div className="bg-white rounded-lg p-6 min-h-55 border border-neutral-border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
        <div>
          <Typography
            variant="title-md"
            className="font-semibold text-neutral-dark mb-2"
          >
            {project.name}
          </Typography>

          <Typography
            variant="body-md"
            className="text-neutral-muted line-clamp-2 text-sm mb-6"
          >
            {project.description || "No description provided."}
          </Typography>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-border text-xs text-primary font-medium mb-3">
            <span className="flex items-center gap-1">
              <Icon name="Flowchart"></Icon>Epics
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Checklist"></Icon>Tasks
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Group"></Icon>Members
            </span>
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
    </Link>
  );
};
