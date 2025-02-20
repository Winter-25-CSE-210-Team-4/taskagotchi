import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, beforeEach, afterAll, describe, it, expect } from '@jest/globals';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
describe('Goal Endpoints', () => {
    let goalId: string;
    //change this to before each, create a goal in database and save the id
    //just to ensure each test has a fresh goal to work with 
    beforeEach(async () => {
        try {
            const createRes = await request(app)
                .post('/api/goals')
                .send({
                    title: 'Initial Test Goal',
                    description: 'Initial Test Description',
                    deadline: '2024-03-01T00:00:00.000Z'
                });
            
            console.log('Create response:', createRes.body);
            goalId = createRes.body.data._id;
            console.log('Created goal ID:', goalId);
        } catch (error) {
            console.error('Error in beforeEach:', error);
        }
    });

    it('should create a new goal', async () => {
        const res = await request(app)
            .post('/api/goals')
            .send({
                title: 'Another Goal',
                description: 'Another Description',
                deadline: '2024-03-01T00:00:00.000Z'
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('title', 'Another Goal');
    });


    it('should get all goals', async () => {
        const res = await request(app)
            .get('/api/goals');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

 
    it('should get a specific goal by id', async () => {
        console.log('Testing get goal with ID:', goalId);
        
        const res = await request(app)
            .get(`/api/goals/${goalId}`);
        
        console.log('Get goal response:', res.body);
        
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('_id', goalId);
    });


    it('should update a goal', async () => {
        const res = await request(app)
            .put(`/api/goals/${goalId}`)
            .send({
                title: 'Updated Goal',
                status: 'completed'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('title', 'Updated Goal');
        expect(res.body.data).toHaveProperty('status', 'completed');
    });


    it('should delete a goal', async () => {
        const res = await request(app)
            .delete(`/api/goals/${goalId}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Goal successfully deleted');
    });

    it('should return 404 when getting non-existent goal', async () => {
        const res = await request(app)
            .get(`/api/goals/${new mongoose.Types.ObjectId()}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 when creating goal with missing required fields', async () => {
        const res = await request(app)
            .post('/api/goals')
            .send({
                title: 'Test Goal'
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Please provide all required fields');
    });
});