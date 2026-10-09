"use client";

import React, { useState } from "react";
import { Epic } from "@/api/services/servicesApi";
import { ProjectEpicCard } from "@/components/features/epics/ProjectEpicCard";
import { EpicDetailsModal } from "@/components/modals/EpicDetailsModal";
import Pagination from "@/components/Pagination/Pagination";

interface DesktopEpicsListProps {
  projectId: string;
  epicsList: Epic[];
  currentPage: number;
  totalPages: number;
}

export function DesktopEpicsList({
  projectId,
  epicsList,
  currentPage,
  totalPages,
}: DesktopEpicsListProps) {
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEpicClick = (epicId: string) => {
    setSelectedEpicId(epicId);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {epicsList.map((epic) => (
          <ProjectEpicCard
            key={epic.id}
            epic={epic}
            onClick={() => handleEpicClick(epic.id)}
          />
        ))}
      </div>

      {/* Pagination UI */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />

      {/* Modal Details */}
      <EpicDetailsModal
        projectId={projectId}
        epicId={selectedEpicId ?? ""}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEpicId(null);
        }}
      />
    </>
  );
}
