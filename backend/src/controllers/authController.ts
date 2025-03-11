import { Request, Response, NextFunction} from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import Pet from '../models/Pet';
import mongoose from 'mongoose';
import crypto from 'crypto';

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
      // pet_id: new mongoose.Types.ObjectId(),
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


export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      throw new AppError('Email is required', 400);
    }
    
    console.log('Starting password reset request for:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('No user found with that email address', 404);
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const resetTokenHashed = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Save reset token to user record with expiration (1 hour)
    user.passwordResetToken = resetTokenHashed;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    try {
      await user.save({ validateBeforeSave: false });
      console.log('Reset token generated for user:', user._id);
    } catch (saveError) {
      console.error('Failed to save reset token:', saveError);
      if (saveError instanceof Error) {
        throw new AppError(`Failed to process reset request: ${saveError.message}`, 500);
      } else {
        throw new AppError('Failed to process reset request', 500);
      }
    }
    
 
    return res.status(200).json({
      status: 'success',
      message: 'Password reset token generated',
      resetToken 
    });
    
  } catch (error) {
    console.error('Password reset request error:', error);
    if (error instanceof AppError) {
      return next(error);
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new AppError(error.message, 400));
    }
    return next(new AppError(`Password reset failed: ${(error as Error).message}`, 500));
  }
};

// Reset password using token
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      throw new AppError('Token and new password are required', 400);
    }
    
    console.log('Processing password reset with token');
    

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with the token that hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new AppError('Invalid or expired token', 400);
    }
    
    // Update password
    user.password = newPassword;
    
    // Clear reset token fields
    user.passwordResetToken = null; 
    user.passwordResetExpires = null; 
    
    try {
      await user.save();
      console.log('Password reset successful for user:', user._id);
    } catch (saveError) {
      console.error('Failed to update password:', saveError);
      if (saveError instanceof Error) {
        throw new AppError(`Failed to reset password: ${saveError.message}`, 400);
      } else {
        throw new AppError('Failed to reset password', 400);
      }
    }
    
    // Generate new authentication token
    const authToken = user.generateAuthToken();
    
    return res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
      user,
      token: authToken
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    if (error instanceof AppError) {
      return next(error);
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new AppError(error.message, 400));
    }
    return next(new AppError(`Password reset failed: ${(error as Error).message}`, 400));
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id; 
    
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }
    
    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }
    
    console.log('Processing password change for user:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
      throw new AppError('Current password is incorrect', 401);
    }
    
    // Update password
    user.password = newPassword;
    
    // Clear reset token fields if they exist
    if (user.passwordResetToken) {
      user.passwordResetToken = null; 
    }
    
    if (user.passwordResetExpires) {
      user.passwordResetExpires = null; 
    }
    
    try {
      await user.save();
      console.log('Password changed successfully for user:', user._id);
    } catch (saveError) {
      console.error('Failed to change password:', saveError);
      if (saveError instanceof Error) {
        throw new AppError(`Failed to change password: ${saveError.message}`, 400);
      } else {
        throw new AppError('Failed to change password', 400);
      }
    }
    
    // Generate new authentication token
    const token = user.generateAuthToken();
    
    return res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
      token
    });
    
  } catch (error) {
    console.error('Password change error:', error);
    if (error instanceof AppError) {
      return next(error);
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new AppError(error.message, 400));
    }
    return next(new AppError(`Password change failed: ${(error as Error).message}`, 400));
  }
};