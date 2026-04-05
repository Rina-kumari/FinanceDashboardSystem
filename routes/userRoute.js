import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  assignRole,
  updateUserStatus,
  deleteUser,
} from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", authMiddleware, getAllUsers);
router.put("/:id", authMiddleware, updateUser);
router.put("/:id/role", authMiddleware, assignRole);
router.put("/:id/status", authMiddleware, updateUserStatus);
router.delete("/:id", authMiddleware, deleteUser);

export default router;