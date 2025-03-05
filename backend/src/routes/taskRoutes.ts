import express from "express";
import {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    deleteCompletedTasks,
    getAllTasks 
} from "../controllers/taskController";

const router = express.Router();

// Interactions
router.get("/", getAllTasks);
router.post("/", createTask);
router.patch("/:task_id", updateTask);
router.patch("/:task_id/complete", completeTask);
router.delete("/:task_id", deleteTask);
router.delete("/completed", deleteCompletedTasks);

export default router;