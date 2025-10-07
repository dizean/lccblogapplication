"use client";
import { useState } from "react";
import Link from "next/link";
import { formatDate, formatTime } from "@/hooks/formatDateTime";
import VisitorLoginModal from "../modals/visitorLogin";
import { hooks } from "@/hooks/hooks";

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
    visitorLogin.mutate({ name, purpose }, { onSuccess: () => setShowLoginForm(false) });
  };

  const handleLogout = async (id: number) => {
    visitorLogout.mutate(id);
  };

  const filteredLogs = logs.filter((log: any) => {
    const matchesName = log.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = showAll
      ? true
      : selectedDate
        ? new Date(log.date).toLocaleDateString("en-CA") === selectedDate
        : true;
    return matchesName && matchesDate;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow p-2 md:px-10">
        <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 flex flex-col h-full">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0441B1] tracking-tight text-center md:text-left">
              Visitor’s Log
            </h1>
            <Link
              href="/"
              className="px-10 py-5 text-xl bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-900 transition-all shadow-md"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 w-full">
            {/* Search Input */}
            <input
              type="text"
              placeholder="🔍 Search visitor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-10 py-5 text-xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] transition-all"
            />

            {/* Buttons & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-end">
              {!showAll && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-6 py-5 text-xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] transition-all"
                />
              )}

              <button
                onClick={() => setShowAll(!showAll)}
                className={`px-10 py-5 text-xl font-semibold rounded-xl shadow-md transition-all ${showAll
                    ? "bg-gray-500 text-white hover:bg-gray-600"
                    : "bg-[#0441B1] text-white hover:bg-blue-900"
                  }`}
              >
                {showAll ? "Filter by Date" : "Show All"}
              </button>

              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full sm:w-[220px] md:w-[260px] lg:w-[320px] px-10 py-6 text-2xl bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg"
              >
                Check In
              </button>

            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto overflow-y-auto flex-grow rounded-xl max-h-[70vh]">
            {isLoading ? (
              <p className="text-center py-8 text-xl">Loading logs...</p>
            ) : error ? (
              <p className="text-center py-8 text-xl text-red-600">Failed to load logs</p>
            ) : (
              <table className="w-full table-fixed border-collapse">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[25%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[10%]" />
                </colgroup>

                <thead className="sticky top-0 z-10 bg-[#0441B1] text-white text-3xl shadow-md">
                  <tr>
                    <th className="p-8 text-left">Name</th>
                    <th className="p-8 text-center">Purpose</th>
                    <th className="p-8 text-center">Date</th>
                    <th className="p-8 text-center">Time In</th>
                    <th className="p-8 text-center">Time Out</th>
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
                        <td className="p-8 font-semibold truncate">{log.name}</td>
                        <td className="p-8 text-center">{log.purpose}</td>
                        <td className="p-8 text-center">{formatDate(log.date)}</td>
                        <td className="p-8 text-center">{formatTime(log.logged_in)}</td>
                        <td className="p-8 text-center">
                          {log.logged_out ? formatTime(log.logged_out) : "----"}
                        </td>
                        <td className="p-8 text-center">
                          {log.logged_out ? (
                            <span className="text-green-600 font-bold">Completed</span>
                          ) : (
                            <button
                              onClick={() => handleLogout(log.id)}
                              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md text-lg font-semibold"
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
                        colSpan={6}
                        className="py-8 text-gray-500 text-center text-xl"
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
      </main>

      {/* Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <VisitorLoginModal
            isOpen={showLoginForm}
            onClose={() => setShowLoginForm(false)}
            onSubmit={handleLogin}
          />
        </div>
      )}
    </div>
  );
}
