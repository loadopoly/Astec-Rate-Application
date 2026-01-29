/**
 * Winston Logger Configuration
 */

import winston from 'winston';
import { config } from './env';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logger instance
export const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console output
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    // File output (errors only)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // File output (all logs)
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// Don't log to files in development
if (config.nodeEnv === 'development') {
  logger.transports.forEach((transport) => {
    if (transport instanceof winston.transports.File) {
      transport.silent = true;
    }
  });
}
