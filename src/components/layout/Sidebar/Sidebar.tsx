"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../../ui/Icon";
import Image from "next/image";
import { Typography } from "../../ui/Typography";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const [isProjectOpen, setIsProjectOpen] = useState(true);

  const isProjectsSection = pathname.startsWith("/projects");

  const mainNavItems = [
    { label: "Projects", icon: "Folder", href: "/projects" },
    { label: "My Statistics", icon: "Equalizer", href: "/statistics" },
  ];

  const projectSubItems = [
    { label: "Epics", icon: "Flowchart", href: "/projects/active/epics" },
    { label: "Tasks", icon: "Checklist", href: "/projects/active/tasks" },
    { label: "Members", icon: "Group", href: "/projects/active/members" },
    { label: "Details", icon: "info", href: "/projects/active/details" },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-100 h-screen bg-surface-low flex flex-col justify-between transition-transform duration-300 ease-in-out 
          ${isCollapsed ? "md:w-20" : "md:w-64"}
          ${isOpen ? "translate-x-0 w-full" : "-translate-x-full md:translate-x-0 "}
        `}
      >
        <div className="p-4 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center justify-between h-10 px-2">
            {isCollapsed ? (
              <Image
                src="/icon.svg"
                alt="logo"
                width={20}
                height={20}
                className="mx-auto"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Image src="/icon.svg" alt="logo" width={20} height={20} />
                <Typography
                  variant="title-md"
                  className="font-bold text-slate-900"
                >
                  TASKLY
                </Typography>
              </div>
            )}

            <button onClick={onClose} className="md:hidden p-1 rounded-lg ">
              <Icon name="close" width={20} height={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 ">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-full font-medium text-sm  ${
                    isActive
                      ? "bg-white"
                      : "text-neutral-dark hover:bg-surface-highest"
                  }`}
                >
                  <Icon
                    name={item.icon}
                    width={20}
                    height={20}
                    className="text-neutral-dark!"
                  />

                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}

            {isProjectsSection && (
              <div className="mt-2">
                <button
                  onClick={() => setIsProjectOpen(!isProjectOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-full font-medium text-sm text-neutral-dark hover:bg-surface-highest "
                >
                  <div className="flex items-center gap-3 ">
                    <Icon
                      name="folder"
                      width={20}
                      height={20}
                      className="text-neutral-dark!"
                    />

                    {!isCollapsed && (
                      <span className="truncate max-w-32.5 ">
                        Active Project Name
                      </span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div
                      className={`transition-transform duration-200 ${
                        isProjectOpen ? "rotate-0" : "rotate-180"
                      }`}
                    >
                      <Image
                        src="/active_project_arrow.svg"
                        alt="arrow"
                        width={9}
                        height={5}
                      />
                    </div>
                  )}
                </button>


                {isProjectOpen && (
                  <div
                    className={`flex flex-col gap-1 mt-1 ${
                      !isCollapsed ? "pl-6" : "pl-0"
                    }`}
                  >
                    {projectSubItems.map((subItem) => {
                      const isActive = pathname === subItem.href;

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium ${
                            isActive
                              ? "bg-surface-highest "
                              : "text-neutral-dark hover:bg-surface-highest"
                          }`}
                        >
                          <Icon
                            name={subItem.icon}
                            width={18}
                            height={18}
                            className="text-neutral-dark!"
                          />

                          {!isCollapsed && <span>{subItem.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 flex flex-col gap-1">

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-dark "
          >
            {isCollapsed ? (
              <Image
                src="/collaps arrow.svg"
                alt="logo"
                width={11}
                height={20}
              />
            ) : (
              <Image
                src="/collaps arrow 2.svg"
                alt="logo"
                width={11}
                height={20}
              />
            )}

            {!isCollapsed && <span>Collapse</span>}
          </button>


          <button
            onClick={() => {
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error w-full text-right"
          >
            <Icon name="logout" width={20} height={20} className="text-error" />

            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
