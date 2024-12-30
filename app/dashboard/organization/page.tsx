"use client";
import { useEffect, useState } from "react";
import { db } from "../../../utils/db"; // Adjust this according to your file structure
import { Notes } from "../../../utils/schema"; // Correct path to your Notes table definition
import { eq } from "drizzle-orm"; // Import eq from drizzle-orm for proper comparisons
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import ComingSoonPage from "../Comingsoon/comingsoonPage";

const OrganizationPage = () => {
    const [notes, setNotes] = useState<any[]>([]); // Adjust type based on your schema
    const [noteContent, setNoteContent] = useState<string>(""); // For capturing note input
    const [loading, setLoading] = useState<boolean>(true); // For loading state
    const [fontStyle, setFontStyle] = useState<string>("Arial"); // Track font family
    const [fontSize, setFontSize] = useState<string>("16px"); // Track font size
    const [fontColor, setFontColor] = useState<string>("#000000"); // Track text color
    const [fontWeight, setFontWeight] = useState<string>("normal"); // Track font weight
    const [enteredCode, setEnteredCode] = useState<string>(""); // State for the entered code
    const [isCodeCorrect, setIsCodeCorrect] = useState<boolean>(false); // Flag to check if the code is correct

    // Get the current organizationId from Clerk's context
    const { organization, isLoaded } = useOrganization();

    const currentYear = new Date().getFullYear(); // Get current year

    useEffect(() => {
        // If the organization is loaded, fetch the notes for that organization
        if (isLoaded && organization && isCodeCorrect) {
            fetchNotes(organization.id); // Fetch notes based on the organizationId
        }
    }, [organization, isLoaded, isCodeCorrect]); // Refetch when the organization or code status changes

    // Function to fetch notes from the database
    const fetchNotes = async (organizationId: string) => {
        setLoading(true);
        try {
            const fetchedNotes = await db
                .select()
                .from(Notes)
                .where(eq(Notes.organizationId, organizationId)) // Corrected eq usage
                .execute();
            setNotes(fetchedNotes);
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
            if (organization) {
                await db.insert(Notes).values({
                    noteContent: noteContent, // Save as plain text
                    organizationId: organization.id, // Use the current organization's ID
                    createdBy: "admin", // Replace with actual user ID or session information
                    createdAt: new Date(),
                    userId: "user-id", // Replace with actual user ID
                }).execute(); // Execute the insert
                setNoteContent(""); // Reset note content after adding
                fetchNotes(organization.id); // Re-fetch notes to include the newly added one
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
                fetchNotes(organization?.id || ""); // Re-fetch the notes after deletion
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
                        fontSize: "32px",  // Larger font size for better visibility
                        fontWeight: "700",  // Bold font weight for emphasis
                        color: "#333",  // Dark gray text color for contrast
                        textAlign: "center",  // Centered alignment for symmetry
                        marginBottom: "20px",  // Space below the title
                        textTransform: "uppercase",  // Uppercase for a strong title presence
                        letterSpacing: "2px",  // Slightly increased letter spacing for a clean look
                        fontFamily: "'Roboto', sans-serif",  // Modern, clean font family
                        textShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",  // Subtle shadow to add depth
                    }}
                >
                    Enter Access Code
                      <ComingSoonPage />
                </h1>

                <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    placeholder="Enter 4-digit code"
                    style={{
                        padding: "12px 16px",  // Increased padding for a larger clickable area
                        fontSize: "18px",  // Slightly larger text for better readability
                        marginBottom: "15px",  // Adjusted margin for spacing
                        width: "100%",  // Full width of the parent container
                        borderRadius: "8px",  // Rounded corners for a smoother look
                        border: "2px solid #ccc",  // Light grey border
                        backgroundColor: "#f4f4f4",  // Soft background color
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",  // Subtle shadow for depth
                        outline: "none",  // Remove default outline
                        transition: "border-color 0.3s ease, box-shadow 0.3s ease",  // Smooth transition for focus effect
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#4CAF50"}  // Green border on focus
                    onBlur={(e) => e.target.style.borderColor = "#ccc"}  // Reset to grey border when focus is lost
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
            {/* Organization Switcher */}
            <div style={{ marginBottom: "30px" }}>
                <OrganizationSwitcher />
            </div>

            <h1 style={{ textAlign: "center", color: "#333", fontSize: "32px", fontWeight: "700", marginBottom: "20px", textTransform: "uppercase" }}>
                Organization Notes ({currentYear})
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
                {/* Textarea for note input */}
                <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)} // Handle changes in the textarea
                    placeholder="Write your note here..."
                    style={{
                        width: "100%",
                        height: "150px", // Adjust the textarea height as needed
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        boxSizing: "border-box",
                        fontFamily: fontStyle,
                        fontSize: fontSize,
                        fontWeight: fontWeight,
                        color: fontColor,
                        padding: "12px",
                        boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                        resize: "vertical",
                        backgroundColor: "#fafafa",
                    }}
                />
                <div style={{ textAlign: "right", marginTop: "20px" }}>
                    <button
                        onClick={handleAddNote}
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            padding: "14px 24px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            transition: "background-color 0.3s ease",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
                    >
                        Add Note
                    </button>
                </div>
            </div>

            {/* Display loading message */}
            {loading ? (
                <p style={{ textAlign: "center", color: "#777" }}>Loading notes...</p>
            ) : (
                <div>
                    {notes.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#777", fontStyle: "italic" }}>
                            No notes available for this organization.
                        </p>
                    ) : (
                        <div>
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    style={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #ddd",
                                        padding: "20px",
                                        marginBottom: "20px",
                                        borderRadius: "12px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                        fontFamily: fontStyle,
                                        fontSize: fontSize,
                                        fontWeight: fontWeight,
                                    }}
                                >
                                    <div style={{ fontSize: "18px", color: "#333", fontWeight: "bold", marginBottom: "10px" }}>
                                        Note Content:
                                    </div>
                                    <div style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
                                        {note.noteContent}
                                    </div>
                                    <div style={{ marginTop: "10px", textAlign: "right" }}>
                                        <button
                                            onClick={() => handleDeleteNote(note.id)}
                                            style={{
                                                backgroundColor: "#FF6347",
                                                color: "#fff",
                                                padding: "8px 16px",
                                                borderRadius: "8px",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrganizationPage;
