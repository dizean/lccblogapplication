"use client";
import { useState } from "react";

interface VisitorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, purpose: string) => void;
}

export default function VisitorLoginModal({
  isOpen,
  onClose,
  onSubmit,
}: VisitorLoginModalProps) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl text-center animate-fadeIn">
      {/* Title */}
      <h2 className="text-4xl font-extrabold mb-8 text-[#0441B1] tracking-tight">
        Visitor Check In
      </h2>

      {/* Input Fields */}
      <div className="space-y-6">
        <input
          type="text"
          placeholder="Enter Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-8 py-5 text-2xl border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#0441B1]/40 transition-all"
        />
        <input
          type="text"
          placeholder="Enter Purpose of Visit"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full px-8 py-5 text-2xl border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#0441B1]/40 transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-6 mt-10">
        <button
          onClick={() => {
            if (!name.trim() || !purpose.trim()) {
              alert("Please fill out all fields.");
              return;
            }
            onSubmit(name, purpose);
            setName("");
            setPurpose("");
          }}
          className="w-full sm:w-1/2 px-12 py-6 bg-green-600 text-white text-2xl font-semibold rounded-2xl hover:bg-green-700 transition-all shadow-md"
        >
          Submit
        </button>

        <button
          onClick={onClose}
          className="w-full sm:w-1/2 px-12 py-6 bg-gray-500 text-white text-2xl font-semibold rounded-2xl hover:bg-gray-600 transition-all shadow-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
