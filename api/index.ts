// Vercel Serverless Function Entry Point
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Disable file logging for serverless
process.env.ENABLE_FILE_LOGGING = 'false';

// Import app after setting environment
import app from '../src/server';

// Export the Express app for Vercel
export default app;
