import app from './app';
import sequelize from './config/database';
import logger from './utils/logger';
import './models'; // Importar modelos para criar associações
import { ensureDefaultAdmin, ensureDemoData } from './config/bootstrap';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sincronizar modelos (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized');
    }

  // Garantir usuário ADMIN padrão
  // await ensureDefaultAdmin();

  // Criar dados de demonstração (dev ou SEED_DEMO=true)
  // await ensureDemoData();

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

startServer();