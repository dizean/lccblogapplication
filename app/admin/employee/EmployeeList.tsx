"use client";

import { useState } from "react";
import { Employee } from "./page";

interface Props {
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  setIsAdding: (val: boolean) => void;
}

export default function EmployeeList({
  employees,
  selectedEmployee,
  setSelectedEmployee,
  setIsAdding,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.classification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full text-[1.1rem]">
      <div className="p-8 border-b border-gray-300 bg-white sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-[#0441B1] mb-6 tracking-wide">
          👥 Employees
        </h1>

        <input
          type="text"
          placeholder="🔍 Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#0441B1] transition"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        {filteredEmployees.length > 0 ? (
          <ul className="space-y-4">
            {filteredEmployees.map((emp) => (
              <li
                key={emp.id}
                onClick={() => {
                  setSelectedEmployee(emp);
                  setIsAdding(false);
                }}
                className={`p-6 rounded-xl cursor-pointer border-2 transition-all ${
                  selectedEmployee?.id === emp.id
                    ? "border-[#0441B1] bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:bg-gray-100"
                }`}
              >
                <p className="font-semibold text-2xl text-gray-800">
                  {emp.name}
                </p>
                <p className="text-lg text-gray-600">{emp.department}</p>
                <p className="text-lg text-gray-600">{emp.classification}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center text-xl py-10">
            No employees found for “{searchTerm}”
          </p>
        )}
      </div>
    </div>
  );
}
