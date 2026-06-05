"use client";

import { useEffect, useState } from "react";
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
  const [selectedGate, setSelectedGate] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const gates = [
    "Rizal Gate",
    "Galo Gate",
    "St. Monica Gate"
  ];
  useEffect(() => {
  const savedGate = localStorage.getItem("selectedGate");

  if (savedGate) {
    window.location.href = "/visitor";
  }
}, []);
  // useEffect(() => {
  //   const savedGate = localStorage.getItem("selectedGate");

  //   if (savedGate) {
  //     setSelectedGate(savedGate);
  //     // setShowDashboard(true);
  //     router.push("/visitor");
  //   }
  // }, [router]);
  // function handleSelectGate(gate: string) {
  //   localStorage.setItem("selectedGate", gate);
  //   setSelectedGate(gate);
  //   // setShowDashboard(true);
  //   router.push("/visitor");
  // }
function handleSelectGate(gate: string) {
  localStorage.setItem("selectedGate", gate);
  window.location.href = "/visitor";
}
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
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          sheetNames[index]
        );
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
      style={{ backgroundImage: "url('/background.png')" }}>
      <div className="min-h-screen w-full flex flex-col bg-black/20 backdrop-blur-[2px]">

        <header className="w-full flex justify-between items-center px-6 md:px-12 lg:px-16 py-2 bg-white/95 backdrop-blur shadow-lg">

          <img
            src="/lcc header.webp"
            alt="LCCB Logo"
            className="h-20 md:h-24 lg:h-20 w-auto"
          />

          {selectedGate && (
            <div className="flex items-center gap-6">

              <div className="flex flex-col items-end">
                <span className="text-lg md:text-xl text-gray-500 font-medium">
                  Selected Gate
                </span>

                <span className="text-2xl md:text-3xl font-bold text-blue-700">
                  {selectedGate}
                </span>
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem("selectedGate");
                  setSelectedGate("");
                  setShowDashboard(false);
                }}
                className="
          px-6
          py-3
          md:px-8
          md:py-4
          rounded-xl
          bg-red-500
          text-white
          text-lg
          md:text-xl
          font-semibold
          hover:bg-red-600
          shadow-md
          transition-all
          duration-300
        "
              >
                Change Gate
              </button>

            </div>
          )}
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          {!showDashboard ? (
            <div className="w-full max-w-7xl bg-white/95 rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
                  Select Gate
                </h1>
                <p className="text-gray-500 mt-4 text-lg">
                  Choose the gate before accessing the dashboard
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {gates.map((gate, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectGate(gate)}
                    className="
          h-[220px]
          rounded-3xl
          bg-gradient-to-br
          from-blue-600
          to-blue-800
          text-white
          text-2xl
          md:text-3xl
          font-bold
          shadow-xl
          hover:scale-[1.03]
          hover:shadow-2xl
          transition-all
          duration-300
          flex
          items-center
          justify-center
          text-center
          px-6
        "
                  >
                    {gate}
                  </button>
                ))}

              </div>

            </div>
          ) : (
            <div className="w-full max-w-[1600px] flex flex-col items-center gap-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
                {[
                  {
                    title: "Employees DTR",
                    desc: "Time records",
                    href: "/employee",
                  },
                  {
                    title: "Keys Log",
                    desc: "Key tracking",
                    href: "/key",
                  },
                  {
                    title: "Visitors Log",
                    desc: "Visitor monitoring",
                    href: "/visitor",
                  },
                ].map((item, i) => (
                  <div key={i} className="w-full">

                    <Link
                      href={item.href}
                      onClick={() => setLoadingCard(item.href)}
                      className="block w-full"
                    >
                      <div className="relative h-[400px] bg-white/95 rounded-3xl shadow-xl border-l-8 border-blue-600 p-10 flex flex-col justify-between hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">

                        {loadingCard === item.href && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-3xl">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        <div>
                          <h2 className="text-4xl font-bold text-blue-700">
                            {item.title}
                          </h2>

                          <p className="text-gray-500 mt-4 text-xl">
                            {item.desc}
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <span className="text-blue-600 font-semibold text-2xl">
                            Open →
                          </span>
                        </div>

                      </div>
                    </Link>

                  </div>
                ))}

              </div>
              <div className="w-full max-w-4xl bg-white/95 rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-semibold mb-5 text-gray-800">
                  Export Logs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="text-lg text-gray-500">
                      Start Date
                    </label>

                    <DatePicker
                      value={new Date().toISOString().split("T")[0]}
                      onChange={setStartDate}
                    />
                  </div>

                  <div>
                    <label className="text-lg text-gray-500">
                      End Date
                    </label>

                    <DatePicker
                      value={new Date().toISOString().split("T")[0]}
                      onChange={setEndDate}
                    />
                  </div>

                </div>
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
          )}
        </main>
        <footer className="text-center text-sm text-gray-700 py-4 bg-white/90 backdrop-blur border-t">
          © {new Date().getFullYear()} La Consolacion College Bacolod
        </footer>

      </div>
    </div>
  );
}