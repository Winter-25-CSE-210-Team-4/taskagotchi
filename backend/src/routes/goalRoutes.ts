import express from 'express';
import { createGoal, 
    getAllGoals, 
    getGoalById,
    updateGoal,
    deleteGoal,
    addTaskToGoal,
    getGoalTasks } from '../controllers/goalController';
// import { auth } from '../middleware/auth';

const router = express.Router();

// router.post('/', auth, createGoal);
//not sure if we need authentation before get into the goal page
router.post('/', createGoal);
router.get('/', getAllGoals);
router.get('/:id', getGoalById);
router.put('/:id', updateGoal);  
router.delete('/:id', deleteGoal);
router.post('/:id/tasks', addTaskToGoal);
router.get('/:id/tasks', getGoalTasks);

export default router;


