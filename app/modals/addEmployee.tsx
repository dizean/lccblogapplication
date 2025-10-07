"use client";
import { hooks } from "@/hooks/hooks";
import { useState } from "react";
import { DEPARTMENTS, CLASSIFICATIONS, STATUSES } from "@/hooks/constants";

interface Employee {
  name: string;
  department: string;
  classification: string;
  status: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
}

export default function AddEmployeeModal({
  isOpen,
  onClose,
  initialName = "",
}: AddEmployeeModalProps) {
  const [data, setData] = useState<Employee>({
    name: initialName,
    department: "",
    classification: "",
    status: "",
  });

  const addEmployee = hooks.addEmployee();
  const { name, department, classification, status } = data;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEmployee.mutateAsync({
        name,
        department,
        classification,
        status,
      });
      setData({ name: "", department: "", classification: "", status: "" });
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="bg-white w-full max-w-3xl p-10 rounded-3xl shadow-2xl border border-gray-200 text-center animate-fadeIn">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-[#0441B1] mb-10 tracking-tight">
        Add New Employee
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8 text-left">
        {/* Full Name */}
        <div>
          <label className="block text-2xl text-gray-700 font-semibold mb-3">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
            placeholder="Enter employee full name"
            className="w-full px-8 py-5 text-2xl border border-gray-300 rounded-2xl focus:ring-4 focus:ring-[#0441B1]/40 outline-none transition-all"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-2xl text-gray-700 font-semibold mb-3">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setData({ ...data, department: e.target.value })}
            required
            className="w-full px-8 py-5 text-2xl border border-gray-300 rounded-2xl focus:ring-4 focus:ring-[#0441B1]/40 outline-none transition-all"
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Classification */}
        <div>
          <label className="block text-2xl text-gray-700 font-semibold mb-3">
            Classification
          </label>
          <select
            value={classification}
            onChange={(e) =>
              setData({ ...data, classification: e.target.value })
            }
            required
            className="w-full px-8 py-5 text-2xl border border-gray-300 rounded-2xl focus:ring-4 focus:ring-[#0441B1]/40 outline-none transition-all"
          >
            <option value="">Select Classification</option>
            {CLASSIFICATIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-2xl text-gray-700 font-semibold mb-3">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            required
            className="w-full px-8 py-5 text-2xl border border-gray-300 rounded-2xl focus:ring-4 focus:ring-[#0441B1]/40 outline-none transition-all"
          >
            <option value="">Select Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons (Submit Left, Cancel Right) */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-10">
          <button
            type="submit"
            className="w-full sm:w-1/2 px-12 py-6 text-2xl bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition-all shadow-md"
          >
            Save Employee
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 px-12 py-6 text-2xl bg-gray-400 text-white font-semibold rounded-2xl hover:bg-gray-500 transition-all shadow-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
