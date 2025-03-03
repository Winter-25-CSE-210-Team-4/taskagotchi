import express from 'express';
import { auth } from '../middleware/auth';

import { 
    createGoal, 
    getAllUserGoals, 
    getGoalById,
    updateGoal,
    deleteGoal,
    addTaskToGoal,
    getGoalTasks } from '../controllers/goalController';
// import { auth } from '../middleware/auth';

const router = express.Router();

// router.post('/', auth, createGoal);
//not sure if we need authentation before get into the goal page
router.post('/', auth, createGoal);
router.get('/', auth, getAllUserGoals);
router.get('/:id', auth, getGoalById);
router.put('/:id', auth, updateGoal);  
router.delete('/:id', auth, deleteGoal);

export default router;


