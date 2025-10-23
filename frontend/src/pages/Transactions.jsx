import React, { useState } from "react";
import "../styles/RecentTransactions.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// ✅ Helper — show +₹5,623 on UI
const formatINR = (amount, type) => {
  const formatted = amount.toLocaleString("en-IN");
  return type === "income" ? `+₹${formatted}` : `-₹${formatted}`;
};

// ✅ Helper — show +5,623 in files (no ₹)
const formatExportAmount = (amount, type) => {
  const formatted = amount.toLocaleString("en-IN");
  return type === "income" ? `+${formatted}` : `-${formatted}`;
};

const Transactions = ({ transactions = [], loading, error, filterType = null }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  // ✅ Filter data
  const filteredData = filterType
    ? transactions.filter((tx) => tx.type === filterType)
    : transactions;

  // ✅ Apply search
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

  // ✅ Export PDF
  const exportPDF = () => {
    if (!filteredTx.length) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Transaction Report", 14, 15);

    const tableColumn = ["#", "Date", "Type", "Category", "Amount", "Description"];
    const tableRows = filteredTx.map((tx, index) => [
      index + 1,
      new Date(tx.date).toLocaleDateString("en-GB"),
      tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      tx.category,
      formatExportAmount(tx.amount, tx.type),
      tx.description || "—",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [230, 0, 0] },
      columnStyles: { 4: { halign: "right" } },
    });

    const date = new Date().toISOString().split("T")[0];
    doc.save(`transactions_${date}.pdf`);
  };

  // ✅ Export Excel (.xlsx)
  const exportExcel = () => {
    if (!filteredTx.length) return;

    const data = filteredTx.map((tx, index) => ({
      "#": index + 1,
      Date: new Date(tx.date).toLocaleDateString("en-GB"),
      Type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      Category: tx.category,
      Amount: formatExportAmount(tx.amount, tx.type),
      Description: tx.description || "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `transactions_${date}.xlsx`);
  };

  // ✅ Handle export format selection
  const handleExport = (format) => {
    setShowExportModal(false);
    if (format === "pdf") exportPDF();
    else if (format === "xlsx") exportExcel();
  };

  if (loading) return <p className="loading">⏳ Loading transactions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recent-transactions">
      <h2>
        {filterType
          ? `Recent ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}s`
          : "Latest activity from your account"}
      </h2>

      {/* ✅ Search bar + Export button */}
      <div className="search-export-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by amount, date, category, type or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="export-btn" onClick={() => setShowExportModal(true)}>
          Export
        </button>
      </div>

      {/* ✅ Transaction Table */}
      <div className="table-container">
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
                  <td data-label="#">#{index + 1}</td>
                  <td data-label="Date">
                    {new Date(tx.date).toLocaleDateString("en-GB")}
                  </td>
                  <td data-label="Type">
                    <span className={`badge ${tx.type}`}>
                      {tx.type === "income" ? <FaArrowUp /> : <FaArrowDown />}{" "}
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td data-label="Category">{tx.category}</td>
                  <td
                    data-label="Amount"
                    className={tx.type === "income" ? "income" : "expense"}
                  >
                    {formatINR(tx.amount, tx.type)}
                  </td>
                  <td data-label="Description">{tx.description || "—"}</td>
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

      {/* ✅ Export Overlay Modal */}
      {showExportModal && (
        <div className="export-overlay">
          <div className="export-modal">
            <h3>Choose export format</h3>
            <p>Select the file type you want to download.</p>
            <div className="export-buttons">
              <button onClick={() => handleExport("pdf")}>Export as PDF</button>
              <button onClick={() => handleExport("xlsx")}>Export as Excel</button>
            </div>
            <button className="close-modal" onClick={() => setShowExportModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;