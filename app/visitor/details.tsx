import React from "react";

interface VisitLog {
  name: string;
  purpose: string;
  date: string;
  logged_in: string;
  logged_out?: string | null;
  id_type: string;
  img_path?: string | null;
}

interface Props {
  selectedLog: VisitLog | null;
  setSelectedLog: (log: VisitLog | null) => void;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
  apiUrl: string;
}

export default function VisitDetailsModal({
  selectedLog,
  setSelectedLog,
  formatDate,
  formatTime,
  apiUrl,
}: Props) {
  if (!selectedLog) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={() => setSelectedLog(null)}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#0441B1] mb-4">
          Visit Details
        </h2>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div>
            <p className="font-semibold">Name</p>
            <p>{selectedLog.name}</p>
          </div>

          <div>
            <p className="font-semibold">Purpose</p>
            <p>{selectedLog.purpose}</p>
          </div>

          <div>
            <p className="font-semibold">Date</p>
            <p>{formatDate(selectedLog.date)}</p>
          </div>

          <div>
            <p className="font-semibold">Time In</p>
            <p>{formatTime(selectedLog.logged_in)}</p>
          </div>

          <div>
            <p className="font-semibold">Time Out</p>
            <p>
              {selectedLog.logged_out
                ? formatTime(selectedLog.logged_out)
                : "Still inside"}
            </p>
          </div>

          <div>
            <p className="font-semibold">ID Type</p>
            <p>{selectedLog.id_type}</p>
          </div>
        </div>

        {/* Image */}
        <div className="mt-6">
          <p className="font-semibold mb-2">Captured Image</p>

          {selectedLog.img_path ? (
            <img
              src={`${apiUrl}/uploads/${selectedLog.img_path}`}
              className="w-full max-h-[400px] object-cover rounded-xl border"
              alt="visitor"
            />
          ) : (
            <p className="text-gray-500">No image available</p>
          )}
        </div>
      </div>
    </div>
  );
}