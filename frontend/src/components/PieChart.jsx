import React, { useMemo } from "react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/PieChart.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#FF6699",
  "#33CC99",
  "#FF9933",
  "#FF3333",
];

const PieChart = ({ transactions }) => {
  // ✅ Process transactions to group expenses by category
  const data = useMemo(() => {
    if (!transactions || !transactions.length) return [];

    // Filter only expenses
    const expenses = transactions.filter((tx) => tx.type === "expense");

    // Group by category
    const grouped = {};
    expenses.forEach((tx) => {
      if (!grouped[tx.category]) grouped[tx.category] = 0;
      grouped[tx.category] += Number(tx.amount); // ensure numeric
    });

    // Convert to array for recharts
    return Object.entries(grouped).map(([category, expense]) => ({
      category,
      expense,
    }));
  }, [transactions]);

  if (!transactions) return <p>⏳ Loading chart...</p>;
  if (transactions.length === 0) return <p>No expense data to display.</p>;

  return (
    <div className="piechart-container">
      <div className="piechart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <RePieChart>
            <Pie
              data={data}
              dataKey="expense"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius="65%"
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Legend verticalAlign="bottom" height={36} />
          </RePieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;
