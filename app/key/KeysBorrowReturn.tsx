"use client";

import { formatDate, formatTime } from "@/hooks/formatDateTime";
import { hooks } from "@/hooks/hooks";
import { useState } from "react";
import EmployeesList from "../modals/employees";

interface KeysBorrowReturnProps {
  onShowLogs: () => void;
  onAddKey: () => void;
}

export const KeysBorrowReturn = ({
  onShowLogs,
  onAddKey,
}: KeysBorrowReturnProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"borrow" | "return" | null>(null);
  const { data: keys = [] } = hooks.fetchKeys();
  const { data: keysLog = [] } = hooks.fetchKeysLog();
  const borrowMutation = hooks.borrowKey();
  const returnMutation = hooks.returnKey();

  const mergedKeys = keys.map((key: any) => {
    const activeLog = keysLog.find(
      (log: any) => log.key_id === key.id && !log.returned_by_name
    );
    return {
      ...key,
      borrowedByName: activeLog?.borrowed_by_name || null,
      timeBorrowed: activeLog?.time_borrowed || null,
      returnedByName: activeLog?.returned_by_name || null,
      timeReturned: activeLog?.time_returned || null,
      logDate: activeLog?.date || null,
    };
  });

  const handleAction = (keyId: number, employeeId: number) => {
    console.log("Handling action:", { keyId, employeeId, actionType });
    if (actionType === "borrow") borrowMutation.mutate({ keyId, employeeId });
    else if (actionType === "return") returnMutation.mutate({ keyId, employeeId });
    setActionType(null);
    setSelectedKeyId(null);
  };

  return (
    <>
      {/* Search Bar & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 w-full">
        <input
          type="text"
          placeholder="Search room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-10 py-5 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] transition-all"
        />

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-end">
          <button
            onClick={onAddKey}
            className="w-full sm:w-[230px] px-10 py-5 bg-green-600 text-white font-semibold text-lg rounded-xl hover:bg-green-700 transition-all shadow-md"
          >
            + Add Room
          </button>

          <button
            onClick={onShowLogs}
            className="w-full sm:w-[210px] px-8 py-5 text-xl bg-[#0441B1] text-white font-semibold rounded-xl hover:bg-blue-900 transition-all shadow-md"
          >
            View Logs
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto flex-grow rounded-xl max-h-[70vh]">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[25%]" />
            <col className="w-[20%]" />
            <col className="w-[25%]" />
          </colgroup>

          <thead className="sticky top-0 z-10 bg-[#0441B1] text-white text-3xl shadow-md">
            <tr>
              <th className="p-8 text-left">Room</th>
              <th className="p-8 text-left">Date</th>
              <th className="p-8 text-left">Borrowed By</th>
              <th className="p-8 text-left">Time Borrowed</th>
              <th className="p-8 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {mergedKeys.length > 0 ? (
              mergedKeys
                .filter((key: any) =>
                  key.room.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((key: any) => (
                  <tr
                    key={key.id}
                    className="border-b text-2xl hover:bg-gray-50 transition"
                  >
                    <td className="p-8 font-semibold">{key.room}</td>
                    <td className="p-8">
                      {key.logDate ? formatDate(key.logDate) : formatDate(new Date())}
                    </td>
                    <td className="p-8">{key.borrowedByName || "----"}</td>
                    <td className="p-8">
                      {key.timeBorrowed ? formatTime(key.timeBorrowed) : "----"}
                    </td>
                    <td className="p-8 ">
                      {!key.borrowedByName ? (
                        <button
                          onClick={() => {
                            setSelectedKeyId(key.id);
                            setActionType("borrow");
                          }}
                          className="p-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition w-full"
                        >
                          Borrow
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedKeyId(key.id);
                            setActionType("return");
                          }}
                          className="p-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition w-full"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 text-lg">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {actionType && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-5xl">
              <EmployeesList
                onSelect={(employeeId) => {
                  if (selectedKeyId) {
                    handleAction(selectedKeyId, employeeId);
                  }
                }}
                onClose={() => {
                  setActionType(null);
                  setSelectedKeyId(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
