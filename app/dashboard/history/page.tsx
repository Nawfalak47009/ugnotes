"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { Button } from "@/components/ui/button";
import { Loader2Icon, ArrowLeft, Search, X } from "lucide-react";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";
import { jsPDF } from "jspdf";
import { useAuth } from "@clerk/nextjs"; // Replace with your authentication provider

const ITEMS_PER_PAGE = 8;

const HistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const router = useRouter();
  const { userId } = useAuth(); // Get the current authenticated user's ID

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return; // Only fetch if user is authenticated
  
      const stringUserId = userId; // Use userId directly as string
  
      setLoading(true);
      try {
        const result = await db
          .select()
          .from(AIOutput)
          .where(eq(AIOutput.userId, stringUserId)) // Ensure comparison as string
          .orderBy(desc(AIOutput.createdAt));
  
        setHistory(result);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
      setLoading(false);
    };
  
    fetchHistory();
  }, [userId]);
  
  
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredHistory = history.filter((entry) =>
    entry.templateSlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.aiResponse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const currentData = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDownloadPDF = (entry: any) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`AI Response History - ${entry.templateSlug}`, 10, 10);
    doc.text(`Date: ${entry.createdAt}`, 10, 20);

    let yPos = 30;
    const response = entry.aiResponse;
    const maxWidth = 180;
    const lines = doc.splitTextToSize(response, maxWidth);

    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], 10, yPos);
      yPos += 8;
      if (yPos > 270) {
        doc.addPage();
        yPos = 10;
      }
    }

    doc.save(`${entry.templateSlug}_history.pdf`);
  };

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-200 to-gray-100 min-h-screen">
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] p-8 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold">{selectedEntry.templateSlug}</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] px-4 py-6 bg-gray-100 rounded-lg font-serif text-base text-gray-900 leading-relaxed tracking-wide whitespace-pre-line">
              {selectedEntry.aiResponse}
            </div>
            <div className="h-20"></div>
            <div className="flex justify-center">
              <Button
                onClick={() => handleDownloadPDF(selectedEntry)}
                className="text-sm bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg"
              >
                Download as PDF
              </Button>
            </div>
          </div>
        </div>
      )}
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
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search history..."
          className="w-full p-2 pl-10 border border-gray-300 rounded"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>
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
                <Button
                  onClick={() => handleDownloadPDF(entry)}
                  className="text-xs sm:text-sm bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded"
                >
                  Download as PDF
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
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
    </div>
  );
};

export default HistoryPage;
