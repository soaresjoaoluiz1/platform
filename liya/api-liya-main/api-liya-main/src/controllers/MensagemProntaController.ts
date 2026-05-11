import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { z } from 'zod';
import { MensagemProntaService } from '../services/MensagemProntaService';
import { 
  createMensagemProntaSchema, 
  updateMensagemProntaSchema,
  getMensagensProntasSchema 
} from '../validation/schemas';

export class MensagemProntaController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const validatedData = createMensagemProntaSchema.parse(req.body);
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      
      const mensagem = await MensagemProntaService.create(
        {
          ...validatedData,
          tenantId,
        },
        files
      );

      res.status(201).json(mensagem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      if (error instanceof Error && error.message.includes('Status não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao criar mensagem pronta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getByTenant(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      // Validar e extrair filtros da query string
      const validatedQuery = getMensagensProntasSchema.parse(req.query);
      
      const mensagens = await MensagemProntaService.getByTenant(tenantId, validatedQuery);
      res.json(mensagens);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Parâmetros de busca inválidos',
          details: error.errors,
        });
      }

      console.error('Erro ao buscar mensagens prontas:', error);
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

      const mensagem = await MensagemProntaService.getById(id, tenantId);
      
      if (!mensagem) {
        return res.status(404).json({ error: 'Mensagem pronta não encontrada' });
      }

      res.json(mensagem);
    } catch (error) {
      console.error('Erro ao buscar mensagem pronta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getByStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { statusId } = req.params;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const mensagens = await MensagemProntaService.getByStatus(statusId, tenantId);
      res.json(mensagens);
    } catch (error) {
      console.error('Erro ao buscar mensagens por status:', error);
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

      const validatedData = updateMensagemProntaSchema.parse(req.body);
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      
      const mensagem = await MensagemProntaService.update(id, validatedData, tenantId, files);
      
      if (!mensagem) {
        return res.status(404).json({ error: 'Mensagem pronta não encontrada' });
      }

      res.json(mensagem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      if (error instanceof Error && error.message.includes('Status não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao atualizar mensagem pronta:', error);
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

      const success = await MensagemProntaService.delete(id, tenantId);
      
      if (!success) {
        return res.status(404).json({ error: 'Mensagem pronta não encontrada' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar mensagem pronta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async toggleActive(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;
      
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID é obrigatório' });
      }

      const mensagem = await MensagemProntaService.toggleActive(id, tenantId);
      
      if (!mensagem) {
        return res.status(404).json({ error: 'Mensagem pronta não encontrada' });
      }

      res.json(mensagem);
    } catch (error) {
      console.error('Erro ao alternar status ativo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
