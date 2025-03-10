import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';

let mongoServer: MongoMemoryServer;

describe('Password Reset Flow', () => {
  it('should complete the full password reset cycle', async () => {
    // 1. register a user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'reset-test@example.com',
        password: 'originalPassword',
        name: 'Reset Test User'
      });
    
    expect(registerRes.status).toBe(201);
    
    // ask reset password token
    const requestResetRes = await request(app)
      .post('/api/auth/request-password-reset')
      .send({
        email: 'reset-test@example.com'
      });
    
    expect(requestResetRes.status).toBe(200);
    expect(requestResetRes.body).toHaveProperty('resetToken');
    const resetToken = requestResetRes.body.resetToken;
    
    // use the token to reset password
    const resetPasswordRes = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: resetToken,
        newPassword: 'newSecurePassword'
      });
    
    expect(resetPasswordRes.status).toBe(200);
    
    //use the new password to login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'reset-test@example.com',
        password: 'newSecurePassword'
      });
    
    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});