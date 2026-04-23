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
  const [actionType, setActionType] =
    useState<"borrow" | "return" | null>(null);

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

  const filteredKeys = mergedKeys.filter((key: any) =>
    key.room?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (keyId: number, employeeId: number) => {
    if (actionType === "borrow") {
      borrowMutation.mutate({ keyId, employeeId });
    } else if (actionType === "return") {
      returnMutation.mutate({ keyId, employeeId });
    }

    setActionType(null);
    setSelectedKeyId(null);
  };

  return (
    <div className="w-full flex flex-col gap-6">

      {/* SEARCH + ACTIONS */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">

        <input
          type="text"
          placeholder="Search room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full xl:w-[45%] px-6 py-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1]"
        />

        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">

          <button
            onClick={onAddKey}
            className="px-6 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-md w-full sm:w-[180px]"
          >
            + Add Room
          </button>

          <button
            onClick={onShowLogs}
            className="px-6 py-4 bg-[#0441B1] text-white font-semibold rounded-xl hover:bg-blue-900 transition shadow-md w-full sm:w-[180px]"
          >
            View Logs
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border shadow-sm max-h-[70vh]">

        <table className="w-full border-collapse">

          <thead className="sticky top-0 bg-[#0441B1] text-white text-xl z-10">
            <tr>
              <th className="p-5 text-left">Room</th>
              <th className="p-5 text-left">Date</th>
              <th className="p-5 text-left">Borrowed By</th>
              <th className="p-5 text-left">Time Borrowed</th>
              <th className="p-5 text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredKeys.length > 0 ? (
              filteredKeys.map((key: any) => (
                <tr
                  key={key.id}
                  className="border-b hover:bg-gray-50 transition text-lg"
                >
                  <td className="p-5 font-semibold">{key.room}</td>

                  <td className="p-5">
                    {key.logDate
                      ? formatDate(key.logDate)
                      : formatDate(new Date())}
                  </td>

                  <td className="p-5">
                    {key.borrowedByName || "----"}
                  </td>

                  <td className="p-5">
                    {key.timeBorrowed
                      ? formatTime(key.timeBorrowed)
                      : "----"}
                  </td>

                  <td className="p-5 text-center">

                    {!key.borrowedByName ? (
                      <button
                        onClick={() => {
                          setSelectedKeyId(key.id);
                          setActionType("borrow");
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-[120px]"
                      >
                        Borrow
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedKeyId(key.id);
                          setActionType("return");
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-[120px]"
                      >
                        Return
                      </button>
                    )}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  No rooms found
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {actionType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

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
  );
};