import { Request, Response } from "express";
import mongoose from 'mongoose';
import Task from "../models/Task";
import Goal from "../models/goal";

// Get all tasks
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        // Filter by user_id if provided in query
        const filter: any = {};
        if (req.query.user_id) {
            filter.user_id = req.query.user_id;
        }

        const tasks = await Task.find(filter)
            .populate('goal_id', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Tasks retrieved successfully",
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Create Task
export const createTask = async (req: Request, res: Response) => {
    try {
        const { description, goal_id, deadline, user_id, recurrs, recurringUnit } = req.body;

        // Validate required fields
        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Validate recurringUnit if task recurrs
        if (recurrs && !recurringUnit) {
            return res.status(400).json({
                message: "For recurring tasks, please provide a recurringUnit (daily, weekly, or monthly)"
            });
        }

        if (goal_id && !mongoose.Types.ObjectId.isValid(goal_id)) {
            return res.status(400).json({ message: "Invalid goal ID format" });
        }

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Create task object with required fields
        const taskData: any = {
            description,
            user_id,
            recurrs: recurrs || false, // Default to non-recurring
            recurringUnit: recurringUnit || null
        };

        // Add goal_id if provided
        if (goal_id) {
            taskData.goal_id = goal_id;
        }


        // Validate deadline
        if (!deadline) {
            return res.status(400).json({ message: "Deadline is required" });
        }
        taskData.deadline = new Date(deadline);

        const task = new Task(taskData);
        await task.save();

        // Update goal completion status if task is associated with a goal
        if (goal_id) {
            const goal = await Goal.findById(goal_id);
            if (goal) {
                await goal.checkCompletion();
            }
        }

        res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({
            message: "Error creating task",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Get tasks by user_id
export const getTasksByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.user_id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const tasks = await Task.find({ user_id: userId })
            .populate('goal_id', 'title')
            .sort({ createdAt: -1 });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        res.status(200).json({
            message: "User tasks retrieved successfully",
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        res.status(500).json({
            message: "Error fetching user tasks",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const task = await Task.findById(taskId)
            .populate('goal_id', 'title');

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task retrieved successfully",
            task
        });
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({
            message: "Error fetching task",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Update Task
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { description, isCompleted, goal_id, deadline, recurrs, recurringUnit } = req.body;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        // Validate goal_id if provided
        if (goal_id && !mongoose.Types.ObjectId.isValid(goal_id)) {
            return res.status(400).json({ message: "Invalid goal ID format" });
        }

        // Validate recurringUnit if recurrs is true
        if (recurrs === true && !recurringUnit) {
            return res.status(400).json({
                message: "For recurring tasks, please provide a recurringUnit (daily, weekly, or monthly)"
            });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (description !== undefined) task.description = description;
        if (isCompleted !== undefined) task.isCompleted = isCompleted;
        if (goal_id !== undefined) task.goal_id = goal_id;

        // Handle deadline
        // Validate deadline
        if (!deadline) {
            return res.status(400).json({ message: "Deadline is required" });
        }
        task.deadline = new Date(deadline);


        if (recurrs !== undefined) task.recurrs = recurrs;
        if (recurringUnit !== undefined) task.recurringUnit = recurringUnit;

        await task.save();

        // If completion status changed or goal changed, update goal completion
        if ((isCompleted !== undefined || goal_id !== undefined) && task.goal_id) {
            const goal = await Goal.findById(task.goal_id);
            if (goal) {
                await goal.checkCompletion();
            }
        }

        // If old goal_id is different, update old goal completion too
        const oldGoalId = task.goal_id && goal_id && task.goal_id.toString() !== goal_id.toString()
            ? task.goal_id.toString()
            : null;

        if (oldGoalId) {
            const oldGoal = await Goal.findById(oldGoalId);
            if (oldGoal) {
                await oldGoal.checkCompletion();
            }
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({
            message: "Error updating task",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Mark task as complete
export const completeTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const task = await Task.findById(id);

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

        res.status(200).json({
            message: "Task marked as complete",
            task
        });
    } catch (error) {
        console.error("Error completing task:", error);
        res.status(500).json({
            message: "Error marking task as complete",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Delete a specific task by ID
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Validate that id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const task = await Task.findByIdAndDelete(id);

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
        res.status(500).json({
            message: "Error deleting task",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Delete all completed tasks
export const deleteCompletedTasks = async (req: Request, res: Response) => {
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
        res.status(500).json({
            message: "Error deleting completed tasks",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Get tasks sorted by deadline
export const getTasksSortedByDeadline = async (req: Request, res: Response) => {
    try {
        // Build filter object based on query parameters
        const filter: any = {};

        // Filter by user_id if provided
        if (req.query.user_id) {
            filter.user_id = req.query.user_id;
        }

        // Filter by completion status if provided
        if (req.query.isCompleted !== undefined) {
            filter.isCompleted = req.query.isCompleted === 'true';
        }

        // Determine sort order (asc or desc)
        const sortOrder = req.query.order === 'asc' ? 1 : -1;

        const tasks = await Task.find(filter)
            .populate('goal_id', 'title')
            .sort({ deadline: sortOrder });

        res.status(200).json({
            message: "Tasks retrieved and sorted by deadline",
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error('Error fetching tasks by deadline:', error);
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};