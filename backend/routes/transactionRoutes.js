import express from "express";
import {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/add", addTransaction);          // Create
router.get("/get", getTransactions);          // Read all
router.get("/:id", getTransactionById);    // Read one
router.put("/edit/:id", updateTransaction);
router.delete("/del/:id", deleteTransaction);
 

export default router;
