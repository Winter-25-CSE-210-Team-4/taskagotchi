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

    beforeAll(async () => {
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            });

        userId = registerRes.body.data.user._id;
        authToken = registerRes.body.data.token;
    });

    // Test: Creating a new pet with valid data
    it('should create a new pet', async () => {
        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                userId: userId,
                name: 'TestPet',
                health: 100,
                level: 1,
                exp: 0
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('name', 'TestPet');
        expect(res.body).toHaveProperty('health', 100);
    });

    // Test: Retrieving all pets from the database
    it('should get all pets', async () => {
        await Pet.create([
            {
                pet_id: 1,
                name: 'Pet1',
                health: 100,
                level: 1,
                exp: 0
            },
            {
                pet_id: 2,
                name: 'Pet2',
                health: 100,
                level: 1,
                exp: 0
            }
        ]);

        // Attempt to retrieve all pets
        const res = await request(app)
            .get('/api/pets');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body).toHaveLength(2);
    });

    // Test: Retrieving a single pet by its ID
    it('should get a single pet by ID', async () => {
        const pet = await Pet.create({
            pet_id: 2,
            name: 'FindMe',
            health: 100,
            level: 1,
            exp: 0
        });

        // Attempt to retrieve the pet by its ID
        const res = await request(app)
            .get(`/api/pets/${pet.pet_id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'FindMe');
    });

    // Test: Handling requests for non-existent pets
    it('should return 404 for non-existent pet', async () => {
        const res = await request(app)
            .get('/api/pets/999');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Pet not found');
    });

    // Test: Handling invalid pet creation data
    it('should handle invalid pet creation data', async () => {
        const res = await request(app)
            .post('/api/pets')
            .send({
                name: 'InvalidPet' // Missing pet_id and other required fields
            });
        expect(res.status).toBe(400);
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