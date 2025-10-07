"use client";

import { useState } from "react";
import { Employee } from "./page";

interface Props {
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  isAdding: boolean;
  setIsAdding: (val: boolean) => void;
}

export default function EmployeeForm({
  selectedEmployee,
  setSelectedEmployee,
  isAdding,
  setIsAdding,
}: Props) {
  const [formData, setFormData] = useState({
    name: selectedEmployee?.name || "",
    department: selectedEmployee?.department || "",
    classification: selectedEmployee?.classification || "",
    status: selectedEmployee?.status || "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.department || !formData.classification || !formData.status) {
      alert("Please complete all fields.");
      return;
    }

    if (isAdding) {
      alert(`✅ Employee ${formData.name} added successfully!`);
    } else {
      alert(`✏️ Employee ${formData.name} updated successfully!`);
    }

    setIsAdding(false);
    setSelectedEmployee(null);
  };

  // No selection, no adding
  if (!selectedEmployee && !isAdding) {
    return (
      <div className="text-center text-xl text-gray-600 space-y-4">
        <p>No employee selected</p>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#0441B1] text-white px-8 py-4 rounded-xl text-lg hover:bg-blue-700 transition font-semibold"
        >
          ➕ Add New Employee
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-[#0441B1] mb-8 text-center">
        {isAdding ? "➕ Add Employee" : "👤 Employee Details"}
      </h2>

      <div className="flex flex-col gap-5 text-left text-lg">
        {["name", "department", "classification", "status"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-medium mb-2 capitalize">
              {field}
            </label>
            <input
              type="text"
              value={(formData as any)[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg focus:ring-2 focus:ring-[#0441B1] focus:outline-none"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <button
          onClick={handleSubmit}
          className="bg-[#0441B1] text-white py-4 rounded-xl text-xl font-semibold hover:bg-blue-700 transition"
        >
          {isAdding ? "✅ Save Employee" : "💾 Update Employee"}
        </button>

        {!isAdding && (
          <button
            onClick={() => alert(`🗑 Deleted ${selectedEmployee?.name}`)}
            className="bg-red-500 text-white py-4 rounded-xl text-xl font-semibold hover:bg-red-600 transition"
          >
            🗑 Delete Employee
          </button>
        )}

        <button
          onClick={() => {
            setSelectedEmployee(null);
            setIsAdding(false);
          }}
          className="text-gray-500 hover:text-gray-700 underline text-lg mt-4"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
