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

const isDevelopment = process.env.NODE_ENV === 'development';

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5050,
  mongoUri: isDevelopment
    ? process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/taskagotchi'
    : process.env.MONGODB_URI_CLOUD || 'mongodb://localhost:27017/taskagotchi',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '24h',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};

export default config;