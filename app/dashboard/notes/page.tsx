"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { db } from "../../../utils/db";
import { Notes } from "../../../utils/schema";
import { eq } from "drizzle-orm";
import ComingSoonPage from "../ComingSoon/page";

// Function to generate a random hex color
const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const NotesPage = () => {
    const { userId } = useAuth();
    const [noteContent, setNoteContent] = useState<string>("");
    const [noteTitle, setNoteTitle] = useState<string>(""); // New state for title
    const [loading, setLoading] = useState<boolean>(true);
    const [fontStyle, setFontStyle] = useState<string>("Arial");
    const [fontSize, setFontSize] = useState<string>("16px");
    const [fontColor, setFontColor] = useState<string>("#000000");
    const [fontWeight, setFontWeight] = useState<string>("normal");
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [statusMessageColor, setStatusMessageColor] = useState<string>("#4CAF50"); // Default success color
    const [premiumCode, setPremiumCode] = useState<string>(""); // State for storing entered code
    const [isUnlocked, setIsUnlocked] = useState<boolean>(false); // State for tracking if the page is unlocked

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        if (userId) {
            fetchNotes();
        }
    }, [userId]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            if (userId) {
                const fetchedNotes = await db
                    .select()
                    .from(Notes)
                    .where(eq(Notes.userId, userId))
                    .execute();
            } else {
                console.error("User ID is undefined");
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFontSize = event.target.value;
        if (!isNaN(parseInt(newFontSize))) {
            setFontSize(`${newFontSize}px`);
        }
    };

    const handleAddNote = async () => {
        // Ensure both title and content are provided
        const finalTitle = noteTitle.trim() ? noteTitle : "Untitled Note";

        if (!finalTitle.trim() || !noteContent.trim()) {
            setStatusMessage("Please enter both a title and content for the note.");
            setStatusMessageColor("#FF5733"); // Set an error color (Red)
            setTimeout(() => {
                setStatusMessage("");
            }, 3000);
            return;
        }

        try {
            if (userId) {
                await db.insert(Notes).values({
                    userId: userId,
                    title: finalTitle,
                    content: noteContent,
                    createdAt: new Date(),
                }).execute();

                // Display success message
                setStatusMessage("Note successfully added!");
                setStatusMessageColor(generateRandomColor()); // Set a new random color for success

                // Clear message after 3 seconds
                setTimeout(() => {
                    setStatusMessage("");
                }, 3000);

                setNoteTitle(""); // Clear the title after adding the note
                setNoteContent(""); // Clear the content after adding the note
            }
        } catch (error) {
            console.error("Error adding note:", error);
            // Display error message
            setStatusMessage("Error adding note. Please try again.");
            setStatusMessageColor("#FF5733"); // Set an error color (Red)

            // Clear message after 3 seconds
            setTimeout(() => {
                setStatusMessage("");
            }, 3000);
        }
    };

    const handleUnlock = () => {
        if (premiumCode === "4543") {
            setIsUnlocked(true); // Unlock the page
            setStatusMessage("Page unlocked successfully!");
            setStatusMessageColor("#4CAF50"); // Green success color
            setTimeout(() => {
                setStatusMessage(""); // Clear status message
            }, 3000);
        } else {
            setStatusMessage("Incorrect code. Please try again.");
            setStatusMessageColor("#FF5733"); // Red error color
            setTimeout(() => {
                setStatusMessage(""); // Clear status message
            }, 3000);
        }
    };

    if (!isUnlocked) {
        return (
            <div style={{ maxWidth: "960px", margin: "auto", padding: "20px", fontFamily: "'Courier New', monospace", backgroundColor: "#f9f9f9" }}>
                <ComingSoonPage />
                <h1 style={{ textAlign: "center", color: "#333", fontSize: "32px", fontWeight: "700", marginBottom: "20px", textTransform: "uppercase" }}>
                    Enter Premium Code to Unlock Notes Page
                </h1>

                {/* Display Status Message */}
                {statusMessage && (
                    <div
                        style={{
                            marginBottom: "20px",
                            padding: "15px",
                            backgroundColor: statusMessageColor, // Apply the color
                            color: "#fff",
                            borderRadius: "8px",
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: "600",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            maxWidth: "90%",
                            margin: "0 auto",
                        }}
                    >
                        {statusMessage}
                    </div>
                )}

                <input
                    type="text"
                    value={premiumCode}
                    onChange={(e) => setPremiumCode(e.target.value)}
                    placeholder="Enter code"
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "20px",
                        fontWeight: "700",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        marginBottom: "20px",
                        outline: "none",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center", // Centers horizontally
                        alignItems: "center", // Centers vertically
                        textAlign: "center", // Aligns text in the center (optional)
                    }}
                >
                    <button
                        onClick={handleUnlock}
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        Unlock Page
                    </button>
                </div>

            </div>
        );
    }

    return (
        <div style={{ maxWidth: "960px", margin: "auto", padding: "20px", fontFamily: "'Courier New', monospace", backgroundColor: "#f9f9f9" }}>
            <h1 style={{ textAlign: "center", color: "#333", fontSize: "32px", fontWeight: "700", marginBottom: "20px", textTransform: "uppercase" }}>
                Add New Note ({currentYear})
            </h1>

            {/* Display Status Message */}
            {statusMessage && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "15px",
                        backgroundColor: statusMessageColor,
                        color: "#fff",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "600",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        maxWidth: "90%",
                        margin: "0 auto",
                    }}
                >
                    {statusMessage}
                </div>
            )}

            <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
                <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Enter note title"
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "20px",
                        fontWeight: "700",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        marginBottom: "10px",
                        outline: "none",
                    }}
                />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="fontStyle" style={{ marginRight: "10px" }}>Font Style:</label>
                <select
                    id="fontStyle"
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                    style={{ padding: "5px", marginRight: "20px" }}
                >
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Times New Roman">Times New Roman</option>
                </select>

                <label htmlFor="fontSize" style={{ marginRight: "10px" }}>Font Size:</label>
                <input
                    type="number"
                    id="fontSize"
                    value={parseInt(fontSize)}
                    onChange={(e) => setFontSize(`${e.target.value}px`)}
                    style={{ padding: "5px", width: "60px", marginRight: "20px" }}
                />

                <label htmlFor="fontColor" style={{ marginRight: "10px" }}>Font Color:</label>
                <input
                    type="color"
                    id="fontColor"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    style={{ padding: "5px", marginRight: "20px" }}
                />

                <label htmlFor="fontWeight" style={{ marginRight: "10px" }}>Font Weight:</label>
                <select
                    id="fontWeight"
                    value={fontWeight}
                    onChange={(e) => setFontWeight(e.target.value)}
                    style={{ padding: "5px" }}
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="italic">Italic</option>
                </select>
            </div>

            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    marginBottom: "30px",
                    border: "1px solid #ddd",
                    fontFamily: fontStyle,
                }}
            >
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
        </div>
    );
};

export default NotesPage;
