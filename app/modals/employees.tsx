import React, { useState } from "react";
import { hooks } from "@/hooks/hooks";

interface EmployeesListProps {
  onSelect: (employeeId: number) => void;
  onClose?: () => void;
}

const EmployeesList: React.FC<EmployeesListProps> = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: employees = [] } = hooks.fetchEmployees();

  const filteredEmployees = employees.filter((emp: any) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-7xl relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
        >
          ✕
        </button>
      )}
      <h2 className="text-2xl font-extrabold text-[#0441B1] mb-4 text-center">
        Select Employee
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] text-lg"
        />
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0441B1] text-white text-lg">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp: any) => (
                <tr
                  key={emp.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-lg font-semibold">{emp.name}</td>
                  <td className="p-4 text-lg">{emp.type}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onSelect(emp.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesList;
