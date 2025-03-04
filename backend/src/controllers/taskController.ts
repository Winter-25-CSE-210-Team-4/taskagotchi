import { Request, Response } from "express";
import Task from "../models/Task";
import Goal from "../models/goal";
// 1. mark task as complete
export const completeTask =
    async (req: Request, res: Response) => {
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

// 2. delete all completed tasks
export const deleteCompletedTasks = async (req: Request, res: Response) => {
    try {
        const result = await Task.deleteMany({ isCompleted: true });
        res.status(200).json({ message: `${result.deletedCount} completed tasks deleted` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



