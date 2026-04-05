import Transaction from "../models/transactionModel.js";


export const getSummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const income = result.find((r) => r._id === "income")?.total || 0;
    const expense = result.find((r) => r._id === "expense")?.total || 0;
    const balance = income - expense;

    res.status(200).json({ income, expense, balance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getCategoryTotals = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getRecentActivity = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(10);

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getMonthlyTrends = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getWeeklyTrends = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            week: { $week: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};