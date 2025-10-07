"use client";

import { useState, useEffect } from "react";
import { Room } from "./page";

interface Props {
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  isAdding: boolean;
  setIsAdding: (val: boolean) => void;
}

export default function RoomForm({
  selectedRoom,
  setSelectedRoom,
  isAdding,
  setIsAdding,
}: Props) {
  const [formData, setFormData] = useState<Room>({
    id: 0,
    room: "",
    location: "",
    status: "",
    active: false,
  });

  // Update form when selecting a new room
  useEffect(() => {
    if (selectedRoom) setFormData(selectedRoom);
  }, [selectedRoom]);

  // If nothing selected and not adding
  if (!isAdding && !selectedRoom) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-500 mb-4">No room selected</p>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#0441B1] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#03358F] transition"
        >
          + Add New Room
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-semibold text-[#0441B1] mb-6 text-center">
        {isAdding ? "Add New Room" : "Room Details"}
      </h2>

      <form className="space-y-6">
        {/* Room Name */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">Room</label>
          <input
            type="text"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            placeholder="Enter room name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[#0441B1]"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter location"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[#0441B1]"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[#0441B1]"
          >
            <option value="">Select status</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>

        {/* Active */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-5 h-5 accent-[#0441B1]"
          />
          <label className="text-lg text-gray-700 font-medium">Active</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-6">
          {isAdding ? (
            <button
              type="button"
              onClick={() => alert(`Added room: ${formData.room}`)}
              className="bg-[#0441B1] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#03358F] transition"
            >
              ✅ Add Room
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => alert(`Updated: ${formData.room}`)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition"
              >
                ✏️ Update
              </button>
              <button
                type="button"
                onClick={() => alert(`Deleted: ${formData.room}`)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-700 transition"
              >
                🗑 Delete
              </button>
            </>
          )}
        </div>

        {/* Back / Cancel */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setSelectedRoom(null);
            }}
            className="text-gray-500 hover:text-gray-700 underline text-lg"
          >
            ← Back
          </button>
        </div>
      </form>
    </div>
  );
}
