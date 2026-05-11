import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { z } from 'zod';
import { MensagemLancamentoService } from '../services/MensagemLancamentoService';
import { 
  createMensagemLancamentoSchema, 
  updateMensagemLancamentoSchema 
} from '../validation/schemas';

export class MensagemLancamentoController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { lancamentoId } = req.params;
      const tenantId = req.user?.tenantId;
      
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const validatedData = createMensagemLancamentoSchema.parse(req.body);
      
      const mensagem = await MensagemLancamentoService.create({
        ...validatedData,
        lancamentoId,
        tenantId,
      });

      res.status(201).json(mensagem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      console.error('Erro ao criar mensagem de lançamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getAllByLancamento(req: AuthenticatedRequest, res: Response) {
    try {
      const { lancamentoId } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const mensagens = await MensagemLancamentoService.findAllByLancamento(lancamentoId, tenantId);
      res.json(mensagens);
    } catch (error) {
      console.error('Erro ao buscar mensagens de lançamento:', error);
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

      const mensagem = await MensagemLancamentoService.findById(id, tenantId);
      res.json(mensagem);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao buscar mensagem de lançamento:', error);
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

      const validatedData = updateMensagemLancamentoSchema.parse(req.body);
      
      const mensagem = await MensagemLancamentoService.update(id, tenantId, validatedData);
      res.json(mensagem);
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

      console.error('Erro ao atualizar mensagem de lançamento:', error);
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

      const result = await MensagemLancamentoService.delete(id, tenantId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao deletar mensagem de lançamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
