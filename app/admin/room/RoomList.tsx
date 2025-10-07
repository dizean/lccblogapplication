"use client";

import { useState } from "react";
import { Room } from "./page";

interface Props {
  roomsData: Room[];
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  setIsAdding: (val: boolean) => void;
}

export default function RoomList({
  roomsData,
  selectedRoom,
  setSelectedRoom,
  setIsAdding,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRooms = roomsData.filter(
    (r) =>
      r.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 overflow-y-auto h-full">
      <h1 className="text-3xl font-bold text-[#0441B1] mb-6">Rooms</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search rooms..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full text-lg border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-[#0441B1]"
      />

      {/* Add Button */}
      <button
        onClick={() => {
          setIsAdding(true);
          setSelectedRoom(null);
        }}
        className="mb-6 w-full bg-[#0441B1] text-white text-lg py-3 rounded-lg hover:bg-[#03358F] transition"
      >
        + Add Room
      </button>

      {/* Room List */}
      <ul className="space-y-4">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((r) => (
            <li
              key={r.id}
              onClick={() => {
                setSelectedRoom(r);
                setIsAdding(false);
              }}
              className={`p-5 rounded-xl cursor-pointer border text-lg transition ${
                selectedRoom?.id === r.id
                  ? "border-[#0441B1] bg-blue-50"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
            >
              <p className="font-semibold text-xl">{r.room}</p>
              <p className="text-gray-600 text-base">{r.location}</p>
              <p
                className={`text-base ${
                  r.status.toLowerCase() === "available"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {r.status}
              </p>
              <p className="text-sm text-gray-500">
                {r.active ? "Active" : "Inactive"}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center py-10 text-lg">
            No rooms found for “{searchTerm}”
          </p>
        )}
      </ul>
    </div>
  );
}
