import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  assignRoleSchema,
  updateStatusSchema,
} from "../ValidateSchema/userSchema.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
 
    const data = updateUserSchema.parse(req.body);
 
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...data },
      { new: true }
    ).select("-password");
 
    if (!user) return res.status(404).json({ message: "User not found" });
 
    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const assignRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { role } = assignRoleSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Role updated", user });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateUserStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { isActive } = updateStatusSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, user });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};