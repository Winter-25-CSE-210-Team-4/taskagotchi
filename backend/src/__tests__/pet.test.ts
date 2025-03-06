import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import Pet from '../models/Pet';

// MongoDB memory server instance for isolated testing
let mongoServer: MongoMemoryServer;

// Set up the in-memory database before all tests
beforeAll(async () => {
    await mongoose.disconnect();

    // Create a new instance of MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
});

// Clean up after all tests are complete
afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoServer.stop();
});

// Clear all data before each individual test
beforeEach(async () => {
    await Pet.deleteMany({});
});

describe('Pet Endpoints', () => {
    let userId: string;
    let authToken: string;
    let existingPetId: string;

    beforeEach(async () => {
        await Pet.deleteMany({});
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                email: `test${Date.now()}@example.com`,
                password: 'password123',
                name: 'Test User'
            });

        console.log('Registration response:', registerRes.body);
        
        userId = registerRes.body.data.user._id;
        authToken = registerRes.body.data.token;
        existingPetId = registerRes.body.data.pet._id;
        if (!userId || !authToken) {
            throw new Error('Failed to set up test user');
        }
    });

    it('should prevent creating a second pet', async () => {
        const existingPet = await Pet.findOne({ userId });
        expect(existingPet).toBeTruthy();
        expect(existingPet?.name).toBe("Test User's Pet");
        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                userId: userId,
                name: 'SecondPet',
                health: 100,
                level: 1,
                exp: 0
            });

        // Should return 400 because user already has a pet
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'User already has a pet');
    });

    // Test: Retrieving all pets from the database
    // it('should get all pets', async () => {
    //     await Pet.create([
    //         {
    //             userId: userId,
    //             name: 'Pet1',
    //             health: 100,
    //             level: 1,
    //             exp: 0
    //         },
    //         {
    //             userId: userId,
    //             name: 'Pet2',
    //             health: 100,
    //             level: 1,
    //             exp: 0
    //         }
    //     ]);

    //     // Attempt to retrieve all pets
    //     const res = await request(app)
    //         .get('/api/pets')
    //         .set('Authorization', `Bearer ${authToken}`);

    //     expect(res.status).toBe(200);
    //     expect(Array.isArray(res.body)).toBeTruthy();
    //     expect(res.body).toHaveLength(2);
    // });

    // Test: Retrieving a single pet by its ID
    it('should get a single pet by ID', async () => {
        const res = await request(app)
            .get(`/api/pets/${existingPetId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('name', "Test User's Pet");
    });

    // Test: Handling requests for non-existent pets
    it('should return 404 for non-existent pet', async () => {
        const fakeId = new mongoose.Types.ObjectId(); // Create a valid but non-existent ID
        const res = await request(app)
            .get(`/api/pets/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Pet not found');
    });

    // Test: Handling invalid pet creation data
    it('should handle invalid pet creation data', async () => {
        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'InvalidPet' // Missing pet_id and other required fields
            });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    // Test: Validating pet health range
    it('should validate pet health range', async () => {
        const res = await request(app)
            .post('/api/pets')
            .send({
                pet_id: 3,
                name: 'HealthyPet',
                health: -10, // Invalid health value
                level: 1,
                exp: 0
            });
        expect(res.status).toBe(400);
    });
});