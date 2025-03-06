import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';

let mongoServer: MongoMemoryServer;

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
  
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should login with valid credentials', async () => {
      // register user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
  
      // login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
  
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).toHaveProperty('name', 'Test User');
    });

    // failed login case

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
  
      expect(res.status).toBe(401);
    });
  });