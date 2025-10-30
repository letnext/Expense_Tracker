import React, { useState } from "react";
import "../styles/DailyExpenses.css";
// import BackButton from "../components/BackButton";

const DailyExpenses = ({ transactions = [], loading, error }) => {
  if(transactions.length === 0) return <p style={{textAlign:"center",margin:"10px",fontWeight:"bold"}}>No expense data available.</p>;
  const [selectedCategory, setSelectedCategory] = useState(null);
  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p>{error}</p>;
  const expenseTx = transactions.filter((t) => t.type === "expense");
  const categories = [...new Set(expenseTx.map((t) => t.category))].map(
    (cat) => ({
      name: cat,
      transactions: expenseTx.filter((t) => t.category === cat),
    })
  );
  const handleCardClick = (category) => {
    setSelectedCategory(category);
  };
  const closeOverlay = () => setSelectedCategory(null);
  return (
    <div className="category-container">
      {/* <BackButton /> */}
      {" "}
      <h1>Expense Categories</h1>{" "}
      <div className="category-cards">
        {" "}
        {categories.map((cat, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => handleCardClick(cat)}
          >
            {" "}
            <h2>{cat.name}</h2> <p >{cat.transactions.length} Transaction</p>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {/* Overlay showing transactions for selected category */}{" "}
      {selectedCategory && (
        <div className="overlay">
          {" "}
          <div className="overlay-content">
            {" "}
            <button className="close-btn" onClick={closeOverlay}>
              {" "}
              ✖{" "}
            </button>{" "}
            <h2>{selectedCategory.name}</h2>{" "}
            <p >{selectedCategory.transactions.length} Transactions</p>{" "}
            <table>
              {" "}
              <thead>
                {" "}
                <tr>
                  {" "}
                  <th>#</th> <th>Date</th> <th>Amount</th> <th>Description</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                {selectedCategory.transactions.map((tx, idx) => (
                  <tr key={tx._id || idx}>
                    {" "}
                    <td>{idx + 1}</td>{" "}
                    <td>{new Date(tx.date).toLocaleDateString("en-GB")}</td>{" "}
                    <td>₹{tx.amount.toFixed(2)}</td>{" "}
                    <td>{tx.description || "—"}</td>{" "}
                  </tr>
                ))}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default DailyExpenses;
