"use client";

import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function downloadExcel(type: "today" | "all") {
    const apis =
      type === "today"
        ? [
          `${API}/employeesLog/todayLogs`,
          `${API}/keysLog/todayLogs`,
          `${API}/visitors/todayLogs`,
        ]
        : [
          `${API}/employeesLog/allLogs`,
          `${API}/keysLog/allLogs`,
          `${API}/visitors/allLogs`,
        ];

    const sheetNames = ["Employees", "Keys", "Visitors"];

    try {
      const results = await Promise.all(
        apis.map(async (url) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
          return await res.json();
        })
      );

      const workbook = XLSX.utils.book_new();

      results.forEach((data, index) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[index]);
      });

      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const fileName =
        type === "today" ? "LCCB_Today_Logs.xlsx" : "LCCB_All_Logs.xlsx";

      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        fileName
      );
    } catch (error) {
      console.error("❌ Error exporting data:", error);
      alert("Failed to download Excel. Please try again.");
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* 🔷 Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 sm:px-8 md:px-12 py-4 shadow-md gap-4">
        <img
          src="/lcc header.webp"
          alt="LCCB Logo"
          className="h-12 sm:h-16 md:h-20 w-auto"
        />
      </div>
      
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl items-stretch">
          {[
            {
              title: "Employees DTR",
              desc: "For employee time-in and time-out logging.",
              href: "/employee",
            },
            {
              title: "Keys",
              desc: "For key borrowing and returns.",
              href: "/key",
            },
            {
              title: "Visitors",
              desc: "For visitor check-in and check-out logs.",
              href: "/visitor",
            },
          ].map((card, index) => (
            <Link key={index} href={card.href} className="h-full">
              <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-xl border-t-8 border-[#0441B1] hover:scale-[1.03] hover:shadow-2xl transition cursor-pointer flex flex-col h-full">

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 text-[#0441B1]">
                  {card.title}
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-gray-700 flex-grow">
                  {card.desc}
                </p>

                <div className="mt-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 🔸 Footer */}
      <footer className="bg-white py-6 px-4 text-center text-gray-600 text-sm sm:text-base border-t flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => downloadExcel("today")}
            className="w-full sm:w-auto bg-[#0441B1] text-white px-5 py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-900 transition shadow"
          >
            📅 Today’s Logs
          </button>
          <button
            onClick={() => downloadExcel("all")}
            className="w-full sm:w-auto bg-green-600 text-white px-5 py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition shadow"
          >
            📊 All Logs
          </button>
        </div>

        <p className="text-xs sm:text-sm">
          © {new Date().getFullYear()} La Consolacion College Bacolod — All Rights Reserved
        </p>
      </footer>
    </div>
  );
}