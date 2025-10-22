import React, { useMemo } from "react";
import "../styles/Investments.css";
import { BsGraphUpArrow } from "react-icons/bs";
import { CgSwapVertical } from "react-icons/cg";
import Transactions from "../pages/Transactions";

const Investments = ({ transactions = [], loading, error }) => {
  if (loading) return <p>Loading investments...</p>;
  if (error) return <p>{error}</p>;

  // ✅ Calculate totals (ensure numeric)
  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );

  // ✅ Profit/Loss
  const profitLoss = useMemo(() => totalIncome - totalExpense, [
    totalIncome,
    totalExpense,
  ]);

  return (
    <div className="investments">
      <div className="credit_deb_container">
        {/* Total Investments */}
        <div className="card">
          <div className="icons-css">
            <BsGraphUpArrow />
          </div>
          <h3>Total Investments</h3>
          <p className="neutral">₹{totalExpense.toFixed(2)}</p>
        </div>

        {/* Profit / Loss */}
        <div className="card">
          <div className="icons-css">
            <CgSwapVertical />
          </div>
          <h3>Profit/Loss</h3>
          <p
            className={
              profitLoss > 0
                ? "positive"
                : profitLoss < 0
                ? "negative"
                : "neutral"
            }
          >
            {profitLoss > 0
              ? `+₹${profitLoss.toFixed(2)}`
              : `₹${profitLoss.toFixed(2)}`}
          </p>
        </div>
      </div>

      <h1>Recent Expenses</h1>

      {/* Show only expense transactions */}
      <Transactions
        transactions={transactions}
        loading={loading}
        error={error}
        filterType="expense"
      />
    </div>
  );
};

export default Investments;
