import { Request, Response } from "express";
import Task from "../models/Task";

// 1. mark task as complete
export const completeTask =
    async (req: Request, res: Response) => {
    try {
        const { task_id } = req.params;
        const updatedTask = await Task.findOneAndUpdate(
            { task_id: Number(task_id) },  // seach task using id
            { isCompleted: true },        // update isCompleted = true
            { new: true }                 // return updated data
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(updatedTask);
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
