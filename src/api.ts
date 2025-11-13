import app from './server';
import logger from './config/logger';

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 API Server running on http://localhost:${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`📚 API endpoints:`);
  logger.info(`   - POST   /api/json/upload`);
  logger.info(`   - GET    /api/users/extracted`);
  logger.info(`   - GET    /api/whitelist`);
  logger.info(`   - POST   /api/whitelist`);
  logger.info(`   - DELETE /api/whitelist/:username`);
  logger.info(`   - GET    /api/non-followers`);
  logger.info(`   - POST   /api/non-followers`);
  logger.info(`   - DELETE /api/non-followers/:username`);
  logger.info(`   - GET    /api/ex-followers`);
  logger.info(`   - POST   /api/ex-followers`);
  logger.info(`   - DELETE /api/ex-followers/:username`);
  logger.info(`   - GET    /api/stats`);
});
