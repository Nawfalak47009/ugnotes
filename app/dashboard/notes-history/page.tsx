"use client";
import { db } from "../../../utils/db";
import { Notes } from "../../../utils/schema";
import { useAuth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { Search } from 'lucide-react';  // Import the Search icon
import { useState, useEffect } from "react";
import jsPDF from "jspdf";

// Function to generate lighter random colors
const generateRandomLightColor = () => {
    const letters = '89ABCDEF'; // Start from a higher range for lighter colors
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
};

const NotesHistoryPage = () => {
    const { userId } = useAuth();
    const [notesHistory, setNotesHistory] = useState<any[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
    const [bookmarkedNotes, setBookmarkedNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedNote, setSelectedNote] = useState<any>(null);
    const [editEntry, setEditEntry] = useState<any>(null);
    const [editedResponse, setEditedResponse] = useState<string>(""); 
    const [notification, setNotification] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchNotesHistory = async () => {
            if (!userId) {
                console.warn("No user ID found.");
                return;
            }

            try {
                setLoading(true);

                const history = await db
                    .select()
                    .from(Notes)
                    .where(eq(Notes.userId, userId))
                    .orderBy(Notes.createdAt)
                    .execute();

                setNotesHistory(history);
                setFilteredNotes(history);
                setBookmarkedNotes(history.filter(note => note.bookmarked));
            } catch (error) {
                console.error("Error fetching notes history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotesHistory();
    }, [userId]);

    useEffect(() => {
        // Filter notes based on search query
        if (searchQuery === "") {
            setFilteredNotes(notesHistory);
        } else {
            const filtered = notesHistory.filter((note) =>
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredNotes(filtered);
        }
    }, [searchQuery, notesHistory]);

    const openNote = (note: any) => {
        setSelectedNote(note);
        setIsModalOpen(true); // Open the modal when a note is clicked
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
    };

    const handleEdit = (note: any) => {
        setEditEntry(note);
        setEditedResponse(note.content); // Pre-fill with the note's current content
    };

    const handleSaveEdit = async () => {
        if (!editEntry || !editedResponse) return;

        try {
            await db
                .update(Notes)
                .set({ content: editedResponse })
                .where(eq(Notes.id, editEntry.id))
                .execute();

            setNotesHistory((prev) =>
                prev.map((note) =>
                    note.id === editEntry.id ? { ...note, content: editedResponse } : note
                )
            );

            setNotification("Note updated successfully!");
            setTimeout(() => setNotification(null), 3000);
            setEditEntry(null);
            setSelectedNote(null);
        } catch (error) {
            console.error("Error saving edit:", error);
            setNotification("Error updating note.");
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const deleteNote = async (noteId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this note?");
        if (!confirmed) return;

        try {
            await db.delete(Notes).where(eq(Notes.id, parseInt(noteId, 10))).execute();
            setNotesHistory((prev) => prev.filter((note) => note.id !== parseInt(noteId, 10)));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const downloadNoteAsPDF = (note: any) => {
        const pdf = new jsPDF();
        const pageHeight = pdf.internal.pageSize.height; // Get page height to manage content overflow
        const margin = 10; // Margin from the left
        const lineHeight = 6; // Space between lines
        const maxWidth = pdf.internal.pageSize.width - 2 * margin; // Max width to ensure text doesn't overflow the page

        // Set title font size and add title
        pdf.setFontSize(16);
        pdf.text(note.title, margin, margin + 10); // Title position

        // Set content font size and add content
        pdf.setFontSize(12);
        const content = note.content.split("\n");
        let yPosition = margin + 20; // Start content 20 units below the title

        content.forEach((line: string) => {
            // Break the line if it's too long (fits within page width)
            let lines = pdf.splitTextToSize(line, maxWidth);

            lines.forEach((splitLine: string) => {
                pdf.text(splitLine, margin, yPosition);
                yPosition += lineHeight; // Move down for the next line
                if (yPosition > pageHeight - margin) { // Check if content overflows the page
                    pdf.addPage(); // Add new page
                    yPosition = margin + 10; // Reset yPosition to the top of the new page
                }
            });
        });

        // Save the generated PDF with the title as the filename
        pdf.save(`${note.title}.pdf`);
    };

    const shareNote = async (note: any) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: note.title,
                    text: note.content,
                });
            } catch (error) {
                console.error("Error sharing note:", error);
            }
        } else {
            alert("Sharing is not supported in your browser.");
        }
    };

    const toggleBookmark = async (note: any) => {
        const updatedBookmarkStatus = !note.bookmarked;

        try {
            // Update the bookmark status in the database
            await db
                .update(Notes)
                .set({ bookmarked: updatedBookmarkStatus })
                .where(eq(Notes.id, note.id))
                .execute();

            // Update the local notes history
            setNotesHistory((prev) =>
                prev.map((noteItem) =>
                    noteItem.id === note.id
                        ? { ...noteItem, bookmarked: updatedBookmarkStatus }
                        : noteItem
                )
            );

            // Update the bookmarked notes array in the state
            if (updatedBookmarkStatus) {
                setBookmarkedNotes((prev) => [...prev, note]);
            } else {
                setBookmarkedNotes((prev) =>
                    prev.filter((bookmarkedNote) => bookmarkedNote.id !== note.id)
                );
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
        }
    };

    return (
        <div className="p-6 md:p-12 bg-gradient-to-r from-blue-50 to-white min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center sm:text-left">
                Your Notes History
            </h1>

            <div className="mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg max-w-xs sm:max-w-md mx-auto">
                    <Search className="text-gray-500 ml-4" size={20} />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 pl-10 text-gray-700 border-none rounded-lg"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
                </div>
            ) : (
                <>
                    {/* All Notes */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Notes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredNotes.map((note) => (
                                <div
                                    key={note.id}
                                    className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
                                    style={{ backgroundColor: generateRandomLightColor() }}
                                >
                                    <h2 className="text-xl font-semibold text-gray-900 mb-3 truncate">{note.title}</h2>
                                    <p className="text-gray-600 text-sm md:text-base mb-4" style={{ wordBreak: 'break-word', overflow: 'hidden' }}>
                                        {note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content}
                                    </p>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <button
                                            onClick={() => openNote(note)}
                                            className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100 transition"
                                        >
                                            Read More
                                        </button>
                                        <button
                                            onClick={() => deleteNote(note.id)}
                                            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-100 transition"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => downloadNoteAsPDF(note)}
                                            className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-100 transition"
                                        >
                                            Download PDF
                                        </button>
                                        <button
                                            onClick={() => shareNote(note)}
                                            className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-100 transition"
                                        >
                                            Share
                                        </button>
                                        <button
                                            onClick={() => handleEdit(note)}
                                            className="px-4 py-2 text-sm font-medium text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-100 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleBookmark(note)}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-600 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            {note.bookmarked ? "Unbookmark" : "Bookmark"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Read More Modal */}
                    {isModalOpen && selectedNote && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg w-3/4 sm:w-2/3 lg:w-1/2 xl:w-1/3 relative max-h-[80vh] overflow-y-auto">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-900"
                                >
                                    &times;
                                </button>
                                <h2 className="text-2xl font-semibold mb-4">{selectedNote.title}</h2>
                                {/* Content with line breaks and proper wrapping */}
                                <div className="text-sm md:text-base whitespace-pre-wrap break-words">
                                    {selectedNote.content}
                                </div>
                            </div>
                        </div>
                    )}

                    {editEntry && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded-lg w-3/4 max-w-2xl relative overflow-auto">
                                <button
                                    onClick={() => setEditEntry(null)}
                                    className="absolute top-2 right-2 text-2xl font-bold text-gray-600"
                                >
                                    &times;
                                </button>
                                <h2 className="text-xl font-semibold mb-4">Edit Note</h2>
                                <textarea
                                    value={editedResponse}
                                    onChange={(e) => setEditedResponse(e.target.value)}
                                    className="w-full h-60 p-4 border rounded-lg mb-4"
                                />
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setEditEntry(null)}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default NotesHistoryPage;
