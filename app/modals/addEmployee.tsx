"use client";

import { hooks } from "@/hooks/hooks";
import { useState } from "react";
import { CLASSIFICATIONS, STATUSES } from "@/hooks/constants";

interface Employee {
  name: string;
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
    classification: "",
    status: "",
  });

  const addEmployee = hooks.addEmployee();
  const { name, classification, status } = data;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEmployee.mutateAsync({
        name,
        classification,
        status,
      });

      setData({ name: "", classification: "", status: "" });
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">

      {/* TITLE */}
      <h2 className="text-2xl font-semibold text-[#0441B1] mb-6">
        Add New Employee
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NAME */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
            placeholder="Enter employee name"
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
          />
        </div>

        {/* CLASSIFICATION */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Classification
          </label>
          <select
            value={classification}
            onChange={(e) =>
              setData({ ...data, classification: e.target.value })
            }
            required
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
          >
            <option value="">Select classification</option>
            {CLASSIFICATIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            required
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
          >
            <option value="">Select status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-3">

          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 px-4 py-3 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Save
          </button>

        </div>

      </form>
    </div>
  );
}