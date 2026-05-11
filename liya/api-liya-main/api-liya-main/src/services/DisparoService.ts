import { Disparo, Lead, User, Status } from '../models';
import { UserRole } from '../types';
import { Op, Sequelize } from 'sequelize';
import minioClient, { bucketName, ensureBucketExists } from '../config/minio';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class DisparoService {
  
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    // Garantir que o bucket existe antes do upload
    await ensureBucketExists();
    
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;
    
    await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    
    return fileName;
  }

  async getPresignedUrl(fileKey: string): Promise<string> {
    try {
      // URL pré-assinada válida por 5 minutos
      return await minioClient.presignedGetObject(bucketName, fileKey, 5 * 60);
    } catch (error) {
      console.error('Erro ao gerar URL pré-assinada:', error);
      return '';
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      await minioClient.removeObject(bucketName, fileKey);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
    }
  }
  async createDisparo(disparoData: any, userId: string, userRole: string, tenantId?: string, files?: { image?: Express.Multer.File[], video?: Express.Multer.File[] }) {
    let imageKey: string | undefined;
    let videoKey: string | undefined;

    // Upload de imagem se fornecida
    if (files?.image && files.image.length > 0) {
      imageKey = await this.uploadFile(files.image[0], 'disparos/images');
    }

    // Upload de vídeo se fornecido
    if (files?.video && files.video.length > 0) {
      videoKey = await this.uploadFile(files.video[0], 'disparos/videos');
    }

    // Validar allLeads: só pode ser true se o usuário for IMOBILIARIA
    const allLeads = disparoData.allLeads === 'true' && userRole === 'IMOBILIARIA';

    const createData: any = {
      ...disparoData,
      imageKey,
      videoKey,
      status: disparoData.status || 'agendado',
      tenantId: disparoData.tenantId || tenantId,
      createdBy: userId,
      allLeads,
      tipo: disparoData.tipo || 'agendado',
    };

    // Se for tipo agendado, adicionar scheduledAt
    if (createData.tipo === 'agendado') {
      createData.scheduledAt = new Date(disparoData.scheduledAt);
    }

    // Se for tipo follow_up, adicionar followUpDays e followUpStatusId
    if (createData.tipo === 'follow_up') {
      createData.followUpDays = disparoData.followUpDays;
      createData.followUpStatusId = disparoData.followUpStatusId;
    }

    return await Disparo.create(createData);
  }

  async getDisparoById(id: string, userId: string, userRole: UserRole, tenantId?: string) {
    const where: any = { id };
    if (tenantId) where.tenantId = tenantId;

    if (userRole === UserRole.CORRETOR) {
      where.createdBy = userId;
    }

    const disparo = await Disparo.findOne({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!disparo) return null;

    // Adicionar URLs pré-assinadas se existirem arquivos
    const disparoWithUrls: any = disparo.toJSON();
    console.log('Disparo:', disparo);
    console.log('Disparo data:', disparoWithUrls);
    if (disparoWithUrls.imageKey) {
      console.log('Image key:', disparoWithUrls.imageKey);
      const presignedUrl = await this.getPresignedUrl(disparoWithUrls.imageKey);
      disparoWithUrls.imageUrl = presignedUrl;
    }

    if (disparoWithUrls.videoKey) {
      disparoWithUrls.videoUrl = await this.getPresignedUrl(disparoWithUrls.videoKey);
    }

    return disparoWithUrls;
  }

  async updateDisparo(id: string, disparoData: any, userId: string, userRole: UserRole, tenantId?: string, files?: { image?: Express.Multer.File[], video?: Express.Multer.File[] }) {
    const disparo = await Disparo.findOne({
      where: { id, ...(tenantId && { tenantId }), ...(userRole === UserRole.CORRETOR && { createdBy: userId }) }
    });
    
    if (!disparo) return null;

    const updateData: any = { ...disparoData };

    // Upload de nova imagem se fornecida
    if (files?.image && files.image.length > 0) {
      // Deletar imagem anterior se existir
      if (disparo.imageKey) {
        await this.deleteFile(disparo.imageKey);
      }
      updateData.imageKey = await this.uploadFile(files.image[0], 'disparos/images');
    }

    // Upload de novo vídeo se fornecido
    if (files?.video && files.video.length > 0) {
      // Deletar vídeo anterior se existir
      if (disparo.videoKey) {
        await this.deleteFile(disparo.videoKey);
      }
      updateData.videoKey = await this.uploadFile(files.video[0], 'disparos/videos');
    }

    // Se tipo for especificado, atualizar campos relacionados
    if (updateData.tipo) {
      if (updateData.tipo === 'agendado' && updateData.scheduledAt) {
        updateData.scheduledAt = new Date(updateData.scheduledAt);
      }
    } else if (updateData.scheduledAt) {
      // Se não especificou o tipo, atualizar scheduledAt se fornecido
      updateData.scheduledAt = new Date(updateData.scheduledAt);
    }

    if (!updateData.status) {
      updateData.status = disparo.status || 'agendado';
    }

    // Validar allLeads: só pode ser true se o usuário for IMOBILIARIA
    if (updateData.allLeads !== undefined) {
      updateData.allLeads = updateData.allLeads === 'true' && userRole === UserRole.IMOBILIARIA;
    }

    await disparo.update(updateData);
    return await this.getDisparoById(id, userId, userRole, tenantId);
  }

  async deleteDisparo(id: string, userId: string, userRole: UserRole, tenantId?: string) {
    const where: any = { id };
    if (tenantId) where.tenantId = tenantId;
    if (userRole === UserRole.CORRETOR) {
      where.createdBy = userId;
    }

    const disparo = await Disparo.findOne({ where });
    if (!disparo) return null;

    // Deletar arquivos associados
    if (disparo.imageKey) {
      await this.deleteFile(disparo.imageKey);
    }
    if (disparo.videoKey) {
      await this.deleteFile(disparo.videoKey);
    }

    await disparo.destroy();
    return true;
  }

  async getDisparos(userId: string, userRole: UserRole, page = 1, limit = 10, tenantId?: string, filters?: { statusId?: string[], source?: string[], interesse?: string[] }) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;

    if (userRole === UserRole.CORRETOR) {
      where.createdBy = userId;
    }

    // Se houver filtro de statusId, buscar todos os status com o mesmo tipo e filtrar pelos IDs
    if (filters?.statusId && filters.statusId.length > 0) {
      // Buscar os tipos dos status fornecidos
      const statusRecords = await Status.findAll({
        where: {
          id: { [Op.in]: filters.statusId },
          ...(tenantId && { tenantId })
        },
        attributes: ['tipo', 'id', 'name']
      });

      if (statusRecords.length > 0) {
        const statusTipos = statusRecords.map(s => s.dataValues.tipo);
        
        // Buscar todos os IDs de status que têm esses tipos
        const allStatusWithTypes = await Status.findAll({
          where: {
            tipo: { [Op.in]: statusTipos },
            ...(tenantId && { tenantId })
          },
          attributes: ['id', 'name', 'tipo']
        });
        
        const statusIds = allStatusWithTypes.map(s => s.dataValues.id);
        
        // Só adicionar o filtro se houver IDs para filtrar
        if (statusIds.length > 0) {
          // Construir condição OR para buscar disparos que contenham qualquer um dos statusIds
          // Como filter é string JSON, vamos usar operador LIKE para cada ID
          const likeConditions = statusIds.map(id => 
            `"Disparo"."filter"::text LIKE '%${id}%'`
          ).join(' OR ');
          
          where[Op.and] = Sequelize.literal(`(${likeConditions})`);
        } else {
          console.log('No statusIds found, returning empty result');
          // Se não há IDs, retornar resultado vazio
          where.id = { [Op.in]: [] };
        }
      } else {
        console.log('No status records found for filters:', filters.statusId);
        // Se não encontrou os status, retornar resultado vazio
        where.id = { [Op.in]: [] };
      }
    }

    const { count, rows } = await Disparo.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      offset,
      limit,
      order: [['scheduledAt', 'DESC']],
    });

    // Adicionar URLs pré-assinadas para cada disparo
    const disparosWithUrls = await Promise.all(
      rows.map(async (disparo) => {
        const disparoData: any = disparo.toJSON();
        
        if (disparo.imageKey) {
          disparoData.imageUrl = await this.getPresignedUrl(disparo.imageKey);
        }
        
        if (disparo.videoKey) {
          disparoData.videoUrl = await this.getPresignedUrl(disparo.videoKey);
        }
        
        return disparoData;
      })
    );

    return {
      disparos: disparosWithUrls,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async processDisparo(disparoId: string) {
    const disparo = await Disparo.findByPk(disparoId);
    if (!disparo) return null;

    let leads: Lead[] = [];

    // Se for tipo follow_up, aplicar lógica de follow up
    if (disparo.tipo === 'follow_up') {
      leads = await this.getLeadsForFollowUp(disparo);
    } else {
      // Para tipo agendado, usar a lógica padrão de filtros
      leads = await this.getLeadsForScheduled(disparo);
    }

    // Mock do envio para WhatsApp
    const results = await Promise.all(
      leads.map(async (lead) => {
        try {
          await this.sendWhatsAppMessage(lead.phone, disparo.message, disparo.instance);
          return { leadId: lead.id, success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return { leadId: lead.id, success: false, error: message };
        }
      })
    );

    return {
      disparoId,
      totalLeads: leads.length,
      results,
    };
  }

  private async getLeadsForFollowUp(disparo: Disparo): Promise<Lead[]> {
    // Calcular a data de cutoff (hoje - followUpDays)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (disparo.followUpDays || 0));

    const where: any = {
      tenantId: disparo.tenantId,
      statusId: disparo.followUpStatusId,
    };

    // Leads que tiveram último contato antes da data de cutoff
    // ou que nunca tiveram contato (ultimoContato é null)
    where.ultimoContato = {
      [Op.or]: [
        { [Op.lte]: cutoffDate },
        { [Op.is]: null }
      ]
    };

    return await Lead.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['whatsapp'],
        },
      ],
    });
  }

  private async getLeadsForScheduled(disparo: Disparo): Promise<Lead[]> {
    // Buscar leads que atendem ao filtro
    const where: any = {
      tenantId: disparo.tenantId,
    };
    
    // Se allLeads for true, não aplicar filtros adicionais (exceto tenantId)
    if (!disparo.allLeads) {
      if (disparo.filter.statusId && disparo.filter.statusId.length > 0) {
        where.statusId = { [Op.in]: disparo.filter.statusId };
      }
      
      if (disparo.filter.source && disparo.filter.source.length > 0) {
        where.source = { [Op.in]: disparo.filter.source };
      }
      
      if (disparo.filter.interesse && disparo.filter.interesse.length > 0) {
        where.interesse = { [Op.in]: disparo.filter.interesse };
      }
      
      if (disparo.filter.startDate && disparo.filter.endDate) {
        where.createdAt = {
          [Op.between]: [new Date(disparo.filter.startDate), new Date(disparo.filter.endDate)]
        };
      }
    }
    
    return await Lead.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['whatsapp'],
        },
      ],
    });
  }

  private async sendWhatsAppMessage(phone: string, message: string, instance: string) {
    // Mock da integração com WhatsApp API
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simular sucesso/erro aleatório
    if (Math.random() > 0.95) {
      throw new Error('Falha no envio do WhatsApp');
    }
    
    return true;
  }
}