"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardContent from "./components/DashboardContent";

export default function AdminPage() {
  const [active, setActive] = useState("employees-list");

  return (
    <div className="flex h-screen">
      {/* Sidebar on left */}
      <Sidebar active={active} setActive={setActive} />

      {/* Right side dynamic content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <DashboardContent active={active} />
      </main>
    </div>
  );
}
