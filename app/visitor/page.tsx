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
         Visitor`s Log
        </h1>

        <Link
          href="/"
          className="w-full md:w-auto text-center px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all"
        >
          ← Back to Home
        </Link>
      </header>
       <main className="flex-1 w-full overflow-hidden">
        <div className="h-full w-full flex flex-col p-2 sm:p-4 md:p-6">
<div className="w-full flex flex-col gap-6">

        {/* FILTER BAR */}
        <div className="w-full flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search visitor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full xl:w-[40%] px-6 py-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1]"
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto justify-end">

            {/* DATE PICKER */}
            {!showAll && (
              <div className="w-full sm:w-auto">
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  className="w-full"
                />
              </div>
            )}

            <button
              onClick={() => setShowAll(!showAll)}
              className={`px-6 py-4 rounded-xl font-semibold transition shadow-md w-full sm:w-[180px]
                ${showAll
                  ? "bg-yellow-700 text-white hover:bg-yellow-600"
                  : "bg-yellow-500 text-white hover:bg-yellow-400"
                }`}
            >
              {showAll ? "Filter by Date" : "Show All"}
            </button>

            <button
              onClick={() => setShowLoginForm(true)}
              className="px-6 py-4 rounded-xl bg-[#0441B1] text-white font-semibold hover:bg-blue-900 transition shadow-md w-full sm:w-[180px]"
            >
              Check In
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl max-h-[70vh] border shadow-sm">

          {isLoading ? (
            <p className="text-center p-6 text-base">Loading logs...</p>
          ) : error ? (
            <p className="text-center p-6 text-red-600 text-base">
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
                      className="border-b hover:bg-gray-50 transition text-lg"
                    >
                      <td className="p-5 font-semibold">{log.name}</td>

                      <td className="p-5 text-left">{log.purpose}</td>

                      <td className="p-5 text-center">
                        {formatDate(log.date)}
                      </td>
                      <td className="p-5 text-center">
                        {formatTime(log.logged_in)} -
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
                    <td colSpan={6} className="py-10 text-center text-gray-500 text-lg">
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
      {/* CONTENT */}
      

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