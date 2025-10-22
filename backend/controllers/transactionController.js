import Transaction from "../models/transactionModel.js";

// @desc Add a new transaction
export const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newTransaction = new Transaction({
      type,
      amount,
      category,
      date,
      description,
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error: error.message });
  }
};

// @desc Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};

// @desc Get single transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction", error: error.message });
  }
};

// @desc Update transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Transaction.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction updated successfully", transaction: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error: error.message });
  }
};

// @desc Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error: error.message });
  }
};
