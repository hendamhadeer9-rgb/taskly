"use client";

import { useState } from "react";
import Icon from "../../ui/Icon";

type IconName = "Folder" | "Group" | "Info" | "Checklist";

interface NavItem {
  id: string;
  label: string;
  iconName: IconName;
  isCenter?: boolean;
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("projects");

  const navItems: NavItem[] = [
    {
      id: "epics",
      label: "Epics",
      iconName: "Group",
    },
    {
      id: "tasks",
      label: "Tasks",
      iconName: "Checklist",
    },
    {
      id: "projects",
      label: "Projects",
      iconName: "Folder",
      isCenter: true,
    },
    {
      id: "members",
      label: "Members",
      iconName: "Group",
    },
    {
      id: "details",
      label: "Details",
      iconName: "Info",
    },
  ];

  const visibleItems = isOpen
    ? navItems
    : navItems.filter((item) => item.isCenter);

  const handleItemClick = (item: NavItem) => {
    setActiveTab(item.id);

    if (item.isCenter) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
      <div
        className={`flex items-center py-2 px-3 transition-all duration-300 ${
          isOpen ? "justify-around" : "justify-center"
        }`}
      >
        {visibleItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`flex flex-col items-center justify-center min-w-12.5 transition-colors ${
                isActive
                  ? "font-semibold text-primary!"
                  : "text-neutral-dark! hover:text-primary!"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <Icon
                  name={item.iconName}
                  width={20}
                  height={20}
                  className={
                    isActive
                      ? "text-primary!"
                      : "text-neutral-dark! hover:text-primary!"
                  }
                />
              </div>
              <span className="mt-1 text-label-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
