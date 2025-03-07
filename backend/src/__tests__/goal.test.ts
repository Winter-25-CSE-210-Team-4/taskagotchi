import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, beforeEach, afterAll, describe, it, expect } from '@jest/globals';

let mongoServer: MongoMemoryServer;
let authToken: string;
let goalId: string;

beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User'
        });
        
    console.log('Registration response:', registerResponse.body);
    authToken = registerResponse.body.data.token;
    if (!authToken) {
        throw new Error('Failed to get auth token');
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Goal Endpoints', () => {
    let goalId: string;

    beforeEach(async () => {
        await mongoose.connection.collection('goals').deleteMany({});
        try {
            const createRes = await request(app)
                .post('/api/goals')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Initial Test Goal',
                    description: 'Initial Test Description',
                    deadline: '2024-03-01T00:00:00.000Z'
                });
            
            console.log('Goal creation response:', createRes.body);
            if (!createRes.body.data?._id) {
                throw new Error('No goal ID received from creation');
            }
            goalId = createRes.body.data._id;
            console.log('Created goal ID:', goalId);
        } catch (error) {
            console.error('Goal creation error:', error);
            throw error;
        }
    });

    it('should create a new goal', async () => {
        const res = await request(app)
            .post('/api/goals')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Another Goal',
                description: 'Another Description',
                deadline: '2024-03-01T00:00:00.000Z',
                isCompleted: false
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('name', 'Another Goal');
        expect(res.body.data).toHaveProperty('isCompleted', false);
    });

    it('should get all goals', async () => {
        const res = await request(app)
            .get('/api/goals')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get a specific goal by id', async () => {
        console.log('Testing get goal with ID:', goalId);

        const res = await request(app)
            .get(`/api/goals/${goalId}`)
            .set('Authorization', `Bearer ${authToken}`);

        console.log('Get goal response:', res.body);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('_id', goalId);
    });

    it('should update a goal completion status', async () => {
        const res = await request(app)
            .put(`/api/goals/${goalId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Updated Goal',
                isCompleted: true
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('name', 'Updated Goal');
        expect(res.body.data).toHaveProperty('isCompleted', true);
    });

    it('should delete a goal', async () => {
        const res = await request(app)
            .delete(`/api/goals/${goalId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Goal successfully deleted');
    });

    it('should return 404 when getting non-existent goal', async () => {
        const res = await request(app)
            .get(`/api/goals/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 when creating goal with missing required fields', async () => {
        const res = await request(app)
            .post('/api/goals')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Test Goal'
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Please provide all required fields');
    });
    it('should return 404 when getting non-existent goal', async () => {
        const res = await request(app)
            .get(`/api/goals/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 when creating goal with missing required fields', async () => {
        const res = await request(app)
            .post('/api/goals')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Test Goal'
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Please provide all required fields');
    });

    it('should return 404 when updating non-existent goal', async () => {
        const res = await request(app)
            .put(`/api/goals/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Updated Goal',
                isCompleted: true
            });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should return 404 when deleting non-existent goal', async () => {
        const res = await request(app)
            .delete(`/api/goals/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should not allow access to goals without authentication', async () => {
        const res = await request(app)
            .get('/api/goals');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Please authenticate.');
    });

    it('should not allow goal creation without authentication', async () => {
        const res = await request(app)
            .post('/api/goals')
            .send({
                name: 'Test Goal',
                description: 'Test Description',
                deadline: '2024-03-01T00:00:00.000Z'
            });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Please authenticate.');
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});