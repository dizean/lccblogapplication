"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import service from "@/services/services";
import DatePicker from "./component/DatePicker";

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCard, setLoadingCard] = useState<string | null>(null);

  async function downloadExcel(type: "today" | "all" | "range") {
    const sheetNames = ["Employees", "Keys", "Visitors"];

    try {
      setLoading(true);

      let results: any[] = [];

      if (type === "today") {
        results = await Promise.all([
          service.fetchEmployeesToday(),
          service.fetchKeysToday(),
          service.fetchVisitorsToday(),
        ]);
      } else if (type === "all") {
        results = await Promise.all([
          service.fetchEmployeesAll(),
          service.fetchKeysAll(),
          service.fetchVisitorsAll(),
        ]);
      } else {
        if (!startDate || !endDate) {
          alert("Select start and end dates.");
          return;
        }

        if (startDate > endDate) {
          alert("Invalid date range.");
          return;
        }

        results = await Promise.all([
          service.fetchEmployeesRange(startDate, endDate),
          service.fetchKeysRange(startDate, endDate),
          service.fetchVisitorsRange(startDate, endDate),
        ]);
      }

      const workbook = XLSX.utils.book_new();

      results.forEach((data, index) => {
        const worksheet = XLSX.utils.json_to_sheet(data || []);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[index]);
      });

      const wbout = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const filename =
        type === "today"
          ? "Today_Logs.xlsx"
          : type === "all"
            ? "All_Logs.xlsx"
            : `Logs_${startDate}_to_${endDate}.xlsx`;

      saveAs(new Blob([wbout]), filename);
    } catch (err) {
      console.error(err);
      alert("Export failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* DARK OVERLAY */}
      <div className="min-h-screen w-full flex flex-col bg-black/20 backdrop-blur-[2px]">

        {/* HEADER */}
        <header className="w-full flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 bg-white/90 backdrop-blur shadow-md">
          <img
            src="/lcc header.webp"
            alt="LCCB Logo"
            className="h-12 sm:h-14 md:h-16 w-auto"
          />
        </header>

        {/* MAIN */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">

          <div className="w-full max-w-6xl flex flex-col items-center gap-12">

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">

              {[
                { title: "Employees DTR", desc: "Time records", href: "/employee" },
                { title: "Keys Log", desc: "Key tracking", href: "/key" },
                { title: "Visitors Log", desc: "Visitor monitoring", href: "/visitor" },
              ].map((item, i) => (
                <div key={i} className="w-full flex justify-center">

                  <Link
                    href={item.href}
                    onClick={() => setLoadingCard(item.href)}
                    className="w-full max-w-md"
                  >

                    <div className="relative h-80 bg-white/95 rounded-2xl shadow-lg border-l-4 border-blue-600 p-8 flex flex-col justify-between hover:scale-[1.03] transition">

                      {/* LOADER */}
                      {loadingCard === item.href && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
                          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      <div>
                        <h2 className="text-3xl font-bold text-blue-700">
                          {item.title}
                        </h2>
                        <p className="text-gray-500 mt-3 text-lg">
                          {item.desc}
                        </p>
                      </div>

                      <div className="text-blue-600 font-semibold text-lg">
                        Open →
                      </div>

                    </div>

                  </Link>

                </div>
              ))}

            </div>

            {/* EXPORT PANEL */}
            <div className="w-full max-w-4xl bg-white/95 rounded-2xl shadow-lg p-6">

              <h2 className="text-xl font-semibold mb-5 text-gray-800">
                Export Logs
              </h2>

              {/* DATE PICKERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="text-xs text-gray-500">Start Date</label>
                  <DatePicker value={new Date().toISOString().split("T")[0]} onChange={setStartDate} />
                </div>

                <div>
                  <label className="text-xs text-gray-500">End Date</label>
                  <DatePicker value={new Date().toISOString().split("T")[0]} onChange={setEndDate} />
                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 mt-5">

                <button
                  onClick={() => downloadExcel("range")}
                  disabled={loading}
                  className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 w-full"
                >
                  Export Range
                </button>

                <button
                  onClick={() => downloadExcel("today")}
                  disabled={loading}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 w-full"
                >
                  Today Logs
                </button>

                <button
                  onClick={() => downloadExcel("all")}
                  disabled={loading}
                  className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 w-full"
                >
                  All Logs
                </button>

              </div>

            </div>

          </div>

        </main>

        {/* FOOTER */}
        <footer className="text-center text-sm text-gray-700 py-4 bg-white/90 backdrop-blur border-t">
          © {new Date().getFullYear()} La Consolacion College Bacolod
        </footer>

      </div>
    </div>
  );
}