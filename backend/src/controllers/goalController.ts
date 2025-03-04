import { Request, Response } from 'express';
import Goal from '../models/goal';
import { AuthRequest } from '../middleware/auth';

//Create a new goal
export const createGoal = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, deadline } = req.body;
        
        if (!title || !description || !deadline) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }
        console.log('User ID from token:', req.user?.id);

        const newGoal = new Goal({
            title,
            description,
            deadline,
            status: 'active',
            createdAt: new Date().toISOString(),
            userId: req.user?.id 
        });

        console.log('Goal to be saved:', newGoal);

        const savedGoal = await newGoal.save();
        console.log('Saved goal:', savedGoal);


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



// export const getAllGoals = async (req: Request, res: Response) => {
//     try {
//         const goals = await Goal.find();
//         res.json({ 
//             success: true, 
//             data: goals 
//         });
//     } catch (error) {
//         console.error('Error fetching goals:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching goals',
//             error: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// };

export const getAllUserGoals = async (req: AuthRequest, res: Response) => {
    try {
        const goals = await Goal.find({ userId: req.user?.id });
        res.json({ 
            success: true, 
            data: goals 
        });
    } catch (error) {
        console.error('Error fetching user goals:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user goals',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

//getGoalList by userid
//for the homepage, like every user will have a goal list that be presented
export const getGoalById = async (req: AuthRequest, res: Response) => {
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
export const updateGoal = async (req: AuthRequest, res: Response) => {
    try {
        const goalId = req.params.id;
        const updates = req.body;

        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: goalId, userId: req.user?.id },
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
export const deleteGoal = async (req: AuthRequest, res: Response) => {
    try {
        const goalId = req.params.id;
        const deletedGoal = await Goal.findOneAndDelete({ 
            _id: goalId,
            userId: req.user?.id 
        });

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


export const addTaskToGoal = async (req: Request, res: Response) => {
    try {
      const goalId = req.params.id;
      const { description, deadline, recurrs, recurringUnit, user_id } = req.body;
      
      // 验证必填字段
      if (!description || !deadline) {
        return res.status(400).json({
          success: false,
          message: 'Please provide task description and deadline'
        });
      }
      
      // 检查目标是否存在
      const goal = await Goal.findById(goalId);
      if (!goal) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found'
        });
      }
      
      // 获取当前最大的task_id
      const maxTaskDoc = await Task.findOne().sort({ task_id: -1 });
      const newTaskId = maxTaskDoc ? maxTaskDoc.task_id + 1 : 1;
      
      // 创建新任务
      const newTask = new Task({
        task_id: newTaskId,
        user_id: user_id || req.body.user_id, // 假设有用户ID在请求中
        goal_id: goal._id,
        deadline: new Date(deadline),
        recurrs: recurrs || false,
        recurringUnit: recurringUnit,
        description,
        isCompleted: false
      });
      
      // 保存新任务
      await newTask.save();
      
      // 检查目标完成状态（虽然新任务不会影响）
      await goal.checkCompletion();
      
      res.status(201).json({
        success: true,
        message: 'Task added to goal successfully',
        data: newTask
      });
    } catch (error) {
      console.error('Error adding task to goal:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding task to goal',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
  
  // 获取目标的所有子任务
  export const getGoalTasks = async (req: Request, res: Response) => {
    try {
      const goalId = req.params.id;
      
      // 检查目标是否存在
      const goal = await Goal.findById(goalId);
      if (!goal) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found'
        });
      }
      
      // 获取关联的任务
      const tasks = await Task.find({ goal_id: goalId });
      
      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error fetching goal tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching goal tasks',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };