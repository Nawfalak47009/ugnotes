"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs"; // Import useAuth hook
import { db } from "@/utils/db"; // Assuming you have a file that initializes your database connection
import { Expenses } from "@/utils/schema"; // Import the Expenses schema
import { eq } from "drizzle-orm"; // Import eq function from Drizzle ORM
import { Pie, Bar } from "react-chartjs-2"; // Import charting library
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, BarElement, Title, LinearScale } from 'chart.js';
import { jsPDF } from "jspdf"; // Import jsPDF
import autoTable from "jspdf-autotable"; // Import autoTable function
import dayjs from 'dayjs'; // Import dayjs for formatting dates

// Register required components for charting
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, BarElement, Title, LinearScale);

const ExpensesTracker: React.FC = () => {
  const { userId, isSignedIn } = useAuth();
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD")); // Set default date to today
  const [expenseList, setExpenseList] = useState<{ id: number; name: string; amount: number; category: string; date: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editExpenseId, setEditExpenseId] = useState<number | null>(null);
  const [showPieChart, setShowPieChart] = useState<boolean>(true); // Track whether to show pie chart or bar chart

  useEffect(() => {
    const fetchExpenses = async () => {
      if (isSignedIn && userId) {
        setLoading(true);
        try {
          const expenses = await db.select().from(Expenses).where(eq(Expenses.userId, userId!));
          setExpenseList(expenses.map((expense) => ({
            id: expense.id,
            name: expense.name,
            amount: Number(expense.amount),
            category: expense.category || "",
            date: expense.date || dayjs().format("YYYY-MM-DD"), // Default to today if no date is found
          })));
        } catch (error) {
          console.error("Error fetching expenses:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setExpenseList([]);
      }
    };

    fetchExpenses();
  }, [isSignedIn, userId]);

  const handleAddExpense = async () => {
    if (expenseName && amount && category && userId && date) {
      try {
        setLoading(true);
        if (editExpenseId) {
          // Update existing expense
          await db.update(Expenses).set({
            name: expenseName,
            amount: amount.toString(),
            category,
            date,
          }).where(eq(Expenses.id, editExpenseId));
        } else {
          // Add new expense
          await db.insert(Expenses).values({
            name: expenseName,
            amount: amount.toString(),
            category,
            userId: userId!,
            date,
            day: dayjs(date).format("DD"), // Assuming 'day' is a required field
          });
        }

        // Fetch updated list
        const expenses = await db.select().from(Expenses).where(eq(Expenses.userId, userId!));
        setExpenseList(
          expenses.map((expense) => ({
            id: expense.id,
            name: expense.name,
            amount: Number(expense.amount),
            category: expense.category || "",
            date: expense.date || dayjs().format("YYYY-MM-DD"), // Default to today if no date is found
          }))
        );

        // Reset fields
        setExpenseName("");
        setAmount("");
        setCategory("");
        setDate(dayjs().format("YYYY-MM-DD"));
        setEditExpenseId(null);
      } catch (error) {
        console.error("Error adding/editing expense:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      setLoading(true);
      await db.delete(Expenses).where(eq(Expenses.id, id));

      // Update list after deletion
      const expenses = await db.select().from(Expenses).where(eq(Expenses.userId, userId!));
      setExpenseList(expenses.map((expense) => ({
        id: expense.id,
        name: expense.name,
        amount: Number(expense.amount),
        category: expense.category || "",
        date: expense.date || dayjs().format("YYYY-MM-DD"),
      })));
    } catch (error) {
      console.error("Error deleting expense:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = expenseList.reduce((total, expense) => total + expense.amount, 0);

  // Chart data preparation
  const chartData = {
    labels: expenseList.map(expense => expense.category),
    datasets: [
      {
        label: "Expenses",
        data: expenseList.map(expense => expense.amount),
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'], // example colors
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Table Columns
    const columns = ["Expense Name", "Amount", "Category", "Date"];
    const rows = expenseList.map((expense) => [
      expense.name,
      `$${expense.amount.toFixed(2)}`,
      expense.category,
      dayjs(expense.date).format("MMMM D, YYYY"),
    ]);
  
    // Add the total row at the end of the table
    rows.push([
      "Total", // Row for total
      `$${totalAmount.toFixed(2)}`, // Total amount
      "", // Leave the category empty for the total row
      "", // Leave the date empty for the total row
    ]);
  
    // Add the table to the PDF
    autoTable(doc, {
      head: [columns],
      body: rows,
    });
  
    // Save the PDF
    doc.save("expenses.pdf");
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold">Expenses Tracker</h1>
          <p className="text-lg text-gray-600 mt-2">Track and manage your expenses efficiently</p>
        </div>

        {isSignedIn ? (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Enter expense name"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <Input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddExpense}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg"
                >
                  {editExpenseId ? "Update" : "Add"} Expense
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
                >
                  Download as PDF
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Please log in to track your expenses.</div>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {/* Expense List as Table */}
        <div className="overflow-x-auto mb-6">
          {expenseList.length > 0 ? (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">Expense Name</th>
                  <th className="px-4 py-2 text-left bg-gray-100">Amount</th>
                  <th className="px-4 py-2 text-left bg-gray-100">Category</th>
                  <th className="px-4 py-2 text-left bg-gray-100">Date</th>
                  <th className="px-4 py-2 text-left bg-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenseList.map((expense) => (
                  <tr key={expense.id} className="border-b">
                    <td className="px-4 py-2">{expense.name}</td>
                    <td className="px-4 py-2">${expense.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{expense.category}</td>
                    <td className="px-4 py-2">{dayjs(expense.date).format("MMMM D, YYYY")}</td>
                    <td className="px-4 py-2">
                      <Button
                        onClick={() => {
                          setExpenseName(expense.name);
                          setAmount(expense.amount.toString());
                          setCategory(expense.category);
                          setDate(expense.date);
                          setEditExpenseId(expense.id);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No expenses added yet.</p>
          )}
        </div>

        {/* Graph Toggle */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setShowPieChart(!showPieChart)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {showPieChart ? "Switch to Bar Chart" : "Switch to Pie Chart"}
          </Button>
        </div>

        {/* Expense Chart */}
        <div className="mb-6">
          {showPieChart ? (
            <Pie data={chartData} />
          ) : (
            <Bar data={chartData} />
          )}
        </div>

        {/* Total Amount */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-semibold">Total Expenses: ${totalAmount.toFixed(2)}</h2>
        </div>
      </div>
    </div>
  );
};

export default ExpensesTracker;
