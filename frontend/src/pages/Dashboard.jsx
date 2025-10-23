import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import CategoryLinegraph from "../components/CategoryLinegraph";
import Footer from "../components/Footer";
import PieChart from "../components/PieChart";
import { GiCash } from "react-icons/gi";
import { FcCurrencyExchange } from "react-icons/fc";
import { BsGraphDownArrow } from "react-icons/bs";

const Dashboard = ({ transactions = [], loading, error }) => {
  console.log(transactions)
  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  // ✅ Total expense
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // ✅ Total income (excluding Manual Deposit)
  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.category !== "Manual Deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  // ✅ Manual Deposit amount (added directly to balance)
  const manualDeposit = transactions
    .filter((t) => t.type === "income" && t.category === "Manual Deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  // ✅ Total balance
  const totalBalance = totalIncome + manualDeposit - totalExpense;

  

  return (
    <>
      <div className="credit_deb_container">
        <div className="card" >
          <div className="icons-css">
            <GiCash />
          </div>
          <h3>Total Balance</h3>
          <p className={totalBalance < 0 ? "negative-balance" : ""}>
    ₹{totalBalance.toFixed(2)}
  </p>
        </div>
        <div className="card">
  <div className="icons-css">
    <FcCurrencyExchange />
  </div>
  <h3>Total Income</h3>
  <p className="positive">₹{totalIncome.toFixed(2)}</p>
</div>

        <div className="card">
          <div className="icons-css">
            <BsGraphDownArrow />
          </div>
          <h3>Total Expense</h3>
          <p>₹{totalExpense.toFixed(2)}</p>
        </div>
      </div>

      <div className="graph-section">
        <PieChart transactions={transactions}/>
        <CategoryLinegraph transactions={transactions} />
      </div>
    </>
  );
};

export default Dashboard;
