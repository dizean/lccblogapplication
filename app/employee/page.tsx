  "use client";

  import { useEffect, useState } from "react";
  import Link from "next/link";
  import AddEmployeeModal from "../modals/addEmployee";
  import EmployeeDTRView from "./EmployeeDTR";
  import EmployeesLog from "./EmployeeLog";
import { formatDateTime } from "@/hooks/formatDateTime";

  export default function EmployeesPage() {
    const [showLogs, setShowLogs] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const savedGate = localStorage.getItem("selectedGate");
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }, []);
    const { date: formattedDate, time: formattedTime } = formatDateTime(currentTime);
    return (
      <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
        <header className="w-full bg-white shadow-md px-4 sm:px-6 md:px-10 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0441B1] text-center md:text-left">
              {showLogs ? "Employee Logs" : "List of Employees"}
            </h1>

            <div className="flex flex-col items-center text-center gap-1">
              {savedGate && (
                <div className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                  <span className="text-[#0441B1]">{savedGate}</span>
                </div>
              )}
              <div className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
                {formattedDate}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0441B1]">
                {formattedTime}
              </div>
            </div>

            <Link
              href="/"
              className="w-full md:w-auto text-center px-6 py-3 sm:px-7 sm:py-3 text-sm sm:text-lg bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all shadow-md"
            >
              ← Back to Home
            </Link>
          </div>
        </header>
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