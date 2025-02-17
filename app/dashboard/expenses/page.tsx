"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // For category filter
import { useAuth } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { Expenses } from "@/utils/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, BarElement, Title, LinearScale } from "chart.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { useMediaQuery } from "@mui/material";
// Ensure the import matches the table name

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, BarElement, Title, LinearScale);

const ExpensesTracker: React.FC = () => {
  const { userId, isSignedIn } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [expenseList, setExpenseList] = useState<{ id: number; name: string; amount: number; category: string; date: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editExpenseId, setEditExpenseId] = useState<number | null>(null);
  const [showPieChart, setShowPieChart] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(""); // For search by name
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all"); // For category filter
  const [startDateFilter, setStartDateFilter] = useState<string>(""); // For date range filter
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      if (isSignedIn && userId) {
        setLoading(true);
        try {
          let query = db.select().from(Expenses).where(eq(Expenses.userId, userId!));

          // Apply filters
          if (selectedCategoryFilter !== "all") {
            query = db.select().from(Expenses).where(and(eq(Expenses.userId, userId!), eq(Expenses.category, selectedCategoryFilter)));
          }
          if (startDateFilter && endDateFilter) {
            query = db.select().from(Expenses).where(and(eq(Expenses.userId, userId!), gte(Expenses.date, startDateFilter), lte(Expenses.date, endDateFilter)));
          }

          const expenses = await query;
          setExpenseList(
            expenses.map((expense) => ({
              id: expense.id,
              name: expense.name,
              amount: Number(expense.amount),
              category: expense.category || "",
              date: expense.date || dayjs().format("YYYY-MM-DD"),
            }))
          );
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
  }, [isSignedIn, userId, selectedCategoryFilter, startDateFilter, endDateFilter]);

  // Handle adding/editing expenses
  const handleAddExpense = async () => {
    if (expenseName && amount && category && userId && date) {
      try {
        setLoading(true);
        if (editExpenseId) {
          await db.update(Expenses).set({ name: expenseName, amount: amount.toString(), category, date }).where(eq(Expenses.id, editExpenseId));
        } else {
          await db.insert(Expenses).values({ name: expenseName, amount: amount.toString(), category, userId: userId!, date, day: dayjs(date).format("DD") });
        }

        // Fetch updated list
        const expenses = await db.select().from(Expenses).where(eq(Expenses.userId, userId!));
        setExpenseList(expenses.map((expense) => ({
          id: expense.id,
          name: expense.name,
          amount: Number(expense.amount),
          category: expense.category || "",
          date: expense.date || dayjs().format("YYYY-MM-DD"),
        })));

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

  // Handle deleting expenses
  const handleDeleteExpense = async (id: number) => {
    try {
      setLoading(true);
      await db.delete(Expenses).where(eq(Expenses.id, id));

      // Fetch updated list
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

  // Filter expenses by search query
  const filteredExpenses = expenseList.filter((expense) =>
    expense.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total amount
  const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Chart data
  const chartData = {
    labels: filteredExpenses.map((expense) => expense.category),
    datasets: [
      {
        label: "Expenses",
        data: filteredExpenses.map((expense) => expense.amount),
        backgroundColor: ["#FF8C00", "#3498db", "#2ecc71", "#f39c12", "#e74c3c"],
        borderColor: ["#FF8C00", "#3498db", "#2ecc71", "#f39c12", "#e74c3c"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const columns = ["Expense Name", "Amount", "Category", "Date"];
    const rows = filteredExpenses.map((expense) => [
      expense.name,
      `$${expense.amount.toFixed(2)}`,
      expense.category,
      dayjs(expense.date).format("MMMM D, YYYY"),
    ]);
    rows.push(["Total", `$${totalAmount.toFixed(2)}`, "", ""]);
    autoTable(doc, { head: [columns], body: rows });
    doc.save("expenses.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-500 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-800">Expenses Tracker</h1>
          <p className="text-sm sm:text-lg text-gray-600 mt-2">Track and manage your expenses efficiently and visually.</p>
        </div>

        {/* Expense Form */}
        {isSignedIn ? (
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Enter expense name"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={handleAddExpense}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all"
              >
                {editExpenseId ? "Update" : "Add"} Expense
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all"
              >
                Download PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Please log in to track your expenses.</div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
            <SelectTrigger className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            placeholder="Start Date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Input
            type="date"
            placeholder="End Date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Total Amount */}
        <div className="text-center py-4 bg-indigo-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Total Expenses</h2>
          <p className="text-3xl font-bold text-blue-700">${totalAmount.toFixed(2)}</p>
        </div>

        {/* Expense Table */}
        <div className="overflow-x-auto mb-8">
          {filteredExpenses.length > 0 ? (
            <table className="min-w-full table-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left">Expense Name</th>
                  <th className="px-4 sm:px-6 py-3 text-left">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left">Category</th>
                  <th className="px-4 sm:px-6 py-3 text-left">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">{expense.name}</td>
                    <td className="px-4 sm:px-6 py-4">${expense.amount.toFixed(2)}</td>
                    <td className="px-4 sm:px-6 py-4">{expense.category}</td>
                    <td className="px-4 sm:px-6 py-4">{dayjs(expense.date).format("MMMM D, YYYY")}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex justify-start space-x-2">
                        <Button
                          onClick={() => {
                            setExpenseName(expense.name);
                            setAmount(expense.amount.toString());
                            setCategory(expense.category);
                            setDate(expense.date);
                            setEditExpenseId(expense.id);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-all"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-all"
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
          <Button
            onClick={() => setShowPieChart(!showPieChart)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all"
          >
            Toggle Chart View
          </Button>
        </div>

        <div className="relative max-w-full" style={{ height: isMobile ? "300px" : "500px" }}>
          {showPieChart ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesTracker;