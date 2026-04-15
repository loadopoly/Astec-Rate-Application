import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  // Render (and other PaaS) inject PORT; API_PORT is used locally via Docker.
  port: parseInt(process.env.API_PORT ?? process.env.PORT ?? '3001', 10),
  
  // Database
  databaseUrl: requireEnv('DATABASE_URL', 'postgresql://ips_user:ips_password@localhost:5432/ips_freight'),
  
  // Redis
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  
  // Auth
  jwtSecret: requireEnv('JWT_SECRET', 'ips-default-jwt-secret-DO-NOT-USE-IN-PRODUCTION-change-this-value-now'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  
  // CORS
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((s) => s.trim()),
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '100', 10),
  
  // Logging
  logLevel: process.env.LOG_LEVEL ?? 'info',
};
