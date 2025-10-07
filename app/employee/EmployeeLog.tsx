"use client";
import { useState } from "react";
import { formatDate, formatTime } from "@/hooks/formatDateTime";
import { hooks } from "@/hooks/hooks";

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
        <>
            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 w-full">
                <input
                    type="text"
                    placeholder="🔍 Search employee name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 px-10 py-5 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] transition-all"
                />

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-end">
                    {!showAll && (
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] text-xl w-full sm:w-[200px]"
                        />
                    )}

                    <button
                        onClick={() => setShowAll(!showAll)}
                        className={`w-full sm:w-[210px] px-8 py-5 text-xl font-semibold rounded-xl transition-all shadow-md 
                        ${showAll
                                ? "bg-yellow-800 text-white hover:bg-yellow-600"
                                : "bg-yellow-600 text-white hover:bg-yellow-400"
                            }`}
                    >
                        {showAll ? "Filter by Date" : "Show All"}
                    </button>


                    <button
                        onClick={onBackToDTR}
                        className="w-full sm:w-[210px] px-8 py-5 text-xl bg-[#0441B1] text-white font-semibold rounded-xl hover:bg-blue-900 transition-all shadow-md"
                    >
                        ← Back to DTR
                    </button>
                </div>
            </div>

            {/* LOGS TABLE */}
            <div className="overflow-x-auto overflow-y-auto flex-grow rounded-xl max-h-[70vh]">
                <table className="w-full table-fixed border-collapse">
                    <colgroup>
                        <col className="w-[30%]" />
                        <col className="w-[25%]" />
                        <col className="w-[22.5%]" />
                        <col className="w-[22.5%]" />
                    </colgroup>

                    <thead className="sticky top-0 z-10 bg-[#0441B1] text-white text-3xl shadow-md">
                        <tr>
                            <th className="p-8 text-left">Employee</th>
                            <th className="p-8 text-center">Date</th>
                            <th className="p-8 text-center">Time In</th>
                            <th className="p-8 text-center">Time Out</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log: any, index: number) => (
                                <tr
                                    key={index}
                                    className="border-b text-2xl hover:bg-gray-50 transition"
                                >
                                    <td className="p-8 font-semibold truncate">{log.name}</td>
                                    <td className="p-8 text-center">
                                        {log.date ? formatDate(log.date) : "----"}
                                    </td>
                                    <td className="p-8 text-center">
                                        {log.time_in ? formatTime(log.time_in) : "----"}
                                    </td>
                                    <td className="p-8 text-center">
                                        {log.time_out ? formatTime(log.time_out) : "----"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-8 text-gray-500 text-center text-xl"
                                >
                                    No employee logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
