import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  res.status(500).json({
    error: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { details: error.message }),
  });
};