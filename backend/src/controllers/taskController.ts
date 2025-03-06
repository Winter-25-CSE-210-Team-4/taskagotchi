import { Request, Response } from "express";
import Task from "../models/Task";
import mongoose from "mongoose";

// Create a new task
export const createTask = async (req: Request, res: Response) => {
    try {
        const { user_id, deadline, recurrs, recurringUnit, description } = req.body;

        // Validate required fields
        if (!user_id || !deadline || recurrs === undefined || !description) {
            return res.status(400).json({
                message: "Please provide all required fields: user_id, deadline, recurrs, and description"
            });
        }

        // Validate recurringUnit if task recurrs
        if (recurrs && !recurringUnit) {
            return res.status(400).json({
                message: "For recurring tasks, please provide a recurringUnit (daily, weekly, or monthly)"
            });
        }

        const newTask = new Task({
            user_id,
            deadline,
            recurrs,
            recurringUnit: recurrs ? recurringUnit : null,
            description,
            isCompleted: false
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({
            message: "Error creating task",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Get all tasks
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({
            message: "Error fetching tasks",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Get tasks by user_id
export const getTasksByUserId = async (req: Request, res: Response) => {
    try {
        const user_id = Number(req.params.user_id);
        const tasks = await Task.find({ user_id });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        res.status(500).json({
            message: "Error fetching user tasks",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Get task by task's id
export const getTaskById = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;


        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({
            message: "Error fetching task",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Update task by task_id
export const updateTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;

        //make sure taskId is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const updates = req.body;

        // Make sure we're not trying to update the task_id
        if (updates._id) {
            return res.status(400).json({ message: "Cannot change _id" });
        }

        // Validate recurringUnit if recurrs is true
        if (updates.recurrs === true && !updates.recurringUnit) {
            return res.status(400).json({
                message: "For recurring tasks, please provide a recurringUnit (daily, weekly, or monthly)"
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId, // using id to search
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({
            message: "Error updating task",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Delete task by task_id
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;

        // makesure taskId is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task successfully deleted",
            task: deletedTask
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({
            message: "Error deleting task",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};


import Goal from "../models/goal";
// 1. mark task as complete
export const completeTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id; // use id instead of task_id

        // make sure taskId is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Wrong ID " });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.isCompleted = true;
        await task.save();

        // check the status of goal if task is related to a goal
        if (task.goal_id) {
            const goal = await Goal.findById(task.goal_id);
            if (goal) {
                await goal.checkCompletion();
            }
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Error when marking task as completed:", error);
        res.status(500).json({
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown Error"
        });
    }
};

// 2. delete all completed tasks
export const deleteCompletedTasks = async (req: Request, res: Response) => {
    try {
        const result = await Task.deleteMany({ isCompleted: true });
        res.status(200).json({ message: `${result.deletedCount} completed tasks has been deleted` });
    } catch (error) {
        console.error("Error when deleting completed tasks:", error);
        res.status(500).json({
            message: "Server Error",
            error: error instanceof Error ? error.message : "UnKnown Error"
        });
    }
};
