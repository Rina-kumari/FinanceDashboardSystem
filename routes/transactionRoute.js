import express from "express";
import {
   createTransaction,
  getTransactions,
  getTransaction,
  filterTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controller/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/Authorize.js";

const router = express.Router();

router.use(authMiddleware);
 
router.get("/", authorize("viewer", "analyst", "admin"), getTransactions);
router.get("/filter", authorize("viewer", "analyst", "admin"), filterTransactions);
router.get("/:id", authorize("viewer", "analyst", "admin"), getTransaction);
 
router.post("/", authorize("admin"), createTransaction);
router.put("/:id", authorize("admin"), updateTransaction);
router.delete("/:id", authorize("admin"), deleteTransaction);

export default router;