import express from "express";
import {
    completeTask,
    deleteCompletedTasks,
    deleteTask,
    createTask,
    updateTask
} from "../controllers/taskController";

const router = express.Router();

router.post("/", createTask);
router.patch("/:task_id", updateTask);
router.delete("/:task_id", deleteTask);
router.delete("/completed", deleteCompletedTasks);
router.patch('/:task_id/complete', completeTask);

export default router;