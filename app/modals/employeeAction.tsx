  "use client";
  import React from "react";

  interface EmployeeActionModalProps {
    isOpen: boolean;
    employee: any | null;
    onClose: () => void;
    ontimeIn: (id: number) => void;
    ontimeOutOnly: (id: number) => void;
  }

  export default function EmployeeActionModal({
    isOpen,
    employee,
    onClose,
    ontimeIn,
    ontimeOutOnly,
  }: EmployeeActionModalProps) {
    if (!isOpen || !employee) return null;

    return (
        <div className="bg-white w-full max-w-2xl p-2 rounded-2xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0441B1] mb-6 text-center">
            {employee.name} – Choose Action
          </h2>
          <div className="flex flex-col gap-6">
            <button
              onClick={() => {
                ontimeIn(employee.id);
                onClose();
              }}
              className="px-4 py-2 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 transition"
            >
              Time In
            </button>
            <button
              onClick={() => {
                ontimeOutOnly(employee.id);
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white text-xl font-bold rounded-lg hover:bg-red-700 transition"
            >
              Time Out Only
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 bg-gray-400 text-white text-xl font-bold rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
    );
  }
