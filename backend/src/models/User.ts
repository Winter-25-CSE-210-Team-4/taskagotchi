// src/models/User.ts
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';


interface IUser {
  email: string;
  password: string;
  name: string;
  role: string;
}


interface IUserDocument extends IUser, Document {
  generateAuthToken(): string;
  comparePassword(password: string): Promise<boolean>;
}


interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}


const userSchema = new mongoose.Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});


userSchema.methods.generateAuthToken = function(this: IUserDocument) {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: '24h' }
  );
  return token;
};


userSchema.methods.comparePassword = async function(
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};


userSchema.pre('save', async function(this: IUserDocument, next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
export default User;