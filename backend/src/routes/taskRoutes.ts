import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  deleteCompletedTasks,
  getAllTasks
} from "../controllers/taskController";
import { auth } from '../middleware/auth';

const router = express.Router();

// Interactions
router.get("/", auth, getAllTasks);
router.post("/", auth, createTask);
router.patch("/:task_id", auth, updateTask);
router.patch("/:task_id/complete", auth, completeTask);
router.delete("/:task_id", auth, deleteTask);
router.delete("/completed", auth, deleteCompletedTasks);

export default router;