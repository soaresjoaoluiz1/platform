import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { z } from 'zod';
import { SequenciaQualificacaoService } from '../services/SequenciaQualificacaoService';
import { 
  createSequenciaQualificacaoSchema, 
  updateSequenciaQualificacaoSchema 
} from '../validation/schemas';

export class SequenciaQualificacaoController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const validatedData = createSequenciaQualificacaoSchema.parse(req.body);
      
      const sequencia = await SequenciaQualificacaoService.create({
        ...validatedData,
        tenantId,
      });

      res.status(201).json(sequencia);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      console.error('Erro ao criar sequência de qualificação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const sequencias = await SequenciaQualificacaoService.findAll(tenantId);
      res.json(sequencias);
    } catch (error) {
      console.error('Erro ao buscar sequências de qualificação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const sequencia = await SequenciaQualificacaoService.findById(id, tenantId);
      res.json(sequencia);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao buscar sequência de qualificação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const validatedData = updateSequenciaQualificacaoSchema.parse(req.body);
      
      const sequencia = await SequenciaQualificacaoService.update(id, tenantId, validatedData);
      res.json(sequencia);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      if (error instanceof Error && error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao atualizar sequência de qualificação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const result = await SequenciaQualificacaoService.delete(id, tenantId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao deletar sequência de qualificação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
