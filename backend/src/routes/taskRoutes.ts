import express from "express";
import {
    createTask,
    getAllTasks,
    getTasksByUserId,
    getTaskById,
    updateTask,
    deleteTask,
    completeTask,
    deleteCompletedTasks,
    getTasksSortedByDeadline
} from "../controllers/taskController";

const router = express.Router();

// Create new task
router.post("/", createTask);

// Get all tasks
router.get("/", getAllTasks);

router.get('/bydeadline', getTasksSortedByDeadline);

// Get task by ID
router.get("/:id", getTaskById);

// Get tasks by user ID
router.get("/user/:user_id", getTasksByUserId);

// Update task
router.put("/:id", updateTask);

// Delete completed tasks
router.delete("/completed", deleteCompletedTasks);

// Delete task
router.delete("/:id", deleteTask);

// Mark task as complete
router.patch("/:id/complete", completeTask);  // 保留这个，与其他路由保持一致使用 :id

export default router;
