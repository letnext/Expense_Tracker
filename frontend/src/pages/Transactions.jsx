import React, { useState } from "react";
import "../styles/RecentTransactions.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Transactions = ({ transactions = [], loading, error, filterType = null }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Apply filter (income/expense)
  const filteredData = filterType
    ? transactions.filter((tx) => tx.type === filterType)
    : transactions;

  // ✅ Search by amount, date, category, type, description
  const filteredTx = filteredData.filter((tx) => {
    const term = searchTerm.toLowerCase();
    return (
      tx.amount?.toString().includes(term) ||
      tx.category?.toLowerCase().includes(term) ||
      tx.description?.toLowerCase().includes(term) ||
      tx.type?.toLowerCase().includes(term) ||
      new Date(tx.date).toLocaleDateString("en-GB").includes(term)
    );
  });

  if (loading) return <p className="loading">⏳ Loading transactions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recent-transactions">
      <h2>
        {filterType
          ? `Recent ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}s`
          : "Latest activity from your account"}
      </h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search by amount, date, category, type or note..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredTx.length > 0 ? (
            filteredTx.map((tx, index) => (
              <tr key={tx._id || index}>
                <td>#{index + 1}</td>
                <td>{new Date(tx.date).toLocaleDateString("en-GB")}</td>
                <td>
                  <span className={`badge ${tx.type}`}>
                    {tx.type === "income" ? <FaArrowDown /> : <FaArrowUp />} {tx.type}
                  </span>
                </td>
                <td>{tx.category}</td>
                <td className={tx.type === "income" ? "income" : "expense"}>
                  {tx.type === "income"
                    ? `+₹${tx.amount.toFixed(2)}`
                    : `-₹${tx.amount.toFixed(2)}`}
                </td>
                <td>{tx.description || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
