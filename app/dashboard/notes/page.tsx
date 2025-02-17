"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { db } from "../../../utils/db";
import { Notes } from "../../../utils/schema";
import { eq } from "drizzle-orm";

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
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [fontStyle, setFontStyle] = useState<string>("Arial");
  const [fontSize, setFontSize] = useState<string>("16px");
  const [fontColor, setFontColor] = useState<string>("#000000");
  const [fontWeight, setFontWeight] = useState<string>("normal");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusMessageColor, setStatusMessageColor] = useState<string>("#4CAF50");

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

  const handleAddNote = async () => {
    const finalTitle = noteTitle.trim() ? noteTitle : "Untitled Note";

    if (!finalTitle.trim() || !noteContent.trim()) {
      setStatusMessage("Please enter both a title and content for the note.");
      setStatusMessageColor("#FF5733");
      setTimeout(() => setStatusMessage(""), 3000);
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

        setStatusMessage("Note successfully added!");
        setStatusMessageColor(generateRandomColor());
        setTimeout(() => setStatusMessage(""), 3000);

        setNoteTitle("");
        setNoteContent("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      setStatusMessage("Error adding note. Please try again.");
      setStatusMessageColor("#FF5733");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        fontFamily: "'Inter', sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "auto",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#333",
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "20px",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
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

        {/* Note Input Section */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            marginBottom: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
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
              border: "1px solid rgba(0, 0, 0, 0.1)",
              marginBottom: "10px",
              outline: "none",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(5px)",
            }}
          />
        </div>

        {/* Font Customization */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <select
            value={fontStyle}
            onChange={(e) => setFontStyle(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(5px)",
              flex: "1 1 150px",
            }}
          >
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>

          <input
            type="number"
            value={parseInt(fontSize)}
            onChange={(e) => setFontSize(`${e.target.value}px`)}
            placeholder="Font Size"
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(5px)",
              flex: "1 1 100px",
            }}
          />

          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(5px)",
              flex: "1 1 80px",
            }}
          />

          <select
            value={fontWeight}
            onChange={(e) => setFontWeight(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(5px)",
              flex: "1 1 120px",
            }}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="italic">Italic</option>
          </select>
        </div>

        {/* Note Content Section */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
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
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              outline: "none",
              resize: "none",
              fontFamily: fontStyle,
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(5px)",
            }}
          />
          <button
            onClick={handleAddNote}
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "10px",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#45a049")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#4CAF50")}
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;