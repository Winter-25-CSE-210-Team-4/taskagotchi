import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, afterEach, beforeEach} from '@jest/globals';

let mongod: MongoMemoryServer;

beforeAll(async () => {
    // Close any existing connections first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
    } catch (error) {
      console.error('MongoDB Memory Server setup failed:', error);
      throw error;
    }
  });
  
  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
          await collections[key].deleteMany({});
        }
      } catch (error) {
        console.error('Collection cleanup failed:', error);
        throw error;
      }
    }
  });
  
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      try {
        await mongoose.connection.close();
      } catch (error) {
        console.error('Connection close failed:', error);
      }
    }
    if (mongod) {
      await mongod.stop();
    }
  });