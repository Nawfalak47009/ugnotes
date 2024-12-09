"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter for navigation
import { db } from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import { Button } from '@/components/ui/button';
import { Loader2Icon, Copy, Trash, ArrowLeft } from 'lucide-react';  // Import necessary icons
import { desc } from 'drizzle-orm';  // Import desc() for descending order
import { eq } from 'drizzle-orm/expressions';  // Explicitly import eq from drizzle-orm/expressions

const HistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();  // Initialize useRouter hook

  // Fetch history data
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Fetch and sort in descending order by `createdAt` (newest first)
        const result = await db.select().from(AIOutput).orderBy(desc(AIOutput.createdAt));  
        console.log("Fetched history:", result);  // Log fetched data to check order
        setHistory(result);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  // Function to handle copying AI response to clipboard
  const handleCopy = (aiResponse: string) => {
    navigator.clipboard.writeText(aiResponse).then(() => {
      alert('AI Response copied to clipboard!');
    }).catch((err) => {
      console.error('Error copying text:', err);
    });
  };

  // Function to handle deleting history entry
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this history entry?");
    if (confirmDelete) {
      try {
        // Use eq method for comparison within the where clause
        await db.delete(AIOutput).where(eq(AIOutput.id, id));  // Correct comparison method using eq from drizzle-orm/expressions
        setHistory(history.filter(entry => entry.id !== id));  // Remove from local state
        alert("History entry deleted successfully!");
      } catch (error) {
        console.error("Error deleting history entry:", error);
        alert("Failed to delete the entry.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50">
      <div className="flex items-center mb-6">
        {/* Back Button */}
        <Button 
          onClick={() => router.back()}  // Navigate back to the previous page
          className="flex gap-2 items-center bg-black text-white hover:bg-gray-700 rounded-md px-4 py-2 text-sm transition"
        >
          Back
        </Button>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">AI Response History</h1>
      <div className="space-y-6">
        {history.length === 0 ? (
          <div className="text-center text-gray-500">No history found.</div>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 p-6 rounded-lg shadow-xl border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{entry.templateSlug}</h2>
                <div className="text-sm text-gray-500">{entry.createdAt}</div>
              </div>
              <div className="mt-2">
                <p className="text-gray-600">Created by: <span className="font-medium">{entry.createdBy}</span></p>
              </div>

              {/* Display AI Response with Title and Paragraph Structure */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-700">AI Response:</h3>
                <div className="text-sm text-gray-800 mt-2">
                  {entry.aiResponse.split("\n").map((line: string, index: number) => (
                    <p key={index} className="my-2">{line}</p>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-between gap-4">
                <Button 
                  onClick={() => handleCopy(entry.aiResponse)} 
                  className="flex gap-2 items-center bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2 text-sm transition"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                
                <Button 
                  onClick={() => handleDelete(entry.id)} 
                  className="flex gap-2 items-center bg-red-600 text-white hover:bg-red-700 rounded-md px-4 py-2 text-sm transition"
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
