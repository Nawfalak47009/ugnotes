"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Search, X, Edit, Mail, Check, Download, Calendar, FileText } from "lucide-react";
import { desc, asc, and, gte, lte } from "drizzle-orm";
import { eq, inArray } from "drizzle-orm/expressions";
import { jsPDF } from "jspdf";
import { useAuth } from "@clerk/nextjs";
import { CSVLink } from "react-csv";

const ITEMS_PER_PAGE = 8;

const HistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [csvData, setCsvData] = useState<any[]>([]); // State to hold CSV data
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [editEntry, setEditEntry] = useState<any | null>(null);
  const [editedResponse, setEditedResponse] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;

      const stringUserId = userId;

      setLoading(true);
      try {
        const result = await db
          .select()
          .from(AIOutput)
          .where(eq(AIOutput.userId, stringUserId))
          .orderBy(sortOrder === "desc" ? desc(AIOutput.createdAt) : asc(AIOutput.createdAt));

        setHistory(result);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
      setLoading(false);
    };

    if (userId) fetchHistory();
  }, [userId, sortOrder]);

  // Handle bulk selection
  const handleSelectEntry = (id: number) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter((entryId) => entryId !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };

  // Select/Deselect all entries on the current page
  const handleSelectAll = () => {
    const allIdsOnPage = currentData.map((entry) => entry.id);
    if (selectedEntries.length === allIdsOnPage.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(allIdsOnPage);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedEntries.length === 0) {
      setNotification("No entries selected for deletion.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (window.confirm("Are you sure you want to delete the selected entries?")) {
      try {
        await db.delete(AIOutput).where(inArray(AIOutput.id, selectedEntries));
        setHistory(history.filter((entry) => !selectedEntries.includes(entry.id)));
        setSelectedEntries([]);
        setNotification("Selected entries deleted successfully!");
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        console.error("Error deleting entries:", error);
      }
    }
  };

  // Handle bulk download as PDF
  const handleBulkDownload = () => {
    if (selectedEntries.length === 0) {
      setNotification("No entries selected for download.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    selectedEntries.forEach((id, index) => {
      const entry = history.find((entry) => entry.id === id);
      if (entry) {
        if (index > 0) doc.addPage(); // Add a new page for each entry after the first
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
      }
    });

    doc.save("bulk_history.pdf");
    setNotification("Bulk download started!");
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    if (selectedEntries.length === 0) {
      setNotification("No entries selected for export.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const data = selectedEntries.map((id) => {
      const entry = history.find((entry) => entry.id === id);
      return {
        Title: entry.templateSlug,
        Response: entry.aiResponse,
        Date: entry.createdAt,
      };
    });

    setCsvData(data); // Set CSV data
  };

  // Handle date filter
  const handleDateFilter = () => {
    if (!dateFilter.start || !dateFilter.end) {
      setNotification("Please select both start and end dates.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const filtered = history.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      return entryDate >= startDate && entryDate <= endDate;
    });

    setHistory(filtered);
    setNotification("Entries filtered by date range.");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopy = (aiResponse: string) => {
    navigator.clipboard
      .writeText(aiResponse)
      .then(() => {
        setNotification("AI Response copied to clipboard!");
        setTimeout(() => setNotification(null), 3000);
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
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        console.error("Error deleting history entry:", error);
      }
    }
  };

  const handleEdit = (entry: any) => {
    setEditEntry(entry);
    setEditedResponse(entry.aiResponse);
  };

  const handleSaveEdit = async () => {
    if (!editEntry) return;

    try {
      await db.update(AIOutput)
        .set({ aiResponse: editedResponse })
        .where(eq(AIOutput.id, editEntry.id));

      setHistory(
        history.map((entry) =>
          entry.id === editEntry.id ? { ...entry, aiResponse: editedResponse } : entry
        )
      );
      setNotification("History entry updated successfully!");
      setTimeout(() => setNotification(null), 3000);
      setEditEntry(null);
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredHistory = useMemo(() =>
    history.filter((entry) =>
      entry.templateSlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.aiResponse.toLowerCase().includes(searchQuery.toLowerCase())
    ), [history, searchQuery]);

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const currentData = useMemo(() => filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ), [filteredHistory, currentPage]);

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
    setTimeout(() => setNotification(null), 3000);
  };

  const handleShare = (entry: any) => {
    const subject = `AI Response History - ${entry.templateSlug}`;
    const body = `Here is the AI response for ${entry.templateSlug}:\n\n${entry.aiResponse}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-xl shadow-blue-400 transition-all animate-fade-in">
          {notification}
        </div>
      )}

      {editEntry && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center transition-all">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] p-6 rounded-lg shadow-xl overflow-hidden transition-all animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-600">Edit AI Response</h2>
              <button
                onClick={() => setEditEntry(null)}
                className="text-gray-600 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={8}
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleSaveEdit}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105 text-sm sm:text-base"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setEditEntry(null)}
                className="bg-gray-400 text-white hover:bg-gray-500 px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center transition-all">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] p-6 rounded-lg shadow-xl overflow-hidden transition-all animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-600">{selectedEntry.templateSlug}</h2>
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
                className="bg-blue-700 text-white hover:bg-blue-400 px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105 text-sm sm:text-base"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Your History</h1>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search your history..."
              className="p-2 sm:p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
        <Button
          onClick={handleSelectAll}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all hover:scale-105 text-sm sm:text-base"
        >
          {selectedEntries.length === currentData.length ? "Deselect All" : "Select All"}
        </Button>
        <Button
          onClick={handleBulkDelete}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all hover:scale-105 text-sm sm:text-base"
          disabled={selectedEntries.length === 0}
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Bulk Delete
        </Button>
        <Button
          onClick={handleBulkDownload}
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-all hover:scale-105 text-sm sm:text-base"
          disabled={selectedEntries.length === 0}
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Bulk Download
        </Button>
        <Button
          onClick={handleExportCSV}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all hover:scale-105 text-sm sm:text-base"
          disabled={selectedEntries.length === 0}
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Export to CSV
        </Button>
        {csvData.length > 0 && (
          <CSVLink
            data={csvData}
            filename="history_export.csv"
            className="hidden" // Hide the link, as it's triggered programmatically
            ref={(link: any) => link && link.link.click()} // Automatically trigger the download
          />
        )}
      </div>

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full">
          {/* Calendar Icon and Start Date Input */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="w-5 h-5 text-gray-600" />
            <input
              type="date"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
              className="p-2 sm:p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-auto"
            />
          </div>

          {/* "to" Text and End Date Input */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-gray-600">to</span>
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
              className="p-2 sm:p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-auto"
            />
          </div>

          {/* Filter Button */}
          <Button
            onClick={handleDateFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 sm:px-6 rounded-lg transition-all hover:scale-105 w-full sm:w-auto"
          >
            Filter by Date
          </Button>
        </div>
      </div>

      {/* Sorting */}
      <div className="flex justify-end mb-6">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="p-2 sm:p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-auto"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="space-y-8 px-2 sm:px-4 md:px-6">
        {loading ? (
          <div className="flex justify-center">
            <Loader2Icon className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : currentData.length > 0 ? (
          currentData.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col bg-white p-4 sm:p-6 rounded-lg shadow-xl space-y-4 sm:space-y-6 transition-all hover:shadow-2xl hover:scale-[1.02]"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedEntries.includes(entry.id)}
                    onChange={() => handleSelectEntry(entry.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-700">{entry.templateSlug}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(entry.aiResponse)}
                    className="bg-blue-700 hover:bg-blue-600 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-lg transition-all hover:scale-105 text-sm"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(entry)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-lg transition-all hover:scale-105 text-sm"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(entry.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-lg transition-all hover:scale-105 text-sm"
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare(entry)}
                    className="bg-slate-500 hover:bg-slate-600 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-lg transition-all hover:scale-105 text-sm"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    Share
                  </Button>
                  <Button
                    onClick={() => handleDownloadPDF(entry)}
                    className="bg-teal-600 text-white hover:bg-teal-700 py-1 sm:py-2 px-2 sm:px-4 rounded-lg transition-all hover:scale-105 text-sm"
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
            <ul className="flex flex-wrap gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handlePageChange(idx + 1)}
                    className={`${currentPage === idx + 1
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white"
                      } py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-300 ease-in-out hover:scale-105 text-sm sm:text-base`}
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