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
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });
  });