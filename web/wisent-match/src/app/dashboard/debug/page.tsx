"use client";

import { useState } from "react";
import Link from "next/link";

export default function DebugPage() {
  const [status, setStatus] = useState<string | null>(null);

  const resetData = () => {
    try {
      localStorage.removeItem("wisentmatch_bisons");
      localStorage.removeItem("wisentmatch_adverts");
      setStatus("✅ All data has been reset successfully.");
    } catch (err) {
      console.error("Failed to reset:", err);
      setStatus("❌ Error: could not clear localStorage.");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">🧰 Debug Tools</h1>
      <p className="text-gray-600 mb-8">
        Administrative panel for clearing local data. Use only for testing or
        troubleshooting. This will remove locally stored bison and advert data.
      </p>

      <div className="space-y-6 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <button
          onClick={resetData}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          🧨 Reset all local data
        </button>

        {status && (
          <p
            className={`text-sm ${
              status.startsWith("✅")
                ? "text-green-700 bg-green-50 border border-green-200"
                : "text-red-700 bg-red-50 border border-red-200"
            } px-4 py-2 rounded-lg`}
          >
            {status}
          </p>
        )}

        <div className="pt-4 border-t border-gray-200">
          <Link
            href="/dashboard/wisents"
            className="inline-block text-sm text-green-700 hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}