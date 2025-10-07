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

    return (
        <>
            {/* SEARCH + BUTTONS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 w-full">
                <input
                    type="text"
                    placeholder="🔍 Search employee name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 px-10 py-5 text-xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] transition-all"
                />

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-end">
                    <button
                        onClick={onAddEmployee}
                        className="w-full sm:w-[250px] px-10 py-5 bg-green-600 text-white font-semibold text-xl rounded-xl hover:bg-green-700 transition-all shadow-md"
                    >
                        + Add Employee
                    </button>

                    <button
                        onClick={onShowLogs}
                        className="w-full sm:w-[210px] px-8 py-5 text-xl bg-[#0441B1] text-white font-semibold rounded-xl hover:bg-blue-900 transition-all shadow-md"
                    >
                        View Logs
                    </button>
                </div>
            </div>
            {/* EMPLOYEE TABLE */}
            <div className="overflow-x-auto overflow-y-auto flex-grow rounded-xl max-h-[70vh]">
                <table className="w-full table-fixed border-collapse">
                    <colgroup>
                        <col className="w-[30%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                        <col className="w-[25%]" />
                    </colgroup>
                    <thead className="sticky top-0 z-10 bg-[#0441B1] text-white text-3xl shadow-md">
                        <tr>
                            <th className="p-8 text-left">Employee Name</th>
                            <th className="p-8 text-left">Date</th>
                            <th className="p-8 text-left">Time In</th>
                            <th className="p-8 text-left">Time Out</th>
                            <th className="p-8 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mergedEmployees.length > 0 ? (
                            mergedEmployees.map((emp: any) => (
                                <tr
                                    key={emp.id}
                                    className="border-b text-2xl hover:bg-gray-50 transition"
                                >
                                    <td className="p-8 font-semibold truncate">{emp.name}</td>
                                    <td className="p-8">{formatDate(new Date())}</td>
                                    <td className="p-8">{formatTime(emp.timeIn)}</td>
                                    <td className="p-8">{formatTime(emp.timeOut)}</td>
                                    <td className="p-8 text-center">
                                        {!emp.timeIn && !emp.timeOut ? (
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => timeInMutation.mutate(emp.id)}
                                                    disabled={timeInMutation.isPending}
                                                    className="p-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition w-[120px]"
                                                >
                                                    {timeInMutation.isPending ? "Saving..." : "Time In"}
                                                </button>
                                                <button
                                                    onClick={() => timeOutMutation.mutate(emp.id)}
                                                    disabled={timeOutMutation.isPending}
                                                    className="p-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition w-[150px]"
                                                >
                                                    {timeOutMutation.isPending
                                                        ? "Saving..."
                                                        : "Time Out Only"}
                                                </button>
                                            </div>
                                        ) : emp.timeIn && !emp.timeOut ? (
                                            <button
                                                onClick={() => timeOutMutation.mutate(emp.id)}
                                                disabled={timeOutMutation.isPending}
                                                className="p-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition w-full"
                                            >
                                                {timeOutMutation.isPending ? "Saving..." : "Time Out"}
                                            </button>
                                        ) : (
                                            <span className="text-gray-500 font-medium block w-full text-center">
                                                ✅ Completed
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-8 text-gray-500 text-center text-xl"
                                >
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
