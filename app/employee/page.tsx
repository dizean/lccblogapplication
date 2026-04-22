"use client";

import { useState } from "react";
import Link from "next/link";
import AddEmployeeModal from "../modals/addEmployee";
import EmployeeDTRView from "./EmployeeDTR";
import EmployeesLog from "./EmployeeLog";

export default function EmployeesPage() {
  const [showLogs, setShowLogs] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* HEADER (FULL WIDTH) */}
      <header className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 md:px-10 py-4 bg-white shadow-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0441B1] text-center sm:text-left">
          {showLogs ? "Employee Logs" : "Employee DTR"}
        </h1>

        <Link
          href="/"
          className="w-full sm:w-auto text-center px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition"
        >
          ← Back to Home
        </Link>
      </header>

      {/* FULL HEIGHT CONTENT */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="h-full w-full flex flex-col p-2 sm:p-4 md:p-6">

          {!showLogs ? (
            <div className="flex-1 overflow-auto">
              <EmployeeDTRView
                onShowLogs={() => setShowLogs(true)}
                onAddEmployee={() => setIsAddModalOpen(true)}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <EmployeesLog onBackToDTR={() => setShowLogs(false)} />
            </div>
          )}

        </div>
      </main>

      {/* MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <AddEmployeeModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}