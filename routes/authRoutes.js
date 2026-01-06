import express from "express";
import { register, login, getAllUsers } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/users", verifyToken, getAllUsers);
export default router;
