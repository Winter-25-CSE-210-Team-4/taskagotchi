import express from "express";
import { completeTask, deleteCompletedTasks } from "../controllers/taskController";

const router = express.Router();

// mark task as complete
// router.put("/:task_id/complete", completeTask);

// delete completed tasks
router.delete("/completed", deleteCompletedTasks);
router.patch('/:task_id/complete', completeTask);
export default router;
