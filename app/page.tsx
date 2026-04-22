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

      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        type === "today" ? "LCCB_Today_Logs.xlsx" : "LCCB_All_Logs.xlsx"
      );
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to download Excel.");
    }
  }

  return (
    <div
      className="h-screen w-screen flex flex-col bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 bg-white/90 backdrop-blur shadow-md">
        <img
          src="/lcc header.webp"
          alt="LCCB Logo"
          className="h-12 sm:h-14 md:h-16 w-auto"
        />
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full flex items-center justify-center px-4 sm:px-6 md:px-10 py-6">
        
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl">

          {[
            {
              title: "Employees DTR",
              desc: "Manage employee time records.",
              href: "/employee",
            },
            {
              title: "Keys",
              desc: "Track key borrowing and returns.",
              href: "/key",
            },
            {
              title: "Visitors",
              desc: "Monitor visitor check-ins.",
              href: "/visitor",
            },
          ].map((card, index) => (
            <Link key={index} href={card.href} className="h-full">
              
              <div className="
                h-full min-h-[160px] md:min-h-[180px]
                flex flex-col justify-between
                bg-white/95 backdrop-blur
                rounded-xl
                p-5 sm:p-6
                shadow-lg hover:shadow-xl
                border-t-4 border-[#0441B1]
                transition-all duration-200
                hover:-translate-y-0.5
                cursor-pointer
              ">

                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0441B1] mb-2">
                    {card.title}
                  </h2>

                  <p className="text-sm sm:text-base text-gray-600">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 text-sm font-medium text-[#0441B1]">
                  Open →
                </div>

              </div>

            </Link>
          ))}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white/90 backdrop-blur border-t px-4 sm:px-6 md:px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-3">

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={() => downloadExcel("today")}
            className="w-full sm:w-auto bg-[#0441B1] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 transition"
          >
            📅 Today’s Logs
          </button>

          <button
            onClick={() => downloadExcel("all")}
            className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
          >
            📊 All Logs
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 text-center md:text-right">
          © {new Date().getFullYear()} La Consolacion College Bacolod
        </p>
      </footer>
    </div>
  );
}