import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import {IUser} from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, config.jwtSecret) as IUser;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};
