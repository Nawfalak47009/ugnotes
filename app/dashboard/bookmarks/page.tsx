"use client";
import jsPDF from "jspdf";
import { db } from "../../../utils/db";
import { Notes } from "../../../utils/schema";
import { useAuth } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const BookmarksPage = () => {
    const { userId } = useAuth();
    const [bookmarkedNotes, setBookmarkedNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingNote, setEditingNote] = useState<any | null>(null);
    const [editedContent, setEditedContent] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>(""); // State to manage search query
    const [filteredNotes, setFilteredNotes] = useState<any[]>([]); // State to manage filtered notes based on search
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<any | null>(null); // To store selected note for 'Read More'
    const pdf = new jsPDF();

    useEffect(() => {
        const fetchBookmarkedNotes = async () => {
            if (!userId) {
                console.warn("No user ID found.");
                return;
            }

            try {
                setLoading(true);

                const notes = await db
                    .select()
                    .from(Notes)
                    .where(and(eq(Notes.userId, userId), eq(Notes.bookmarked, true)))
                    .orderBy(Notes.createdAt)
                    .execute();

                setBookmarkedNotes(notes);
                setFilteredNotes(notes);
            } catch (error) {
                console.error("Error fetching bookmarked notes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarkedNotes();
    }, [userId]);
    useEffect(() => {
        // Filter the notes based on search query
        const filtered = bookmarkedNotes.filter((note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredNotes(filtered);
    }, [searchQuery, bookmarkedNotes]);


    const randomColor = () => {
        const colors = [
            "#FFDEE9", // Light pink
            "#F0E68C", // Light khaki
            "#B0E0E6", // Powder blue
            "#98FB98", // Pale green
            "#FFB6C1", // Light pink (very light)
            "#D8BFD8"  // Thistle (light lavender)
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleToggleBookmark = async (id: string) => {
        const noteId = Number(id);
        if (isNaN(noteId)) {
            console.error("Invalid ID");
            return;
        }

        try {
            const note = bookmarkedNotes.find((note) => note.id === noteId);
            if (!note) {
                console.error("Note not found");
                return;
            }

            await db.update(Notes).set({ bookmarked: !note.bookmarked }).where(eq(Notes.id, noteId)).execute();
            setBookmarkedNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === noteId ? { ...note, bookmarked: !note.bookmarked } : note
                )
            );
        } catch (error) {
            console.error("Error toggling bookmark:", error);
        }
    };

    const handleDelete = async (id: string) => {
        const noteId = Number(id);
        if (isNaN(noteId)) {
            console.error("Invalid ID");
            return;
        }

        try {
            await db.delete(Notes).where(eq(Notes.id, noteId)).execute();
            setBookmarkedNotes(bookmarkedNotes.filter((note) => note.id !== noteId));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleEdit = (note: any) => {
        setEditingNote(note);
        setEditedContent(note.content); // Pre-fill with current content
    };

    const handleSaveEdit = async () => {
        if (editedContent.trim() === "") return;

        try {
            await db.update(Notes).set({ content: editedContent }).where(eq(Notes.id, Number(editingNote.id))).execute();
            setBookmarkedNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === editingNote.id ? { ...note, content: editedContent } : note
                )
            );
            setEditingNote(null);
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const handleCloseEdit = () => {
        setEditingNote(null);
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

    const openNoteInPDF = (note: any) => {
        const pdf = new jsPDF();
        pdf.setFontSize(12);
        pdf.text(note.title, 10, 10);

        const content = note.content.split("\n");
        let yPosition = 20;

        // Ensure content doesn't overlap, and add space between lines
        content.forEach((line: string) => {
            pdf.text(line, 10, yPosition);
            yPosition += 6; // Adjust line height for better readability
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 10;
            }
        });

        // Open the PDF in a new window
        const pdfUrl = pdf.output("bloburl");
        const pdfWindow = window.open(pdfUrl, "_blank");
        pdfWindow?.focus();
    };

    const handleReadMore = (note: any) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
    };

    // Share Function
    const handleShare = (note: any) => {
        if (navigator.share) {
            navigator
                .share({
                    title: note.title,
                    text: note.content,
                    url: window.location.href, // Can replace with a specific note URL if desired
                })
                .then(() => console.log("Share successful"))
                .catch((error) => console.error("Error sharing", error));
        } else {
            // Fallback in case sharing isn't supported
            alert("Sharing is not supported on this device. You can copy the URL to share.");
        }
    };

    return (
        <div className="p-6 md:p-12 bg-gradient-to-r from-blue-50 to-white min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center sm:text-left">
                Bookmarked Notes
            </h1>
            {/* Search Bar */}
            <div className="flex items-center mb-6">
                <Search className="text-gray-500 mr-2" /> {/* Search Icon */}
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 w-full md:w-1/3 border border-gray-300 rounded-lg"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
                                style={{ backgroundColor: randomColor() }}
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 truncate">{note.title}</h2>
                                <p className="text-gray-600 text-sm md:text-base mb-4">
                                    {note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content}
                                </p>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <button
                                        onClick={() => handleReadMore(note)}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg"
                                    >
                                        Read More
                                    </button>
                                    <button
                                        onClick={() => handleShare(note)}
                                        className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg"
                                    >
                                        Share
                                    </button>
                                    <button
                                        onClick={() => handleToggleBookmark(note.id)}
                                        className="px-4 py-2 text-sm font-medium text-yellow-600 border border-yellow-600 rounded-lg"
                                    >
                                        {note.bookmarked ? "Unbookmark" : "Bookmark"}
                                    </button>
                                    <button
                                        onClick={() => downloadNoteAsPDF(note)}
                                        className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-100 transition"
                                    >
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={() => handleEdit(note)}
                                        className="px-4 py-2 text-sm font-medium text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-100 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No bookmarked notes available.</p>
                    )}
                </div>
            )}

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
            {/* Edit Modal */}
            {editingNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-4/5 max-w-4xl relative overflow-auto">
                        <button
                            onClick={handleCloseEdit}
                            className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-900"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-semibold mb-4">Edit Note</h2>
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-60 p-2 border border-gray-300 rounded-lg mb-4" // Increased height
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCloseEdit}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BookmarksPage;
