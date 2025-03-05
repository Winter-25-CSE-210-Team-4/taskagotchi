import { Request, Response } from "express";
import Task from "../models/Task";
import Goal from "../models/goal";

// Create Task
export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, goal_id, deadline, user_id, recurrs, recurringUnit } = req.body;

        // Create task object with all fields
        const taskData: any = {
            title,
            description: description || "",
            goal_id,
            user_id: user_id || 1, // Default user_id if not provided
            recurrs: recurrs || false, // Default to non-recurring
            recurringUnit: recurringUnit || null
        };

        // Only add deadline if provided
        if (deadline) {
            taskData.deadline = new Date(deadline);
        }

        const task = new Task(taskData);
        await task.save();

        res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Update Task
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { task_id } = req.params;
        const { title, description, isCompleted, goal_id, deadline, recurrs, recurringUnit } = req.body;

        const task = await Task.findOne({ task_id: Number(task_id) });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (isCompleted !== undefined) task.isCompleted = isCompleted;
        if (goal_id !== undefined) task.goal_id = goal_id;

        // Handle deadline
        if (deadline === null) {
            task.deadline = undefined;
        } else if (deadline) {
            task.deadline = new Date(deadline);
        }

        if (recurrs !== undefined) task.recurrs = recurrs;
        if (recurringUnit !== undefined) task.recurringUnit = recurringUnit;

        await task.save();

        // If completion status changed and task has a goal, update goal completion
        if (isCompleted !== undefined && task.goal_id) {
            const goal = await Goal.findById(task.goal_id);
            if (goal) {
                await goal.checkCompletion();
            }
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Mark task as complete
export const completeTask = async (req: Request, res: Response) => {
    try {
        const { task_id } = req.params;
        const task = await Task.findOne({ task_id: Number(task_id) });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.isCompleted = true;
        await task.save();

        if (task.goal_id) {
            const goal = await Goal.findById(task.goal_id);
            if (goal) {
                await goal.checkCompletion();
            }
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete all completed tasks
export const deleteCompletedTasks = async (req: Request, res: Response) => {
    try {
        const result = await Task.deleteMany({ isCompleted: true });
        res.status(200).json({ message: `${result.deletedCount} completed tasks deleted` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a specific task by task_id
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { task_id } = req.params;
        const task = await Task.findOneAndDelete({ task_id: Number(task_id) });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // If the task is linked to a goal, update the goal's completion status
        if (task.goal_id) {
            const goal = await Goal.findById(task.goal_id);
            if (goal) {
                await goal.checkCompletion();
            }
        }

        res.status(200).json({
            message: "Task successfully deleted",
            deletedTask: task
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};