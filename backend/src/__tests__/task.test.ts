import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import Task from '../models/Task';
import Goal from '../models/goal';

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
    await Task.deleteMany({});
    await Goal.deleteMany({});
});

describe('Task Endpoints', () => {
    let userId: string;
    let goalId: string;

    // Create a user ID and goal before testing task endpoints
    beforeEach(async () => {
        // Create a mock user ID (we won't actually create a user document)
        userId = new mongoose.Types.ObjectId().toString();

        // Create a goal to use in task tests
        const goal = await Goal.create({
            name: 'Test Goal',
            description: 'Test Goal Description',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            status: 'active',
            isCompleted: false,
            userId: userId
        });
        goalId = goal._id.toString();
    });

    // Test: Creating a new task
    it('should create a new task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                description: 'Test Task',
                user_id: userId,
                goal_id: goalId,
                deadline: new Date().toISOString()
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Task created successfully');
        expect(res.body.task).toHaveProperty('description', 'Test Task');
        expect(res.body.task).toHaveProperty('user_id', userId);
        expect(res.body.task).toHaveProperty('goal_id', goalId);
    });

    // Test: Creating a task with missing required fields
    it('should return 400 when description is missing', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                user_id: userId,
                goal_id: goalId,
                deadline: new Date().toISOString()
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Description is required');
    });

    // Test: Creating a task with missing user_id
    it('should return 400 when user_id is missing', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                description: 'Test Task',
                goal_id: goalId,
                deadline: new Date().toISOString()
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'User ID is required');
    });

    // Test: Creating a recurring task without specifying recurringUnit
    it('should return 400 when recurrs is true but recurringUnit is missing', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                description: 'Recurring Task',
                user_id: userId,
                goal_id: goalId,
                deadline: new Date().toISOString(),
                recurrs: true
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'For recurring tasks, please provide a recurringUnit (daily, weekly, or monthly)');
    });

    // Test: Retrieving all tasks
    it('should get all tasks', async () => {
        // Create a few tasks first
        await Task.create([
            {
                description: 'Task 1',
                user_id: userId,
                goal_id: goalId,
                deadline: new Date(),
                isCompleted: false
            },
            {
                description: 'Task 2',
                user_id: userId,
                goal_id: goalId,
                deadline: new Date(),
                isCompleted: true
            }
        ]);

        const res = await request(app)
            .get('/api/tasks');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Tasks retrieved successfully');
        expect(res.body).toHaveProperty('count', 2);
        expect(Array.isArray(res.body.tasks)).toBe(true);
        expect(res.body.tasks).toHaveLength(2);
    });

    // Test: Retrieving tasks by user ID
    it('should get tasks by user ID', async () => {
        // Create tasks for specific user
        await Task.create([
            {
                description: 'User Task 1',
                user_id: userId,
                goal_id: goalId,
                deadline: new Date(),
                isCompleted: false
            },
            {
                description: 'User Task 2',
                user_id: userId,
                goal_id: goalId,
                deadline: new Date(),
                isCompleted: false
            }
        ]);

        // Create task for different user
        const differentUserId = new mongoose.Types.ObjectId().toString();
        await Task.create({
            description: 'Different User Task',
            user_id: differentUserId,
            goal_id: goalId,
            deadline: new Date(),
            isCompleted: false
        });

        const res = await request(app)
            .get(`/api/tasks/user/${userId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'User tasks retrieved successfully');
        expect(res.body).toHaveProperty('count', 2);
        expect(Array.isArray(res.body.tasks)).toBe(true);
        expect(res.body.tasks).toHaveLength(2);
        expect(res.body.tasks[0]).toHaveProperty('user_id', userId);
    });

    // Test: Retrieving a specific task by ID
    it('should get a task by ID', async () => {
        const task = await Task.create({
            description: 'Find This Task',
            user_id: userId,
            goal_id: goalId,
            deadline: new Date(),
            isCompleted: false
        });

        const res = await request(app)
            .get(`/api/tasks/${task._id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task retrieved successfully');
        expect(res.body).toHaveProperty('task');
        expect(res.body.task).toHaveProperty('description', 'Find This Task');
    });

    // Test: Updating a task
    it('should update a task', async () => {
        const task = await Task.create({
            description: 'Task To Update',
            user_id: userId,
            goal_id: goalId,
            deadline: new Date(),
            isCompleted: false
        });

        const res = await request(app)
            .put(`/api/tasks/${task._id}`)
            .send({
                description: 'Updated Task Description',
                isCompleted: true
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task updated successfully');
        expect(res.body).toHaveProperty('task');
        expect(res.body.task).toHaveProperty('description', 'Updated Task Description');
        expect(res.body.task).toHaveProperty('isCompleted', true);
    });

    // Test: Marking a task as complete
    it('should mark a task as complete', async () => {
        const task = await Task.create({
            description: 'Task To Complete',
            user_id: userId,
            goal_id: goalId,
            deadline: new Date(),
            isCompleted: false
        });

        const res = await request(app)
            .patch(`/api/tasks/${task._id}/complete`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task marked as complete');
        expect(res.body).toHaveProperty('task');
        expect(res.body.task).toHaveProperty('isCompleted', true);

        // Verify goal completion check was triggered
        const goal = await Goal.findById(goalId);
        expect(goal).toBeDefined();
    });

    // Test: Deleting a task
    it('should delete a task', async () => {
        const task = await Task.create({
            description: 'Task To Delete',
            user_id: userId,
            goal_id: goalId,
            deadline: new Date(),
            isCompleted: false
        });

        const res = await request(app)
            .delete(`/api/tasks/${task._id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task and associated goal successfully deleted');

        // Verify task was actually deleted
        const deletedTask = await Task.findById(task._id);
        expect(deletedTask).toBeNull();
    });

    // Test: Deleting a task that doesn't exist
    it('should return 404 when deleting non-existent task', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();

        const res = await request(app)
            .delete(`/api/tasks/${nonExistentId}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Task not found');
    });

    // Test: Deleting all completed tasks
    it('should delete all completed tasks', async () => {
        // Create some completed and incomplete tasks
        await Task.create([
            {
                description: 'Completed Task 1',
                user_id: userId,
                goal_id: goalId,
                deadline: new Date(),
                isCompleted: true
            },
            {
                description: 'Completed Task 2',
                user_id: userId,
                goal_id: goalId,
                deadline: new Date(),
                isCompleted: true
            },
            {
                description: 'Incomplete Task',
                user_id: userId,
                goal_id: goalId,
                deadline: new Date(),
                isCompleted: false
            }
        ]);

        const res = await request(app)
            .delete('/api/tasks/completed');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Completed tasks deleted successfully');
        expect(res.body).toHaveProperty('count', 2);

        // Verify only completed tasks were deleted
        const remainingTasks = await Task.find({});
        expect(remainingTasks).toHaveLength(1);
        expect(remainingTasks[0]).toHaveProperty('isCompleted', false);
    });

    // Test: Task creation affects goal completion status
    it('should update goal completion status when all tasks are completed', async () => {
        // Create a task that's already completed
        await Task.create({
            description: 'Completed Task',
            user_id: userId,
            goal_id: goalId,
            deadline: new Date(),
            isCompleted: true
        });

        // Create a second task and mark it as complete
        const task = await Task.create({
            description: 'Task To Complete',
            user_id: userId,
            goal_id: goalId,
            deadline: new Date(),
            isCompleted: false
        });

        await request(app)
            .patch(`/api/tasks/${task._id}/complete`);

        // Check if the goal is now marked as completed
        const goal = await Goal.findById(goalId);
        expect(goal).toBeDefined();
        expect(goal).toHaveProperty('isCompleted', true);
    });

    // Test: Deleting the last task of a goal deletes the goal too
    it('should delete associated goal when deleting the last task', async () => {
        // Create a task
        const task = await Task.create({
            description: 'Last Task For Goal',
            user_id: userId,
            goal_id: goalId,
            deadline: new Date(),
            isCompleted: false
        });

        // Delete the task
        const res = await request(app)
            .delete(`/api/tasks/${task._id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task and associated goal successfully deleted');
        expect(res.body).toHaveProperty('deletedTask');
        expect(res.body).toHaveProperty('deletedGoal');

        // Verify goal was deleted
        const goal = await Goal.findById(goalId);
        expect(goal).toBeNull();
    });

    it('should test if the API is accessible', async () => {
        // 选择一个你确定存在的API端点
        const res = await request(app).get('/api/tasks');
        console.log('基本API测试响应:', res.status, res.body);
        // 不需要断言，只是为了查看响应
    });

    it('should debug delete completed tasks', async () => {
        const res = await request(app).delete('/api/tasks/completed');
        console.log('删除已完成任务响应:', res.status);
        console.log('响应体:', JSON.stringify(res.body, null, 2));
    });
});