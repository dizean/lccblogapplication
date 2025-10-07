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
      <main className="flex-grow p-2 md:px-10">
        <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 flex flex-col h-full">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0441B1] tracking-tight text-center md:text-left">
              {showLogs ? "Employee Logs" : "Employee DTR"}
            </h1>
            <Link
              href="/"
              className="px-8 py-4 text-xl bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all"
            >
              ← Back to Home
            </Link>
          </div>

          {!showLogs ? (
            <EmployeeDTRView
              onShowLogs={() => setShowLogs(true)}
              onAddEmployee={() => setIsAddModalOpen(true)}
            />
          ) : (
            <EmployeesLog onBackToDTR={() => setShowLogs(false)} />

          )}
        </div>
      </main>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
          <AddEmployeeModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
