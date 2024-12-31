"use client"
import { useAuth } from "@clerk/nextjs"; // Import useAuth from Clerk
import { useEffect, useState } from "react";
import { db } from "../../../utils/db"; // Adjust this according to your file structure
import { Notes } from "../../../utils/schema"; // Correct path to your Notes table definition
import { eq } from "drizzle-orm"; // Import eq from drizzle-orm for proper comparisons
import ComingSoonPage from "../ComingSoon/comginsoonpage";


const NotesPage = () => {
    const { userId } = useAuth(); // Use useAuth to get the current authenticated user's ID
    const [notes, setNotes] = useState<any[]>([]); // Adjust type based on your schema
    const [noteContent, setNoteContent] = useState<string>(""); // For capturing note input
    const [loading, setLoading] = useState<boolean>(true); // For loading state
    const [fontStyle, setFontStyle] = useState<string>("Arial"); // Track font family
    const [fontSize, setFontSize] = useState<string>("16px"); // Track font size
    const [fontColor, setFontColor] = useState<string>("#000000"); // Track text color
    const [fontWeight, setFontWeight] = useState<string>("normal"); // Track font weight
    const [enteredCode, setEnteredCode] = useState<string>(""); // State for the entered code
    const [isCodeCorrect, setIsCodeCorrect] = useState<boolean>(false); // Flag to check if the code is correct

    const currentYear = new Date().getFullYear(); // Get current year

    useEffect(() => {
        if (userId) {
            // Fetch notes when the page loads
            fetchNotes();
        }
    }, [userId]); // Re-fetch notes when the userId changes or page mounts

    // Function to fetch notes from the database
    const fetchNotes = async () => {
        setLoading(true);
        try {
            // Ensure that we fetch only notes related to the authenticated user
            if (userId) {
                const fetchedNotes = await db
                    .select()
                    .from(Notes)
                    .where(eq(Notes.userId, userId)) // Fetch notes for the authenticated user
                    .execute();
                setNotes(fetchedNotes);
            } else {
                console.error("User ID is undefined");
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle new note creation
    const handleAddNote = async () => {
        if (!noteContent.trim()) {
            alert("Please enter some note content!");
            return;
        }

        try {
            if (userId) {
                // Insert the note into the database with userId, title, and content
                await db.insert(Notes).values({
                    userId: userId, // Use the userId from Clerk
                    title: "Untitled Note",  // Default title or dynamically set title
                    content: noteContent, // Content of the note
                    createdAt: new Date(), // Automatically generated timestamp (default set in schema)
                }).execute();

                setNoteContent(""); // Reset note content after adding
                fetchNotes(); // Re-fetch notes to include the newly added one
            }
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    // Function to handle note deletion
    const handleDeleteNote = async (noteId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this note?");
        if (confirmDelete) {
            try {
                // Convert noteId to a number before passing to eq
                await db.delete(Notes).where(eq(Notes.id, Number(noteId))).execute();
                fetchNotes(); // Re-fetch the notes after deletion
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    };

    // Function to handle code verification
    const handleCodeSubmit = () => {
        if (enteredCode === "4543") {
            setIsCodeCorrect(true); // Unlock the page if code is correct
        } else {
            alert("Incorrect code! Please try again.");
        }
    };

    if (!isCodeCorrect) {
        return (
            <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
                <h1
                    style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#333",
                        textAlign: "center",
                        marginBottom: "20px",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        fontFamily: "'Roboto', sans-serif",
                        textShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <ComingSoonPage />
                    Enter Access Code 

                </h1>

                <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    placeholder="Enter 4-digit code"
                    style={{
                        padding: "12px 16px",
                        fontSize: "18px",
                        marginBottom: "15px",
                        width: "100%",
                        borderRadius: "8px",
                        border: "2px solid #ccc",
                        backgroundColor: "#f4f4f4",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                        outline: "none",
                        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
                    onBlur={(e) => e.target.style.borderColor = "#ccc"}
                />
                <button
                    onClick={handleCodeSubmit}
                    style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginTop: "10px",
                    }}
                >
                    Submit
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "960px", margin: "auto", padding: "20px", fontFamily: "'Courier New', monospace", backgroundColor: "#f9f9f9" }}>
            <h1 style={{ textAlign: "center", color: "#333", fontSize: "32px", fontWeight: "700", marginBottom: "20px", textTransform: "uppercase" }}>
                Notes ({currentYear})
            </h1>

            {/* Note style toolbar */}
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                {/* Font Style Selector */}
                <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)} style={{ padding: "8px", fontSize: "14px", marginBottom: "10px", flex: "1" }}>
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                </select>

                {/* Font Size Selector */}
                <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} style={{ padding: "8px", fontSize: "14px", marginBottom: "10px", flex: "1" }}>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="24px">24px</option>
                </select>

                {/* Text Color Selector */}
                <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    style={{ padding: "5px", cursor: "pointer", marginBottom: "10px", flex: "1" }}
                />

                {/* Font Weight Selector */}
                <select value={fontWeight} onChange={(e) => setFontWeight(e.target.value)} style={{ padding: "8px", fontSize: "14px", marginBottom: "10px", flex: "1" }}>
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="medium">Medium</option>
                </select>
            </div>

            {/* Note creation form */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: "30px", border: "1px solid #ddd", fontFamily: fontStyle }}>
                <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write your note here..."
                    style={{
                        width: "100%",
                        height: "200px",
                        padding: "10px",
                        fontSize: fontSize,
                        color: fontColor,
                        fontWeight: fontWeight,
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        outline: "none",
                        resize: "none",
                        fontFamily: fontStyle,
                    }}
                />
                <button
                    onClick={handleAddNote}
                    style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginTop: "10px",
                    }}
                >
                    Add Note
                </button>
            </div>

            {/* Notes Display */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                notes.length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: "0" }}>
                        {notes.map((note) => (
                            <li
                                key={note.id}
                                style={{
                                    backgroundColor: "#fff",
                                    marginBottom: "20px",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                    border: "1px solid #ddd",
                                    fontFamily: fontStyle,
                                    fontSize: fontSize,
                                    color: fontColor,
                                    fontWeight: fontWeight,
                                }}
                            >
                                <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>
                                    {note.title}
                                </h2>
                                <p>{note.content}</p>
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    style={{
                                        backgroundColor: "#ff4d4d",
                                        color: "#fff",
                                        padding: "5px 15px",
                                        borderRadius: "5px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        marginTop: "10px",
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notes found</p>
                )
            )}
        </div>
    );
};

export default NotesPage;
