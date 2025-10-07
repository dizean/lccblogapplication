"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type SidebarProps = {
  active: string;
  setActive: (tab: string) => void;
};

export default function Sidebar({ active, setActive }: SidebarProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  const menu = [
    { key: "employees", label: "Employees" },
    { key: "rooms", label: "Rooms" },
    {
      key: "designation",
      label: "Designation",
      children: [
        { key: "department", label: "Department" },
        { key: "classification", label: "Classification" },
        { key: "status", label: "Status" },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-[#0441B1] text-white p-6 flex flex-col shadow-lg">
      <h2 className="text-3xl font-bold mb-8">Admin Panel</h2>
      <nav className="space-y-3">
        {menu.map((section) => (
          <div key={section.key}>
            {/* Main Section */}
            <button
              onClick={() =>
                section.children
                  ? toggleSection(section.key)
                  : setActive(section.key)
              }
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-lg transition-colors ${
                active === section.key
                  ? "bg-white text-[#0441B1] font-semibold"
                  : "hover:bg-white hover:text-[#0441B1]"
              }`}
            >
              {section.label}
              {section.children &&
                (openSection === section.key ? (
                  <ChevronDown size={22} />
                ) : (
                  <ChevronRight size={22} />
                ))}
            </button>

            {/* Dropdown only for Designation */}
            {section.children && (
              <div
                className={`transition-all overflow-hidden ${
                  openSection === section.key ? "max-h-72" : "max-h-0"
                }`}
              >
                <div className="pl-8 mt-2 space-y-2">
                  {section.children.map((child) => (
                    <button
                      key={child.key}
                      onClick={() => setActive(child.key)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-base transition-colors ${
                        active === child.key
                          ? "bg-white text-[#0441B1] font-semibold"
                          : "hover:bg-white hover:text-[#0441B1]"
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
