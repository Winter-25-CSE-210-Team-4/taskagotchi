import { Request, Response } from 'express';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error in registration', 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid login credentials', 401);
    }

    const token = user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    throw new AppError('Error in login', 401);
  }
};