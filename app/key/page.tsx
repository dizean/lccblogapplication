"use client";

import { useState } from "react";
import { KeysBorrowReturn } from "./KeysBorrowReturn";
import KeysLog from "./KeysLog";
import Link from "next/link";
import AddKeyModal from "../modals/addRoom";

export default function KeyPage() {
  const [showLogs, setShowLogs] = useState(false);
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      
      {/* HEADER */}
      <header className="w-full flex flex-col md:flex-row justify-between items-center gap-4 px-4 sm:px-6 md:px-10 py-4 bg-white shadow-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0441B1] text-center md:text-left">
          {showLogs ? "Key Logs" : "List of Keys"}
        </h1>

        <Link
          href="/"
          className="w-full md:w-auto text-center px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all"
        >
          ← Back to Home
        </Link>
      </header>

      {/* CONTENT (FULL HEIGHT) */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="h-full w-full flex flex-col p-2 sm:p-4 md:p-6">
          
          {!showLogs ? (
            <div className="flex-1 overflow-auto">
              <KeysBorrowReturn
                onShowLogs={() => setShowLogs(true)}
                onAddKey={() => setIsAddKeyOpen(true)}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <KeysLog onBackToKeys={() => setShowLogs(false)} />
            </div>
          )}

        </div>
      </main>

      {/* MODAL */}
      {isAddKeyOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg">
            <AddKeyModal
              isOpen={isAddKeyOpen}
              onClose={() => setIsAddKeyOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}