import express from "express";
import { completeTask, deleteCompletedTasks } from "../controllers/taskController";

const router = express.Router();

// mark task as complete
router.put("/:task_id/complete", completeTask);

// delete completed tasks
router.delete("/completed", deleteCompletedTasks);

export default router;
