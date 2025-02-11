// src/config/config.ts
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientUrl: string;
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskagotchi',
  jwtSecret: process.env.JWT_SECRET || 'b1225fccc38e28b26c21fda8f8d338145259d0fb48206cf843de7bab0eefd1b5',
  jwtExpiresIn: '24h',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};

export default config;