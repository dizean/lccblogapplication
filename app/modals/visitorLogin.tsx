"use client";

import { useState } from "react";

interface VisitorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, purpose: string, idType: string) => void;
}

export default function VisitorLoginModal({
  isOpen,
  onClose,
  onSubmit,
}: VisitorLoginModalProps) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [idType, setIdType] = useState("");
  const [otherId, setOtherId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim() || !purpose.trim() || !idType.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    if (idType === "Other ID" && !otherId.trim()) {
      alert("Please specify the ID type.");
      return;
    }

    const finalId = idType === "Other ID" ? otherId : idType;

    onSubmit(name, purpose, finalId);

    setName("");
    setPurpose("");
    setIdType("");
    setOtherId("");
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">

      {/* TITLE */}
      <h2 className="text-2xl sm:text-3xl font-bold text-[#0441B1] mb-6 text-center">
        Visitor Check-In
      </h2>

      {/* FORM */}
      <div className="space-y-4">

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
        />

        {/* PURPOSE */}
        <input
          type="text"
          placeholder="Purpose of Visit"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
        />

        {/* ID TYPE */}
        <select
          value={idType}
          onChange={(e) => {
            setIdType(e.target.value);
            if (e.target.value !== "Other ID") setOtherId("");
          }}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0441B1] outline-none"
        >
          <option value="">Select ID Type</option>
          <option value="Driver’s License">Driver’s License</option>
          <option value="Voter’s ID">Voter’s ID</option>
          <option value="National ID">National ID</option>
          <option value="Student ID">Student ID</option>
          <option value="Other ID">Other ID</option>
        </select>

        {/* OTHER ID */}
        {idType === "Other ID" && (
          <input
            type="text"
            placeholder="Specify ID Type"
            value={otherId}
            onChange={(e) => setOtherId(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
          />
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">

        <button
          onClick={handleSubmit}
          className="w-full sm:w-1/2 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
        >
          Submit
        </button>

        <button
          onClick={onClose}
          className="w-full sm:w-1/2 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}