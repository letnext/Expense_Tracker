import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import DailyExpenses from "./pages/DailyExpenses";
import AddTransactions from "./components/AddTransactions";
import Investments from "./pages/Investments";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";

const AppContent = () => {
  const location = useLocation();
  const hideNavFooterRoutes = ["/", "/login"];
  const shouldHideNavFooter = hideNavFooterRoutes.includes(location.pathname);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URI = import.meta.env.VITE_BASE_URL;

  // ✅ Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URI}/api/transactions/get`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [API_URI]);

  // ✅ Fetch once on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <>
      {!shouldHideNavFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              transactions={transactions}
              loading={loading}
              error={error}
              refreshTransactions={fetchTransactions}
            />
          }
        />

        <Route
          path="/transactions"
          element={
            <Transactions
              transactions={transactions}
              loading={loading}
              error={error}
              refreshTransactions={fetchTransactions}
            />
          }
        />

        <Route
          path="/dailyexpenses"
          element={
            <DailyExpenses
              transactions={transactions}
              loading={loading}
              error={error}
              refreshTransactions={fetchTransactions}
            />
          }
        />

        <Route
          path="/addtransactions"
          element={<AddTransactions refreshTransactions={fetchTransactions} />}
        />

        <Route
          path="/investments"
          element={
            <Investments
              transactions={transactions}
              loading={loading}
              error={error}
              refreshTransactions={fetchTransactions}
            />
          }
        />
      </Routes>

      {!shouldHideNavFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
