import React, { useState } from "react";
import "../styles/AddTransactions.css";
import { useNavigate } from "react-router-dom";

const AddTransactions = ({ refreshTransactions }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const [open, setOpen] = useState(true);

  const API_URI = import.meta.env.VITE_BASE_URL;

  const apiUrl =`${API_URI}/api/transactions/add`; // endpoint

  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Transaction saved successfully!");

        // Reset form
        setFormData({ type: "expense", amount: "", category: "", date: "", description: "" });

        // ✅ Refresh parent state
        if (refreshTransactions) await refreshTransactions();

        // Navigate after refresh
        navigate("/transactions");
      } else {
        console.error("❌ Server error:", data);
        alert(data.message || "Transaction failed! Check your backend logs.");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("⚠️ Failed to connect to backend. Is your server running?");
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/transactions"); // Use navigate instead of window.location
  };

  if (!open) return null;

  return (
    <div className="add-transaction-container">
      <div className="popup-content page-mode">
        <div className="popup-header">
          <h2>Add New Transaction</h2>
          <p className="popup-subtitle">Track your income and expenses</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <div className="type-selector">
                <button
                  type="button"
                  className={`type-btn ${formData.type === "income" ? "active income" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, type: "income", category: "" }))}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`type-btn ${formData.type === "expense" ? "active expense" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, type: "expense", category: "" }))}
                >
                  Expense
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                {categories[formData.type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add notes about this transaction (optional)"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactions;
