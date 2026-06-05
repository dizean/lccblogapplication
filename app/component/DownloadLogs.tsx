import { useState } from "react";
import DatePicker from "./DatePicker";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type ExportType = "visitors" | "employees" | "keys" | "all";
type ExportMode = "today" | "all" | "range";

interface Props {
  type: ExportType;
  service: any; // pass your service object
}

export default function ExportLogsCard({ type, service }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const titleMap: Record<ExportType, string> = {
    visitors: "Export Visitor Logs",
    employees: "Export Employee Logs",
    keys: "Export Key Logs",
    all: "Export All Logs",
  };

  async function downloadExcel(mode: ExportMode) {
    try {
      setLoading(true);

      let data: any[] = [];

      const serviceMap = {
        visitors: {
          today: service.fetchVisitorsToday,
          all: service.fetchVisitorsAll,
          range: service.fetchVisitorsRange,
        },
        employees: {
          today: service.fetchEmployeesToday,
          all: service.fetchEmployeesAll,
          range: service.fetchEmployeesRange,
        },
        keys: {
          today: service.fetchKeysToday,
          all: service.fetchKeysAll,
          range: service.fetchKeysRange,
        },
        all: {
          today: service.fetchAllToday,
          all: service.fetchAllLogs,
          range: service.fetchAllRange,
        },
      };

      if (mode === "range") {
        if (!startDate || !endDate) {
          alert("Select start and end dates.");
          return;
        }

        if (startDate > endDate) {
          alert("Invalid date range.");
          return;
        }
      }

      if (mode === "today") {
        data = await serviceMap[type].today();
      } else if (mode === "all") {
        data = await serviceMap[type].all();
      } else {
        data = await serviceMap[type].range(startDate, endDate);
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data || []);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

      const wbout = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const prefix =
        type === "visitors"
          ? "Visitors"
          : type === "employees"
          ? "Employees"
          : type === "keys"
          ? "Keys"
          : "AllLogs";

      const filename =
        mode === "today"
          ? `${prefix}_Today.xlsx`
          : mode === "all"
          ? `${prefix}_All.xlsx`
          : `${prefix}_${startDate}_to_${endDate}.xlsx`;

      saveAs(new Blob([wbout]), filename);
    } catch (err) {
      console.error(err);
      alert("Export failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl bg-white/95 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">
        {titleMap[type]}
      </h2>

      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-lg text-gray-500">Start Date</label>
          <DatePicker value={startDate} onChange={setStartDate} />
        </div>

        <div>
          <label className="text-lg text-gray-500">End Date</label>
          <DatePicker value={endDate} onChange={setEndDate} />
        </div>
      </div>

      {/* Buttons */}
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
  );
}