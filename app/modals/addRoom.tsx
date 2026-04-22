"use client";
import { hooks } from "@/hooks/hooks";
import { useState } from "react";

interface Key {
  name: string;
  location: string;
  status: string;
}

interface AddKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
}

const STATUSES = ["Available", "Unavailable"];

export default function AddKeyModal({
  isOpen,
  onClose,
  initialName = "",
}: AddKeyModalProps) {
  const [data, setData] = useState<Key>({
    name: initialName,
    location: "",
    status: "",
  });

  const addKey = hooks.addKey();
  const { name, location, status } = data;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addKey.mutateAsync({ name, location, status });
      setData({ name: "", location: "", status: "" });
      onClose();
    } catch (error) {
      console.error("Error adding key:", error);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">

      {/* TITLE */}
      <h2 className="text-2xl font-semibold text-[#0441B1] mb-6">
        Add New Key
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* KEY NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Key Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
            placeholder="Room 203 Key"
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
          />
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            required
            placeholder="Building A, Room 203"
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
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
        <div className="flex gap-3 pt-4">

          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 px-4 py-3 text-sm bg-[#0441B1] text-white rounded-lg hover:bg-blue-900 transition"
          >
            Save Key
          </button>

        </div>

      </form>
    </div>
  );
}