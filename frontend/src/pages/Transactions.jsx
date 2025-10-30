import React, { useState } from "react";
import "../styles/RecentTransactions.css";
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import BackButton from "../components/BackButton";
import * as XLSX from "xlsx";

const API_URI = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");



const categories = {
  expense: [
    "Current Bill",
    "Water Sources",
    "Travel/Fuel",
    "Food",
    "Room Rents",
    "Maintenances",
    "Services",
    "Other Expenses",
  ],
  income: ["Training", "IT Project", "Freelance", "Manual Deposit", "Other Income"],
};

const formatINR = (amount, type) => {
  const formatted = amount.toLocaleString("en-IN");
  return type === "income" ? `+₹${formatted}` : `-₹${formatted}`;
};

const formatExportAmount = (amount, type) => {
  const formatted = amount.toLocaleString("en-IN");
  return type === "income" ? `+${formatted}` : `-${formatted}`;
};

const Transactions = ({
  transactions = [],
  loading,
  error,
  filterType = null,
  refreshTransactions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editTx, setEditTx] = useState({
    _id: "",
    date: "",
    type: "",
    category: "",
    amount: "",
    description: "",
  });

  const filteredData = filterType
    ? transactions.filter((tx) => tx.type === filterType)
    : transactions;

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

  // ---------- EXPORT FUNCTIONS ----------
  const exportPDF = () => {
    if (!filteredTx.length) return alert("No transactions to export.");
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

  const exportExcel = () => {
    if (!filteredTx.length) return alert("No transactions to export.");
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

  const handleExport = (format) => {
    setShowExportModal(false);
    if (format === "pdf") exportPDF();
    else if (format === "xlsx") exportExcel();
  };

  // ---------- DELETE ----------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_URI}/api/transactions/del/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        console.error("Delete error response:", data);
        throw new Error(data.message || "Failed to delete transaction");
      }

      alert("✅ Transaction deleted successfully!");
      await refreshTransactions();
    } catch (err) {
      console.error("❌ Error deleting transaction:", err.message);
      alert(`Error deleting transaction: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // ---------- EDIT ----------
  const handleEdit = (tx) => {
    setEditTx({
      _id: tx._id,
      date: tx.date?.slice(0, 10),
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      description: tx.description,
    });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URI}/api/transactions/edit/${editTx._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTx),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        console.error("Update error response:", data);
        throw new Error(data.message || "Failed to update transaction");
      }

      alert("✅ Transaction updated successfully!");
      setEditModal(false);
      await refreshTransactions();
    } catch (err) {
      console.error("❌ Error updating transaction:", err.message);
      alert(`Error updating transaction: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="loading">⏳ Loading transactions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recent-transactions">
      {/* <BackButton/> */}
      <h2>
        {filterType
          ? `Recent ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}s`
          : "Latest activity from your account"}
      </h2>

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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.length > 0 ? (
              filteredTx.map((tx, index) => (
                <tr key={tx._id || index}>
                  <td data-label="#">#{index + 1}</td>
                  <td data-label="Date">{new Date(tx.date).toLocaleDateString("en-GB")}</td>
                  <td data-label="Type">
                    <span className={`badge ${tx.type}`}>
                      {tx.type === "income" ? <FaArrowUp /> : <FaArrowDown />}{" "}
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td data-label="Category">{tx.category}</td>
                  <td data-label="Amount" className={tx.type === "income" ? "income" : "expense"}>
                    {formatINR(tx.amount, tx.type)}
                  </td>
                  <td data-label="Description">{tx.description || "—"}</td>
                  <td data-label="Action" className="action-buttons">
                    <button
                      className="edit-btn"
                      disabled={actionLoading}
                      onClick={() => handleEdit(tx)}
                    >
                      <FaEdit /> <span>Edit</span>
                    </button>
                    <button
                      className="delete-btn"
                      disabled={actionLoading}
                      onClick={() => handleDelete(tx._id)}
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div className="export-overlay">
          <div className="export-modal">
            <h3>Choose export format</h3>
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

      {/* EDIT MODAL */}
      {editModal && (
        <div className="export-overlay">
          <div className="export-modal">
            <h3>Edit Transaction</h3>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={editTx.date}
                onChange={(e) => setEditTx({ ...editTx, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Type:</label>
              <select
                value={editTx.type}
                onChange={(e) =>
                  setEditTx({
                    ...editTx,
                    type: e.target.value,
                    category: categories[e.target.value][0],
                  })
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category:</label>
              <select
                value={editTx.category}
                onChange={(e) => setEditTx({ ...editTx, category: e.target.value })}
              >
                {categories[editTx.type]?.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                value={editTx.amount}
                onChange={(e) => setEditTx({ ...editTx, amount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={editTx.description}
                onChange={(e) => setEditTx({ ...editTx, description: e.target.value })}
              />
            </div>

            <div className="export-buttons">
              <button onClick={handleUpdate} disabled={actionLoading}>
                {actionLoading ? "Saving..." : "Save"}
              </button>
              <button className="close-modal" onClick={() => setEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
