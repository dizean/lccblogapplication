"use client";

import { useState } from "react";
import { formatDate, formatTime } from "@/hooks/formatDateTime";
import { hooks } from "@/hooks/hooks";

interface EmployeeDTRViewProps {
  onShowLogs: () => void;
  onAddEmployee: () => void;
}

export default function EmployeeDTRView({
  onShowLogs,
  onAddEmployee,
}: EmployeeDTRViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: employees = [] } = hooks.fetchEmployees();
  const { data: employeesLog = [] } = hooks.fetchEmployeesLog();

  const timeInMutation = hooks.timeIn();
  const timeOutMutation = hooks.timeOut();

  const filteredEmployees = employees.filter((emp: any) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mergedEmployees = filteredEmployees.map((emp: any) => {
    const todayLog = employeesLog.find(
      (log: any) =>
        log.employee_id === emp.id &&
        new Date(log.date).toDateString() === new Date().toDateString()
    );

    return {
      ...emp,
      timeIn: todayLog?.time_in || null,
      timeOut: todayLog?.time_out || null,
      logDate: todayLog?.date || null,
    };
  });

  const isLoading =
    timeInMutation.isPending || timeOutMutation.isPending;

  return (
    <div className="w-full flex flex-col gap-6">

      {/* SEARCH + ACTIONS */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">

        <input
          type="text"
          placeholder="Search employee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full xl:w-[45%] px-6 py-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1]"
        />

        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto justify-end">

          <button
            onClick={onAddEmployee}
            className="px-6 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-md w-full sm:w-[180px]"
          >
            + Add Employee
          </button>

          <button
            onClick={onShowLogs}
            className="px-6 py-4 bg-[#0441B1] text-white font-semibold rounded-xl hover:bg-blue-900 transition shadow-md w-full sm:w-[180px]"
          >
            View Logs
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border shadow-sm max-h-[70vh]">

        <table className="w-full border-collapse">

          <thead className="sticky top-0 bg-[#0441B1] text-white text-xl z-10">
            <tr>
              <th className="p-5 text-left">Employee</th>
              <th className="p-5 text-left">Date</th>
              <th className="p-5 text-left">Time In</th>
              <th className="p-5 text-left">Time Out</th>
              <th className="p-5 text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            {mergedEmployees.length > 0 ? (
              mergedEmployees.map((emp: any) => (
                <tr
                  key={emp.id}
                  className="border-b hover:bg-gray-50 transition text-lg"
                >

                  <td className="p-5 font-semibold truncate">
                    {emp.name}
                  </td>

                  <td className="p-5">
                    {emp.logDate ? formatDate(emp.logDate) : "----"}
                  </td>

                  <td className="p-5">
                    {formatTime(emp.timeIn)}
                  </td>

                  <td className="p-5">
                    {formatTime(emp.timeOut)}
                  </td>

                  <td className="p-5 text-center">

                    {!emp.timeIn && !emp.timeOut ? (
                      <div className="flex gap-2 justify-center">

                        <button
                          onClick={() => timeInMutation.mutate(emp.id)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-[110px]"
                        >
                          {timeInMutation.isPending ? "..." : "Time In"}
                        </button>

                        <button
                          onClick={() => timeOutMutation.mutate(emp.id)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-[130px]"
                        >
                          Time Out
                        </button>

                      </div>
                    ) : emp.timeIn && !emp.timeOut ? (
                      <button
                        onClick={() => timeOutMutation.mutate(emp.id)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full"
                      >
                        Time Out
                      </button>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        Completed
                      </span>
                    )}

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-gray-500 text-lg"
                >
                  No employees found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}