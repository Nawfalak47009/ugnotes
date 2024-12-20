"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { Button } from "@/components/ui/button";
import { Loader2Icon, ArrowLeft } from "lucide-react";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";

const ITEMS_PER_PAGE = 8;

const HistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const result = await db.select().from(AIOutput).orderBy(desc(AIOutput.createdAt));
        setHistory(result);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const handleCopy = (aiResponse: string) => {
    navigator.clipboard
      .writeText(aiResponse)
      .then(() => alert("AI Response copied to clipboard!"))
      .catch((err) => console.error("Error copying text:", err));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this history entry?")) {
      try {
        await db.delete(AIOutput).where(eq(AIOutput.id, id));
        setHistory(history.filter((entry) => entry.id !== id));
        alert("History entry deleted successfully!");
      } catch (error) {
        console.error("Error deleting history entry:", error);
        alert("Failed to delete the entry.");
      }
    }
  };

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const currentData = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-200 to-gray-100 min-h-screen">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => router.back()}
          className="flex gap-2 items-center bg-gray-800 text-white hover:bg-gray-700 rounded-md px-4 py-2 text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
        AI Response History
      </h1>

      {/* Display entries in a single column for mobile and small screens */}
      <div className="flex flex-col gap-6">
        {currentData.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No history found.
          </div>
        ) : (
          currentData.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-300"
            >
              <h2 className="text-sm sm:text-lg font-bold text-gray-800">
                {entry.templateSlug}
              </h2>
              <div className="text-xs sm:text-sm text-gray-500">{entry.createdAt}</div>
              <p className="mt-2 text-gray-600 text-xs sm:text-sm truncate">
                {entry.aiResponse.length > 150
                  ? `${entry.aiResponse.slice(0, 150)}...`
                  : entry.aiResponse}
              </p>
              <button
                onClick={() => setSelectedEntry(entry)}
                className="text-blue-500 mt-2 hover:underline text-xs sm:text-sm"
              >
                Read More
              </button>
              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                <Button
                  onClick={() => handleCopy(entry.aiResponse)}
                  className="text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Copy
                </Button>
                <Button
                  onClick={() => handleDelete(entry.id)}
                  className="text-xs sm:text-sm bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 text-xs sm:text-sm rounded transition ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Full-Screen Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-11/12 max-w-4xl h-5/6 overflow-y-auto relative">
            <Button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-400"
            >
              Close
            </Button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {selectedEntry.templateSlug}
            </h2>
            <div className="text-xs sm:text-sm text-gray-500 mb-4">{selectedEntry.createdAt}</div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
              {selectedEntry.aiResponse}
            </p>
            <Button
              onClick={() => setSelectedEntry(null)}
              className="mt-6 bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded"
            >
              Read Less
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
