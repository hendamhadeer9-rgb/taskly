"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Typography } from "../../ui/Typography";
import { logoutAction } from "@/app/(Auth)/logout/logout.action";
import { toast } from "sonner";
import Logo from "@/../public/Icon.svg";
import Close from "@/../public/close.svg";
import Projects from "@/../public/projects.svg";
import Statistics from "@/../public/statistics.svg";
import Folder from "@/../public/folder.svg";
import Arrow from "@/../public/arrow_up.svg";
import Epics from "@/../public/epics.svg";
import Tasks from "@/../public/tasks.svg";
import Members from "@/../public/members.svg";
import Details from "@/../public/details.svg";
import Collaps from "@/../public/collaps.svg";
import Uncollaps from "@/../public/uncollaps.svg";
import Logout from "@/../public/logout.svg";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  activeProjectId?: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  setIsCollapsed,
  activeProjectId,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathSegments = pathname.split("/");
  const currentProjectId =
    pathSegments[1] === "project" && pathSegments[2]
      ? pathSegments[2]
      : activeProjectId;

  const isProjectsSection = pathname.startsWith("/project") && currentProjectId;

  const mainNavItems = [
    {
      label: "Projects",
      icon: <Projects className="w-5 h-5 shrink-0" />,
      href: "/project",
    },
    {
      label: "My Statistics",
      icon: <Statistics className="w-5 h-5 shrink-0" />,
      href: "/statistics",
    },
  ];

  const projectSubItems = [
    {
      label: "Epics",
      icon: <Epics className="w-5 h-5 shrink-0" />,
      href: `/project/${currentProjectId}/epic`,
    },
    {
      label: "Tasks",
      icon: <Tasks className="w-5 h-5 shrink-0" />,
      href: `/project/${currentProjectId}/tasks`,
    },
    {
      label: "Members",
      icon: <Members className="w-5 h-5 shrink-0" />,
      href: `/project/${currentProjectId}/members`,
    },
    {
      label: "Details",
      icon: <Details className="w-5 h-5 shrink-0" />,
      href: `/project/${currentProjectId}/edit`,
    },
  ];

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      onClose();
      const logout = await logoutAction();
      if (logout) {
        router.push("/logIn");
        router.refresh();
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-100 h-screen bg-surface-low flex flex-col justify-between transition-all duration-300 ease-in-out 
        ${isCollapsed ? "md:w-20" : "md:w-64"}
        ${isOpen ? "translate-x-0 w-full" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div
        className={`p-4 flex flex-col gap-6 ${isCollapsed ? "overflow-visible" : "overflow-y-auto"}`}
      >
        {/* Header / Logo */}
        <div
          className={`flex items-center h-10 px-2 ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {isCollapsed ? (
            <Logo />
          ) : (
            <div className="flex items-center gap-2">
              <Logo />
              <Typography
                variant="title-md"
                className="font-bold text-neutral-dark"
              >
                TASKLY
              </Typography>
            </div>
          )}

          <button onClick={onClose} className="md:hidden p-1 rounded-lg">
            <Close />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-medium text-sm transition-colors ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-white text-primary font-semibold [&_path]:fill-primary"
                    : "text-neutral-dark hover:bg-surface-highest [&_path]:fill-neutral-dark"
                }`}
              >
                <div className="shrink-0 flex items-center justify-center">
                  {item.icon}
                </div>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Active Project Accordion Section */}
          {isProjectsSection && (
            <div className="mt-2 relative group">
              <button
                onClick={() => setIsProjectOpen(!isProjectOpen)}
                className={`w-full flex items-center px-3 py-2.5 rounded-sm font-medium text-sm text-neutral-dark bg-surface-highest transition-colors ${
                  isCollapsed ? "justify-center" : "justify-between"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate max-w-32.5">
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
                    <Arrow />
                  </div>
                )}
              </button>

              {!isCollapsed && isProjectOpen && (
                <div className="flex flex-col gap-1 py-1 bg-white rounded-b-sm">
                  {projectSubItems.map((subItem) => {
                    const isActive = pathname === subItem.href;

                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center gap-3 mx-2 px-4 py-2.5 text-sm font-medium rounded-full transition-colors ${
                          isActive && "bg-surface-low "
                        }`}
                      >
                        <div className="shrink-0 flex items-center justify-center">
                          {subItem.icon}
                        </div>
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full top-0 ml-4 w-48 bg-surface-highest rounded-tr-sm rounded-br-sm p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-110 flex flex-col gap-1 ">
                  {projectSubItems.map((subItem) => {
                    const isActive = pathname === subItem.href;

                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium  ${
                          isActive && "bg-white "
                        }`}
                      >
                        <div className="shrink-0 flex items-center justify-center">
                          {subItem.icon}
                        </div>
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-4 flex flex-col gap-1">
        <div className="pt-3 border-t border-nav-border flex flex-col gap-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-dark ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="shrink-0">
              {isCollapsed ? <Uncollaps /> : <Collaps />}
            </div>
            {!isCollapsed && <span>Collapse</span>}
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-error w-full ${
              isCollapsed && "justify-center"
            }`}
          >
            <Logout className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <div>{isLoggingOut ? "Logging out..." : "Logout"}</div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
