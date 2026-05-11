import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logger from '../utils/logger';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('..'),
          message: err.message,
        }));
        
        logger.warn('Validation error:', errors);
        return res.status(400).json({ error: 'Dados inválidos', details: errors });
      }
      
      logger.error('Unexpected validation error:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('..'),
          message: err.message,
        }));
        logger.warn('Validation error:', errors);
        return res.status(400).json({ error: 'Parâmetros inválidos', details: errors });
      }
      logger.error('Unexpected validation error:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
};