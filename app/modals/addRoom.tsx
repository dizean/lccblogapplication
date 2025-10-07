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
      await addKey.mutateAsync({
        name,
        location,
        status,
      });

      setData({ name: "", location: "", status: "" });
      onClose();
    } catch (error) {
      console.error("Error adding key:", error);
    }
  };

  return (
    <div className="bg-white w-full max-w-3xl p-10 rounded-3xl shadow-2xl border border-gray-200 text-center animate-fadeIn">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-[#0441B1] mb-10 tracking-tight">
        Add New Key
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 text-left">
        {/* Key Name */}
        <div>
          <label className="block text-2xl text-gray-700 font-semibold mb-3">
            Key Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
            placeholder="Enter key name (e.g., Room 203 Key)"
            className="w-full px-8 py-5 text-2xl border border-gray-300 rounded-2xl focus:ring-4 focus:ring-[#0441B1]/40 outline-none transition-all"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-2xl text-gray-700 font-semibold mb-3">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            required
            placeholder="Enter location (e.g., Building A, Room 203)"
            className="w-full px-8 py-5 text-2xl border border-gray-300 rounded-2xl focus:ring-4 focus:ring-[#0441B1]/40 outline-none transition-all"
          />
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
            Save Key
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
