"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Projects from "@/../public/projects.svg";
import Epics from "@/../public/epics.svg";
import Tasks from "@/../public/tasks.svg";
import Members from "@/../public/members.svg";
import Details from "@/../public/details.svg";

interface MobileNavProps {
  activeProjectId?: string;
}

export default function MobileNav({ activeProjectId }: MobileNavProps) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/");
  const currentProjectId =
    pathSegments[1] === "project" && pathSegments[2]
      ? pathSegments[2]
      : activeProjectId;
  const isProjectsSection = pathname.startsWith("/project") && currentProjectId;

  const navItems = [
    {
      id: "epics",
      label: "Epics",
      icon: <Epics />,
      href: `/project/${currentProjectId}/epic`,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <Tasks />,
      href: `/project/${currentProjectId}/tasks`,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <Projects />,
      href: `/project/${currentProjectId}`,
    },
    {
      id: "members",
      label: "Members",
      icon: <Members />,
      href: `/project/${currentProjectId}/members`,
    },
    {
      id: "details",
      label: "Details",
      icon: <Details />,
      href: `/project/${currentProjectId}/edit`,
    },
  ];

  return (
    <>
      {isProjectsSection && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
          <div className="flex items-center justify-around py-2 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center justify-center min-w-12.5 transition-colors ${
                    isActive
                      ? "font-semibold text-primary [&_path]:fill-primary"
                      : "text-neutral-dark hover:text-primary [&_path]:fill-neutral-dark hover:[&_path]:fill-primary"
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="mt-1 text-label-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
