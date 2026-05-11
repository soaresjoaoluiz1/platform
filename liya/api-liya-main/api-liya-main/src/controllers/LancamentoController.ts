import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { z } from 'zod';
import { LancamentoService } from '../services/LancamentoService';
import { 
  createLancamentoSchema, 
  updateLancamentoSchema 
} from '../validation/schemas';

export class LancamentoController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const validatedData = createLancamentoSchema.parse(req.body);
      
      const lancamento = await LancamentoService.create({
        ...validatedData,
        tenantId,
      });

      res.status(201).json(lancamento);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      console.error('Erro ao criar lançamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const lancamentos = await LancamentoService.findAll(tenantId);
      res.json(lancamentos);
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error);
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

      const lancamento = await LancamentoService.findById(id, tenantId);
      res.json(lancamento);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao buscar lançamento:', error);
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

      const validatedData = updateLancamentoSchema.parse(req.body);
      
      const lancamento = await LancamentoService.update(id, tenantId, validatedData);
      res.json(lancamento);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      if (error instanceof Error && error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao atualizar lançamento:', error);
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

      const result = await LancamentoService.delete(id, tenantId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao deletar lançamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
