"use client";

import { useState } from "react";
import { formatDate, formatTime } from "@/hooks/formatDateTime";
import { hooks } from "@/hooks/hooks";
import DatePicker from "../component/DatePicker";

interface EmployeesLogProps {
  onBackToDTR: () => void;
}

export default function EmployeesLog({ onBackToDTR }: EmployeesLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showAll, setShowAll] = useState(false);

  const { data: employeesLog = [] } = hooks.fetchEmployeesLog();

  const filteredLogs = employeesLog.filter((log: any) => {
    const matchesName = log.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDate = showAll
      ? true
      : selectedDate
      ? new Date(log.date).toLocaleDateString("en-CA") === selectedDate
      : true;

    return matchesName && matchesDate;
  });

  return (
    <div className="w-full flex flex-col gap-6">

      {/* FILTER BAR */}
      <div className="w-full flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search employee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full xl:w-[40%] px-6 py-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1]"
        />

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto justify-end">

          {/* DATE PICKER */}
          {!showAll && (
            <div className="w-full sm:w-auto">
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                className="w-full"
              />
            </div>
          )}

          {/* TOGGLE DATE / ALL */}
          <button
            onClick={() => setShowAll(!showAll)}
            className={`px-6 py-4 rounded-xl font-semibold transition shadow-md w-full sm:w-[180px]
              ${
                showAll
                  ? "bg-yellow-700 text-white hover:bg-yellow-600"
                  : "bg-yellow-500 text-white hover:bg-yellow-400"
              }`}
          >
            {showAll ? "Filter Date" : "Show All"}
          </button>

          {/* BACK BUTTON */}
          <button
            onClick={onBackToDTR}
            className="px-6 py-4 rounded-xl bg-[#0441B1] text-white font-semibold hover:bg-blue-900 transition shadow-md w-full sm:w-[180px]"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl max-h-[70vh] border shadow-sm">

        <table className="w-full border-collapse">

          <thead className="sticky top-0 bg-[#0441B1] text-white text-xl z-10">
            <tr>
              <th className="p-5 text-left">Employee</th>
              <th className="p-5 text-center">Date</th>
              <th className="p-5 text-center">Time In</th>
              <th className="p-5 text-center">Time Out</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log: any, index: number) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition text-lg"
                >
                  <td className="p-5 font-medium truncate">{log.name}</td>
                  <td className="p-5 text-center">
                    {log.date ? formatDate(log.date) : "----"}
                  </td>
                  <td className="p-5 text-center">
                    {log.time_in ? formatTime(log.time_in) : "----"}
                  </td>
                  <td className="p-5 text-center">
                    {log.time_out ? formatTime(log.time_out) : "----"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-gray-500 text-lg"
                >
                  No employee logs found.
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}