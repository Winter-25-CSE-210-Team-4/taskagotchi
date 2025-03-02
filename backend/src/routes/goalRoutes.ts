import express from 'express';
import { createGoal, 
    getAllGoals, 
    getGoalById,
    updateGoal,
    deleteGoal } from '../controllers/goalController';
// import { auth } from '../middleware/auth';

const router = express.Router();

// router.post('/', auth, createGoal);
//not sure if we need authentation before get into the goal page
router.post('/', createGoal);
router.get('/', getAllGoals);
router.get('/:id', getGoalById);
router.put('/:id', updateGoal);  
router.delete('/:id', deleteGoal);

export default router;


