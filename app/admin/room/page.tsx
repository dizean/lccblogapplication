"use client";

import { useState } from "react";
import RoomList from "./RoomList";
import RoomForm from "./RoomForm";

export interface Room {
  id: number;
  room: string;
  location: string;
  status: string;
  active: boolean;
}

export default function RoomPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const rooms: Room[] = [
    { id: 1, room: "Conference Room A", location: "Building 1", status: "Available", active: true },
    { id: 2, room: "Server Room", location: "Building 2", status: "In Use", active: false },
    { id: 3, room: "Storage Room", location: "Building 3", status: "Available", active: true },
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* LEFT SIDE — ROOM LIST */}
      <div className="w-[70%] border-r border-gray-300">
        <RoomList
          roomsData={rooms}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          setIsAdding={setIsAdding}
        />
      </div>

      {/* RIGHT SIDE — FORM / VIEW */}
      <div className="w-[30%] p-8 bg-white shadow-inner flex flex-col justify-center items-center">
        <RoomForm
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />
      </div>
    </div>
  );
}
