import morgan from 'morgan';
import logger, { stream } from '../config/logger';

// Custom morgan token for logging response time in a friendly format
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

// Custom morgan token for request ID (if you implement it later)
morgan.token('id', (req: any) => {
  return req.id || '-';
});

// Define custom morgan format
const morganFormat =
  ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

// Create morgan middleware for development
export const developmentLogger = morgan('dev', {
  stream,
  skip: (req, res) => {
    // Skip health check endpoint to avoid noise in logs
    return req.url === '/health' || req.url === '/api/health';
  },
});

// Create morgan middleware for production
export const productionLogger = morgan(morganFormat, {
  stream,
  skip: (req, res) => {
    // Skip health check endpoint to avoid noise in logs
    return req.url === '/health' || req.url === '/api/health';
  },
});

// Choose the appropriate logger based on environment
const requestLogger =
  process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

export default requestLogger;
