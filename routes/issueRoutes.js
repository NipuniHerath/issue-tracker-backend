import express from "express";
import {
  createIssue,
  getAllIssues,
  updateIssue,
  deleteIssue,
  updateIssueStatus,
  getIssueStatusCount,
  getFilteredIssues,
} from "../controllers/issueController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", verifyToken, createIssue);
router.get("/stats/status", verifyToken, getIssueStatusCount);
router.get("/", verifyToken, getAllIssues);
router.get("/search", verifyToken, getFilteredIssues);
router.put("/:id", verifyToken, updateIssue);
router.delete("/:id", verifyToken, deleteIssue);
router.patch("/:id/status", verifyToken, updateIssueStatus);
export default router;
