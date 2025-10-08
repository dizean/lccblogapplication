"use client";

import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  // 📦 Generic Export Function
  async function downloadExcel(type: "today" | "all") {
    // ✅ Choose which API set to use
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
      // Fetch all API data concurrently
      const results = await Promise.all(
        apis.map(async (url) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
          return await res.json();
        })
      );

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Add each dataset to its own sheet
      results.forEach((data, index) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[index]);
      });

      // Generate and download XLSX
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
      <div className="flex w-full bg-white p-6 md:p-10 items-center shadow-md">
        <div className="basis-[40%] sm:basis-[30%]">
          <img
            src="/lcc header.webp"
            alt="LCCB Logo"
            className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto"
          />
        </div>

        <div className="basis-[60%] sm:basis-[70%] flex justify-end">
          <Link href="/signin">
            <button className="px-10 py-5 text-2xl bg-[#0441B1] text-white font-extrabold rounded-2xl hover:bg-blue-900 transition-all shadow-lg">
              SIGN IN
            </button>
          </Link>
        </div>
      </div>

      {/* 🔹 Body Section */}
      <div className="flex flex-1 items-center justify-center p-8 md:p-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-[1800px]">
          {[
            {
              title: "Employees DTR",
              desc: "For employee time-in and time-out logging.",
              href: "/employee",
            },
            {
              title: "Keys",
              desc: "For key borrowing and key returns.",
              href: "/key",
            },
            {
              title: "Visitors",
              desc: "For visitor check-in and check-out logs.",
              href: "/visitor",
            },
          ].map((card, index) => (
            <Link key={index} href={card.href}>
              <div className="bg-white rounded-3xl p-12 md:p-14 lg:p-16 text-center shadow-2xl border-t-[12px] border-[#0441B1] hover:scale-105 hover:shadow-3xl transition-all cursor-pointer">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#0441B1] tracking-tight">
                  {card.title}
                </h2>
                <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 🔸 Footer + Export Buttons */}
      <footer className="bg-white py-8 text-center text-gray-600 text-lg font-medium border-t flex flex-col items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => downloadExcel("today")}
            className="bg-[#0441B1] text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-900 transition-all shadow-lg"
          >
            📅 Download Today’s Logs
          </button>
          <button
            onClick={() => downloadExcel("all")}
            className="bg-green-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-green-700 transition-all shadow-lg"
          >
            📊 Download All Logs
          </button>
        </div>
        <p>
          © {new Date().getFullYear()} La Consolacion College Bacolod — All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
