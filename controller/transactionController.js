import Transaction from "../models/transactionModel.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
  filterTransactionSchema,
} from "../ValidateSchema/transactionSchema.js";


export const createTransaction = async (req, res) => {
  try {
    const data = createTransactionSchema.parse(req.body);

    const transaction = await Transaction.create({
      ...data,
      user: req.user._id,
    });

    res.status(201).json({ message: "Transaction created", transaction });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json({ count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const filterTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = filterTransactionSchema.parse(req.query);

    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.status(200).json({ count: transactions.length, transactions });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateTransaction = async (req, res) => {
  try {
    const data = updateTransactionSchema.parse(req.body);

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { ...data },
      { returnDocument: "after" }
    );

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ message: "Transaction updated", transaction });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};