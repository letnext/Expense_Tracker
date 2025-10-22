import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "../styles/Linegraph.css";

export default function CategoryLinegraph({ transactions }) {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // ✅ Aggregate transactions by selected period
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const grouped = {};

    transactions.forEach((tx) => {
      let key;
      const date = new Date(tx.date);

      switch (selectedPeriod) {
        case "daily":
          key = date.toLocaleDateString("en-GB"); // DD/MM/YYYY
          break;
        case "weekly": {
          const firstDayOfWeek = new Date(date);
          firstDayOfWeek.setDate(date.getDate() - date.getDay());
          key = `Week of ${firstDayOfWeek.toLocaleDateString("en-GB")}`;
          break;
        }
        case "monthly":
          key = date.toLocaleString("default", { month: "short", year: "numeric" }); // e.g., "Oct 2025"
          break;
        case "yearly":
          key = date.getFullYear();
          break;
        default:
          key = date.toLocaleDateString("en-GB");
      }

      if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };

      if (tx.type === "income") grouped[key].income += Number(tx.amount);
      else grouped[key].expense += Number(tx.amount);
    });

    return Object.entries(grouped).map(([key, value]) => ({
      [selectedPeriod === "daily"
        ? "day"
        : selectedPeriod === "weekly"
        ? "week"
        : selectedPeriod === "yearly"
        ? "year"
        : "month"]: key,
      income: value.income,
      expense: value.expense,
    }));
  }, [transactions, selectedPeriod]);

  const xKey =
    selectedPeriod === "daily"
      ? "day"
      : selectedPeriod === "weekly"
      ? "week"
      : selectedPeriod === "yearly"
      ? "year"
      : "month";

  if (!transactions) return <p>⏳ Loading transactions...</p>;
  if (transactions.length === 0) return <p>No transactions to display.</p>;
  if (!chartData.length) return <p>No data to display for selected period.</p>;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Income vs Expense</h3>
        <div className="chart-buttons">
          {["daily", "weekly", "monthly", "yearly"].map((period) => (
            <button
              key={period}
              className={`chart-btn ${selectedPeriod === period ? "active" : ""}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip
            formatter={(value, name) =>
              name === "income"
                ? [`₹${value.toLocaleString()}`, "Income"]
                : [`₹${value.toLocaleString()}`, "Expense"]
            }
          />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
