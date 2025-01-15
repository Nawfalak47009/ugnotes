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

  // Calculate the total amount spent
  const totalAmount = expenseList.reduce((total, expense) => total + expense.amount, 0);

  // Chart data preparation
  const chartData = {
    labels: expenseList.map(expense => expense.category),
    datasets: [
      {
        label: "Expenses",
        data: expenseList.map(expense => expense.amount),
        backgroundColor: ['#FF8C00', '#3498db', '#2ecc71', '#f39c12', '#e74c3c'], // Vibrant colors
        borderColor: ['#FF8C00', '#3498db', '#2ecc71', '#f39c12', '#e74c3c'],
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
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-500 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-gray-800">Expenses Tracker</h1>
          <p className="text-lg text-gray-600 mt-2">Track and manage your expenses efficiently and visually.</p>
        </div>

        {isSignedIn ? (
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Input
                type="text"
                placeholder="Enter expense name"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <Input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={handleAddExpense}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all"
              >
                {editExpenseId ? "Update" : "Add"} Expense
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all"
              >
                Download PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Please log in to track your expenses.</div>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {/* Total Amount */}
        <div className="text-center py-6 bg-indigo-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Total Expenses</h2>
          <p className="text-3xl font-bold text-indigo-700">${totalAmount.toFixed(2)}</p>
        </div>

        {/* Expense List as Table */}
        <div className="overflow-x-auto mb-8">
          {expenseList.length > 0 ? (
            <table className="min-w-full table-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Expense Name</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
  {expenseList.map((expense) => (
    <tr key={expense.id} className="border-b hover:bg-gray-50">
      <td className="px-6 py-4">{expense.name}</td>
      <td className="px-6 py-4">${expense.amount.toFixed(2)}</td>
      <td className="px-6 py-4">{expense.category}</td>
      <td className="px-6 py-4">{dayjs(expense.date).format("MMMM D, YYYY")}</td>
      <td className="px-6 py-4">
        <div className="flex justify-start space-x-2">
          <Button
            onClick={() => {
              setExpenseName(expense.name);
              setAmount(expense.amount.toString());
              setCategory(expense.category);
              setDate(expense.date);
              setEditExpenseId(expense.id);
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteExpense(expense.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          ) : (
            <p className="text-center text-gray-600">No expenses found.</p>
          )}
        </div>

        {/* Charts */}
        <div className="flex justify-center items-center mb-6">
          <Button onClick={() => setShowPieChart(!showPieChart)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all">
            Toggle Chart View
          </Button>
        </div>

        {showPieChart ? (
          <div className="max-w-xl mx-auto">
            <Pie data={chartData} options={{ responsive: true }} />
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesTracker;
