import { Request, Response, NextFunction} from 'express';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import Pet from '../models/Pet';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw new AppError('Missing required fields: email, password, or name', 400);
    }

    console.log('Starting registration process for:', email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    console.log('Creating new user');
    const user = new User({ email, password, name });
    try {
      await user.save();
      console.log('User created successfully:', user._id);
    } catch (userError) {
      console.error('User creation failed:', userError);
      if (userError instanceof Error) {
        throw new AppError(`User creation failed: ${userError.message}`, 400);
      } else {
        throw new AppError('User creation failed', 400);
      }
    }

    console.log('Creating pet for user:', user._id);

    const pet = new Pet({
      userId: user._id,
      pet_id: new mongoose.Types.ObjectId(),
      name: `${name}'s Pet`,
      health: 100,
      level: 1,
      exp: 0
    });

    try {
      await pet.save();
      console.log('Pet created successfully:', pet._id);
    } catch (petError) {
      console.error('Pet creation failed:', petError);
      // Clean up the user if pet creation fails
      await User.findByIdAndDelete(user._id);
      if (petError instanceof Error) {
        throw new AppError(`Pet creation failed: ${petError.message}`, 400);
      } else {
        throw new AppError('Pet creation failed', 400);
      }
    }

    const token = user.generateAuthToken();
    return res.status(201).json({
      status: 'success',
      data: {
        user,
        pet,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof AppError) {
      return next(error);
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new AppError(error.message, 400));
    }
    return next(new AppError(`Registration failed: ${(error as Error).message}`, 400));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid login credentials', 401);
    }

    const token = user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    // throw new AppError('Error in login', 401);
    next(new AppError('Error in login', 401));
  }
};