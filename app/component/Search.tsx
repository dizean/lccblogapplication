// import { useState } from "react";

// interface SearchProps {
//     employeesLog: [];
// }

// export default function Search({
//     employeesLog
// }: SearchProps) {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedDate, setSelectedDate] = useState(
//         new Date().toISOString().split("T")[0]
//     );
//     const [showAll, setShowAll] = useState(false);

//     const filteredLogs = employeesLog.filter((log: any) => {
//         const matchesName = log.name
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase());
//         const matchesDate = showAll
//             ? true
//             : selectedDate
//                 ? new Date(log.date).toLocaleDateString("en-CA") === selectedDate
//                 : true;
//         return matchesName && matchesDate;
//     });
//     return (
//         <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 w-full">
//             <input
//                 type="text"
//                 placeholder="🔍 Search employee name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full md:w-1/2 px-10 py-5 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] transition-all"
//             />

//             <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-end">
//                 {!showAll && (
//                     <input
//                         type="date"
//                         value={selectedDate}
//                         onChange={(e) => setSelectedDate(e.target.value)}
//                         className="px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] text-xl w-full sm:w-[200px]"
//                     />
//                 )}

//                 <button
//                     onClick={() => setShowAll(!showAll)}
//                     className={`w-full sm:w-[210px] px-8 py-5 text-xl font-semibold rounded-xl transition-all shadow-md 
//                         ${showAll
//                             ? "bg-yellow-800 text-white hover:bg-yellow-600"
//                             : "bg-yellow-600 text-white hover:bg-yellow-400"
//                         }`}
//                 >
//                     {showAll ? "Filter by Date" : "Show All"}
//                 </button>


//                 <button
//                     onClick={onBackToDTR}
//                     className="w-full sm:w-[210px] px-8 py-5 text-xl bg-[#0441B1] text-white font-semibold rounded-xl hover:bg-blue-900 transition-all shadow-md"
//                 >
//                     ← Back to DTR
//                 </button>
//             </div>
//         </div>
//     )

// }