"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate, formatTime } from "@/hooks/formatDateTime";
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

  const { data: logs = [], isLoading, error } = hooks.visitors();
  const visitorLogin = hooks.visitorLogin();
  const visitorLogout = hooks.visitorLogout();

  const handleLogin = async (name: string, purpose: string) => {
    visitorLogin.mutate(
      { name, purpose },
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

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* HEADER */}
      <header className="w-full flex flex-col md:flex-row justify-between items-center gap-4 px-4 sm:px-6 md:px-10 py-4 bg-white shadow-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0441B1] text-center md:text-left">
          Visitor’s Log
        </h1>

        <Link
          href="/"
          className="w-full md:w-auto text-center px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all"
        >
          ← Back to Home
        </Link>
      </header>

      {/* CONTENT */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="h-full w-full flex flex-col p-2 sm:p-4 md:p-6 bg-white">

          {/* SEARCH + FILTERS */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 w-full">

            <input
              type="text"
              placeholder="Search visitor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0441B1] outline-none"
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

              {!showAll && (
                <DatePicker value={selectedDate} onChange={setSelectedDate} />
              )}

              <button
                onClick={() => setShowAll(!showAll)}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition ${showAll
                    ? "bg-gray-500 text-white"
                    : "bg-[#0441B1] text-white"
                  }`}
              >
                {showAll ? "Filter by Date" : "Show All"}
              </button>

              <button
                onClick={() => setShowLoginForm(true)}
                className="px-5 py-3 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
              >
                Check In
              </button>

            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-auto flex-grow rounded-xl border border-gray-200 max-h-[70vh]">

            {isLoading ? (
              <p className="text-center p-6 text-base">Loading logs...</p>
            ) : error ? (
              <p className="text-center p-6 text-red-600 text-base">
                Failed to load logs
              </p>
            ) : (
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
                        className="border-b text-2xl hover:bg-gray-50 transition"
                      >
                        <td className="p-8 font-semibold">{log.name}</td>

                        <td className="p-8 text-center">{log.purpose}</td>

                        <td className="p-8 text-center">
                          {formatDate(log.date)}
                        </td>
                        <td className="p-4 text-center">
                          {formatTime(log.logged_in)} -
                          {log.logged_out
                            ? formatTime(log.logged_out)
                            : "----"}
                        </td>

                        <td className="p-4 text-center">
                          {log.logged_out ? (
                            <span className="text-green-600 font-semibold">
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={() => handleLogout(log.id)}
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
                      <td colSpan={6} className="text-center p-6 text-gray-500">
                        No visitor logs found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            )}
          </div>
        </div>
      </main>

      {/* MODAL */}
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
    </div>
  );
}