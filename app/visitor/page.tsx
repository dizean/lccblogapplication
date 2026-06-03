"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, formatDateTime, formatTime } from "@/hooks/formatDateTime";
import VisitorLoginModal from "../modals/visitorLogin";
import { hooks } from "@/hooks/hooks";
import DatePicker from "../component/DatePicker";

export default function VisitorPage() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showAll, setShowAll] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showPolicy, setShowPolicy] = useState(false);
  const { data: logs = [], isLoading, error } = hooks.visitors();
  const visitorLogin = hooks.visitorLogin();
  const visitorLogout = hooks.visitorLogout();
  const handleLogin = async (
    name: string,
    purpose: string,
    gate: string,
    id: string,
    image: string,
    descriptor: string,
    mode: "EXISTING" | "NEW"
  ) => {
    visitorLogin.mutate(
      { name, purpose, gate, id, image, descriptor, mode },
      { onSuccess: () => setShowLoginForm(false) }
    );
  };

  const handleLogout = async (id: number) => {
    visitorLogout.mutate(id);
  };

  const filteredLogs = logs.filter((log: any) => {
    const matchesName = log.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDate = showAll
      ? true
      : selectedDate
        ? new Date(log.date).toLocaleDateString("en-CA") === selectedDate
        : true;

    return matchesName && matchesDate;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const savedGate = localStorage.getItem("selectedGate");
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const { date: formattedDate, time: formattedTime } = formatDateTime(currentTime);
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">

      <header className="w-full bg-white shadow-md px-4 sm:px-6 md:px-10 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0441B1] text-center md:text-left">
            Visitor Logs
          </h1>

          <div className="flex flex-col items-center text-center gap-1">
            {savedGate && (
              <div className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                <span className="text-[#0441B1]">{savedGate}</span>
              </div>
            )}
            <div className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
              {formattedDate}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0441B1]">
              {formattedTime}
            </div>
          </div>

          <Link
            href="/"
            className="w-full md:w-auto text-center px-6 py-3 sm:px-7 sm:py-3 text-sm sm:text-lg bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all shadow-md"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full overflow-hidden">
        <div className="h-full w-full flex flex-col p-2 sm:p-4 md:p-6">
          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
              <input
                type="text"
                placeholder="Search visitor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:flex-1 px-6 py-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1]"
              />
              <div className="flex flex-col sm:flex-row lg:flex-row gap-4 w-full lg:w-auto">
                {!showAll && (
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    className="w-full sm:w-[200px]"
                  />
                )}
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={`w-full sm:w-[200px] px-6 py-4 rounded-xl font-semibold transition shadow-md
                  ${showAll ? "bg-yellow-700 text-white hover:bg-yellow-600" : "bg-yellow-500 text-white hover:bg-yellow-400"}
                  `}>
                  {showAll ? "Filter by Date" : "Show All"}
                </button>
                <button
                  onClick={() => setShowPolicy(true)}
                  className="w-full sm:w-[200px] px-6 py-4 rounded-xl bg-[#0441B1] text-white font-semibold hover:bg-blue-900 transition shadow-md"
                >
                  Check In
                </button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl max-h-[70vh] border shadow-sm">

              {isLoading ? (
                <p className="text-center p-6">Loading logs...</p>
              ) : error ? (
                <p className="text-center p-6 text-red-600">
                  Failed to load logs
                </p>
              ) : (
                <table className="w-full border-collapse">

                  <thead className="sticky top-0 bg-[#0441B1] text-white text-xl z-10">
                    <tr>
                      <th className="p-8 text-left">Name</th>
                      <th className="p-8 text-left">Purpose</th>
                      <th className="p-8 text-center">Date</th>
                      <th className="p-8 text-center">Time In - Time Out</th>
                      <th className="p-8 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log: any, index: number) => (
                        <tr
                          key={index}
                          onClick={() => setSelectedLog(log)}
                          className="border-b hover:bg-gray-50 transition text-lg cursor-pointer"
                        >
                          <td className="p-5 font-semibold">{log.name}</td>
                          <td className="p-5">{log.purpose}</td>
                          <td className="p-5 text-center">
                            {formatDate(log.date)}
                          </td>
                          <td className="p-5 text-center">
                            {formatTime(log.logged_in)} -{" "}
                            {log.logged_out
                              ? formatTime(log.logged_out)
                              : "----"}
                          </td>

                          <td className="p-5 text-center">

                            {log.logged_out ? (
                              <span className="text-green-600 font-semibold">
                                Completed
                              </span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLogout(log.id);
                                }}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                              >
                                Log Out
                              </button>
                            )}

                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-gray-500 text-lg"
                        >
                          No visitor logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              )}
            </div>
          </div>
        </div>
      </main>
      {showPolicy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8">

            <h1 className="text-xl md:text-2xl font-bold text-[#0441B1] text-center mb-4">
              Visitor Data Privacy Notice
            </h1>

            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
              This system captures facial images and biometric descriptors for security,
              identity verification, and visitor logging purposes.
            </p>

            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
              Data may be used for monitoring, auditing, and security investigations if required.
              All data is stored securely and is not shared with unauthorized parties.
            </p>

            <p className="text-sm md:text-base font-semibold text-red-600 mb-6">
              By continuing, you consent to the capture and processing of your facial data.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                onClick={() => {
                  setShowPolicy(false);
                  setShowLoginForm(true);
                }}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                I Agree & Continue
              </button>

              <button
                onClick={() => setShowPolicy(false)}
                className="w-full bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg">
            <VisitorLoginModal
              isOpen={showLoginForm}
              onClose={() => setShowLoginForm(false)}
              onSubmit={handleLogin}
            />
          </div>
        </div>
      )}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-[#0441B1] mb-4">
              Visit Details
            </h2>
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
            <div className="mt-6">
              <p className="font-semibold mb-2">Captured Image</p>
              {selectedLog.img_path ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${selectedLog.img_path}`}
                  className="w-full max-h-[400px] object-cover rounded-xl border"
                  alt="visitor"
                />
              ) : (
                <p className="text-gray-500">No image available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}