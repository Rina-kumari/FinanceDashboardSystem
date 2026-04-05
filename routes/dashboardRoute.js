import express from "express";
import {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
  getWeeklyTrends,
} from "../controller/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/Authorize.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/summary", authorize("viewer", "analyst", "admin"), getSummary);
router.get("/recent", authorize("viewer", "analyst", "admin"), getRecentActivity);

router.get("/categories", authorize("analyst", "admin"), getCategoryTotals);
router.get("/monthly", authorize("analyst", "admin"), getMonthlyTrends);
router.get("/weekly", authorize("analyst", "admin"), getWeeklyTrends);

export default router;