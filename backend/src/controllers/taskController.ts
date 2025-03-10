import { Request, Response } from "express";
import mongoose from 'mongoose';
import Task from "../models/Task";
import Goal from "../models/goal";
import { AuthRequest } from '../middleware/auth';
// Get all tasks
export const getAllTasks = async (req: AuthRequest, res: Response) => {
    try {
        // Filter by user_id if provided in query
        if (req.user === undefined) {
            throw new Error("User does not exist");
        }
        const tasks = await Task.find({ user_id: req.user?.id })
            .populate('goal_id', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Tasks retrieved successfully",
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Create Task
export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { description, name, goal_id, deadline, recurrs, recurringUnit } = req.body;
        const user_id = req.user?.id;
        console.log("User ID from token:", user_id);

        // Validate required fields
        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!goal_id) {
            return res.status(400).json({ message: "Goal ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(goal_id)) {
            return res.status(400).json({ message: "Invalid goal ID format" });
        }

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }


        const newTask = new Task({
            description,
            name,
            goal_id,
            user_id,
            recurrs: recurrs || false, // Default to non-recurring
            recurringUnit: recurringUnit || null,
            deadline: deadline ? new Date(deadline) : undefined
        });
        const savedTask = await newTask.save();

        // // Update goal completion status
        // const goal = await Goal.findById(goal_id);
        // if (goal) {
        //     await goal.checkCompletion();
        // }

        res.status(201).json({
            message: "Task created successfully",
            savedTask
        });
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Update Task
export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { task_id } = req.params;
        const { name, description, isCompleted, goal_id, deadline, recurrs, recurringUnit } = req.body;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(task_id)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const task = await Task.findById(task_id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
            return res.status(404).json({ message: "Task not found" });
        }
        if (name !== undefined) task.name = name;
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
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Mark task as complete
export const completeTask = async (req: AuthRequest, res: Response) => {
    try {
        const { task_id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(task_id)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const task = await Task.findById(task_id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.isCompleted = true;
        await task.save();

        // Update associated goal completion status
        if (task.goal_id) {
            const goal = await Goal.findById(task.goal_id);
            if (goal) {
                await goal.checkCompletion();
            }
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Error completing task:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a specific task by ID
export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { task_id } = req.params;
        // Validate that id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(task_id)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const task = await Task.findByIdAndDelete(task_id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // If the task is linked to a goal, check if it's the last task for that goal
        if (task.goal_id) {
            // Count remaining tasks for this goal
            const remainingTasksCount = await Task.countDocuments({ goal_id: task.goal_id });

            if (remainingTasksCount === 0) {
                // This was the last task for the goal, delete the goal
                const deletedGoal = await Goal.findByIdAndDelete(task.goal_id);

                return res.status(200).json({
                    message: "Task and associated goal successfully deleted",
                    deletedTask: task,
                    deletedGoal: deletedGoal
                });
            } else {
                // Still has tasks, just update goal completion status
                const goal = await Goal.findById(task.goal_id);
                if (goal) {
                    await goal.checkCompletion();
                }
            }
        }

        res.status(200).json({
            message: "Task successfully deleted",
            deletedTask: task
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete all completed tasks
export const deleteCompletedTasks = async (req: AuthRequest, res: Response) => {
    try {
        // Filter for user_id if provided in query
        const filter: any = { isCompleted: true };
        if (req.query.user_id) {
            filter.user_id = req.query.user_id;
        }

        // Find all completed tasks first (to check for goal updates later)
        const completedTasks = await Task.find(filter);

        // Extract goal IDs to update after deletion
        const goalIds = [...new Set(completedTasks
            .filter(task => task.goal_id)
            .map(task => task.goal_id.toString()))];

        // Delete all completed tasks
        const deleteResult = await Task.deleteMany(filter);

        // Update completion status for affected goals
        for (const goalId of goalIds) {
            const goal = await Goal.findById(goalId);
            if (goal) {
                await goal.checkCompletion();

                // Check if any tasks remain for this goal
                const remainingTasksCount = await Task.countDocuments({ goal_id: goalId });
                if (remainingTasksCount === 0) {
                    // No tasks left for this goal, delete it
                    await Goal.findByIdAndDelete(goalId);
                }
            }
        }

        res.status(200).json({
            message: "Completed tasks deleted successfully",
            count: deleteResult.deletedCount,
            affectedGoals: goalIds.length
        });
    } catch (error) {
        console.error("Error deleting completed tasks:", error);
        res.status(500).json({ message: "Server error", error });
    }
};