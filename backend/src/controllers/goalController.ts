import { Request, Response } from 'express';
import Goal from '../models/goal';


//Create a new goal
export const createGoal = async (req: Request, res: Response) => {
    try {
        const { title, description, deadline } = req.body;
        
        if (!title || !description || !deadline) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        const newGoal = new Goal({
            title,
            description,
            deadline,
            status: 'active',
            createdAt: new Date().toISOString()
        });

        const savedGoal = await newGoal.save();

        res.status(201).json({ 
            success: true, 
            data: savedGoal 
        });

    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating goal',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};



export const getAllGoals = async (req: Request, res: Response) => {
    try {
        const goals = await Goal.find();
        res.json({ 
            success: true, 
            data: goals 
        });
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching goals',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};



//getGoalList by userid
//for the homepage, like every user will have a goal list that be presented
export const getGoalById = async (req: Request, res: Response) => {
    try {
        const goalId = req.params.id;
        const goal = await Goal.findById(goalId);
        
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        res.json({
            success: true,
            data: goal
        });
    } catch (error) {
        console.error('Error fetching goal:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching goal',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

//edit goal - search the goal by is and update 
export const updateGoal = async (req: Request, res: Response) => {
    try {
        const goalId = req.params.id;
        const updates = req.body;

        const updatedGoal = await Goal.findByIdAndUpdate(
            goalId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedGoal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        res.json({
            success: true,
            data: updatedGoal
        });
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating goal',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

//delete a goal when user don't need it 
export const deleteGoal = async (req: Request, res: Response) => {
    try {
        const goalId = req.params.id;
        const deletedGoal = await Goal.findByIdAndDelete(goalId);

        if (!deletedGoal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        res.json({
            success: true,
            message: 'Goal successfully deleted',
            data: deletedGoal
        });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting goal',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};