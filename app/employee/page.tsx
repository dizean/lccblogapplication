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
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* MAIN FULL WIDTH */}
      <main className="flex-grow w-full px-3 sm:px-6 md:px-10 py-4 md:py-6">
        
        <div className="w-full h-full bg-white shadow-xl rounded-none md:rounded-2xl p-4 sm:p-6 md:p-10 flex flex-col">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0441B1] text-center sm:text-left">
              {showLogs ? "Employee Logs" : "Employee DTR"}
            </h1>

            <Link
              href="/"
              className="w-full sm:w-auto text-center px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition"
            >
              ← Back to Home
            </Link>
          </div>

          {/* CONTENT TAKES REMAINING HEIGHT */}
          <div className="flex flex-col flex-grow overflow-hidden">
            {!showLogs ? (
              <EmployeeDTRView
                onShowLogs={() => setShowLogs(true)}
                onAddEmployee={() => setIsAddModalOpen(true)}
              />
            ) : (
              <EmployeesLog onBackToDTR={() => setShowLogs(false)} />
            )}
          </div>

        </div>
      </main>

      {/* MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full h-full max-w-2xl max-h-[95vh] overflow-y-auto">
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