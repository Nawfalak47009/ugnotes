"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { Button } from "@/components/ui/button";
import { Loader2Icon, ArrowLeft, Search, X, Edit } from "lucide-react";
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
  const [editEntry, setEditEntry] = useState<any | null>(null); // State for editing
  const [editedResponse, setEditedResponse] = useState(""); // Store edited response
  const [notification, setNotification] = useState<string | null>(null); // State for notification
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
      .then(() => {
        setNotification("AI Response copied to clipboard!");
        setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
      })
      .catch((err) => {
        console.error("Error copying text:", err);
      });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this history entry?")) {
      try {
        await db.delete(AIOutput).where(eq(AIOutput.id, id));
        setHistory(history.filter((entry) => entry.id !== id));
        setNotification("History entry deleted successfully!");
        setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
      } catch (error) {
        console.error("Error deleting history entry:", error);
      }
    }
  };

  const handleEdit = (entry: any) => {
    setEditEntry(entry);
    setEditedResponse(entry.aiResponse); // Load the current response into the editor
  };

  const handleSaveEdit = async () => {
    if (!editEntry) return;

    try {
      await db.update(AIOutput)
        .set({ aiResponse: editedResponse })
        .where(eq(AIOutput.id, editEntry.id));

      // Update history state
      setHistory(
        history.map((entry) =>
          entry.id === editEntry.id ? { ...entry, aiResponse: editedResponse } : entry
        )
      );
      setNotification("History entry updated successfully!");
      setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
      setEditEntry(null); // Close the editor
    } catch (error) {
      console.error("Error saving edit:", error);
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
    setNotification("Download started!");
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  return (
    <div className="p-6 sm:p-12 bg-gradient-to-br bg-white min-h-screen">
      {/* Notification Display */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-xl shadow-blue-400 transition-all">
          {notification}
        </div>
      )}

      {/* Edit Modal */}
      {editEntry && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center transition-all">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] p-8 rounded-lg shadow-xl overflow-hidden transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-400">Edit AI Response</h2>
              <button
                onClick={() => setEditEntry(null)}
                className="text-gray-600 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={10}
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-4">
              <Button
                onClick={handleSaveEdit}
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg shadow-md transition-all"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setEditEntry(null)}
                className="bg-gray-400 text-white hover:bg-gray-500 px-6 py-2 rounded-lg shadow-md transition-all"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Read More Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center transition-all">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] p-8 rounded-lg shadow-xl overflow-hidden transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-600">{selectedEntry.templateSlug}</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-gray-600 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] px-4 py-6 bg-gray-100 rounded-lg font-serif text-base text-gray-900 leading-relaxed tracking-wide whitespace-pre-line">
              {selectedEntry.aiResponse}
            </div>
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => handleDownloadPDF(selectedEntry)}
                className="bg-blue-700 text-white hover:bg-blue-400 px-6 py-2 rounded-lg shadow-md transition-all"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Your history</h1>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search your history..."
              className="p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center">
            <Loader2Icon className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : currentData.length > 0 ? (
          currentData.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col bg-white p-6 rounded-lg shadow-xl space-y-6 transition-all hover:shadow-2xl hover:scale-105"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-blue-700">{entry.templateSlug}</h3>
                <div className="space-x-3 flex-wrap sm:flex-nowrap">
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(entry.aiResponse)}
                    className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-all"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(entry)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg transition-all"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(entry.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-all"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => handleDownloadPDF(entry)}
                    className="bg-teal-600 text-white hover:bg-teal-700 py-2 px-6 rounded-lg transition-all"
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{entry.aiResponse.slice(0, 150)}...</p>
              <Button
                variant="link"
                className="text-sm text-blue-400 hover:text-blue-700 transition-colors duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                onClick={() => setSelectedEntry(entry)}
              >
                Read More
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav>
            <ul className="flex space-x-4">
              {[...Array(totalPages)].map((_, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handlePageChange(idx + 1)}
                    className={`${
                      currentPage === idx + 1
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    } py-2 px-6 rounded-lg transition-all hover:bg-teal-700`}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
