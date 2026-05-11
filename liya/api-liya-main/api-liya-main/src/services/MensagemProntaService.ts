import { MensagemPronta, Status } from '../models';
import minioClient, { bucketName, ensureBucketExists } from '../config/minio';
import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';

interface CreateMensagemProntaData {
  titulo: string;
  conteudo: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  statusId?: string | null;
  isActive?: boolean;
  tenantId: string;
}

interface UpdateMensagemProntaData {
  titulo?: string;
  conteudo?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  statusId?: string | null;
  isActive?: boolean;
}

interface GetMensagensFilters {
  statusId?: string;
  search?: string;
  isActive?: boolean;
}

export class MensagemProntaService {
  static async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    // Garantir que o bucket existe antes do upload
    await ensureBucketExists();
    
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;
    
    await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    
    return fileName;
  }

  static async getPresignedUrl(fileKey: string): Promise<string> {
    try {
      return await minioClient.presignedGetObject(bucketName, fileKey, 24 * 60 * 60); // 24 horas
    } catch (error) {
      console.error('Erro ao gerar URL pré-assinada:', error);
      throw error;
    }
  }

  static async deleteFile(fileKey: string): Promise<void> {
    try {
      await minioClient.removeObject(bucketName, fileKey);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
    }
  }

  private static async addPresignedUrls(mensagem: any) {
    const mensagemData = mensagem.toJSON ? mensagem.toJSON() : mensagem;
    
    if (mensagemData.imageUrl) {
      mensagemData.imageUrl = await this.getPresignedUrl(mensagemData.imageUrl);
    }
    
    if (mensagemData.videoUrl) {
      mensagemData.videoUrl = await this.getPresignedUrl(mensagemData.videoUrl);
    }
    
    return mensagemData;
  }

  static async create(data: CreateMensagemProntaData, files?: { image?: Express.Multer.File[], video?: Express.Multer.File[] }) {
    let imageUrl: string | null = null;
    let videoUrl: string | null = null;

    // Upload de imagem se fornecida
    if (files?.image && files.image.length > 0) {
      imageUrl = await this.uploadFile(files.image[0], 'mensagens-prontas/images');
    }

    // Upload de vídeo se fornecido
    if (files?.video && files.video.length > 0) {
      videoUrl = await this.uploadFile(files.video[0], 'mensagens-prontas/videos');
    }

    // Validar se o status existe (se fornecido)
    if (data.statusId) {
      const status = await Status.findOne({
        where: { 
          id: data.statusId,
          tenantId: data.tenantId,
          isActive: true
        },
      });

      if (!status) {
        throw new Error('Status não encontrado ou inativo');
      }
    }

    const mensagemData = {
      titulo: data.titulo,
      conteudo: data.conteudo,
      imageUrl: imageUrl || data.imageUrl || null,
      videoUrl: videoUrl || data.videoUrl || null,
      statusId: data.statusId || null,
      isActive: data.isActive !== false,
      tenantId: data.tenantId,
    };

    const mensagem = await MensagemPronta.create(mensagemData);
    
    // Buscar a mensagem criada com o status incluído
    const mensagemCriada = await MensagemPronta.findByPk(mensagem.id, {
      include: [
        {
          model: Status,
          as: 'status',
          attributes: ['id', 'name', 'color', 'tipo', 'ordem'],
        },
      ],
    });

    return mensagemCriada ? await this.addPresignedUrls(mensagemCriada) : null;
  }

  static async getByTenant(tenantId: string, filters?: GetMensagensFilters) {
    const whereClause: any = {
      tenantId,
    };

    // Aplicar filtro de status
    if (filters?.statusId) {
      whereClause.statusId = filters.statusId;
    }

    // Aplicar filtro de ativo/inativo
    if (filters?.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    // Aplicar busca por título ou conteúdo
    if (filters?.search) {
      const { Op } = require('sequelize');
      whereClause[Op.or] = [
        { titulo: { [Op.iLike]: `%${filters.search}%` } },
        { conteudo: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const mensagens = await MensagemPronta.findAll({
      where: whereClause,
      include: [
        {
          model: Status,
          as: 'status',
          attributes: ['id', 'name', 'color', 'tipo', 'ordem'],
        },
      ],
      order: [
        ['isActive', 'DESC'],
        ['titulo', 'ASC'],
      ],
    });

    // Adicionar URLs pré-assinadas para cada mensagem
    return await Promise.all(
      mensagens.map(mensagem => this.addPresignedUrls(mensagem))
    );
  }

  static async getById(id: string, tenantId: string) {
    const mensagem = await MensagemPronta.findOne({
      where: { id, tenantId },
      include: [
        {
          model: Status,
          as: 'status',
          attributes: ['id', 'name', 'color', 'tipo', 'ordem'],
        },
      ],
    });

    return mensagem ? await this.addPresignedUrls(mensagem) : null;
  }

  static async update(id: string, data: UpdateMensagemProntaData, tenantId: string, files?: { image?: Express.Multer.File[], video?: Express.Multer.File[] }) {
    const mensagem = await MensagemPronta.findOne({
      where: { id, tenantId },
    });

    if (!mensagem) {
      return null;
    }

    const updateData: any = { ...data };

    // Upload de nova imagem se fornecida
    if (files?.image && files.image.length > 0) {
      // Deletar imagem antiga se existir
      if (mensagem.imageUrl) {
        await this.deleteFile(mensagem.imageUrl).catch(() => {});
      }
      updateData.imageUrl = await this.uploadFile(files.image[0], 'mensagens-prontas/images');
    }

    // Upload de novo vídeo se fornecido
    if (files?.video && files.video.length > 0) {
      // Deletar vídeo antigo se existir
      if (mensagem.videoUrl) {
        await this.deleteFile(mensagem.videoUrl).catch(() => {});
      }
      updateData.videoUrl = await this.uploadFile(files.video[0], 'mensagens-prontas/videos');
    }

    // Validar se o status existe (se fornecido)
    if (data.statusId !== undefined && data.statusId !== null) {
      const status = await Status.findOne({
        where: { 
          id: data.statusId,
          tenantId,
          isActive: true
        },
      });

      if (!status) {
        throw new Error('Status não encontrado ou inativo');
      }
    }

    await mensagem.update(updateData);

    return await this.getById(id, tenantId);
  }

  static async delete(id: string, tenantId: string) {
    const mensagem = await MensagemPronta.findOne({
      where: { id, tenantId },
    });

    if (!mensagem) {
      return false;
    }

    // Deletar arquivos associados se existirem
    if (mensagem.imageUrl) {
      await this.deleteFile(mensagem.imageUrl).catch(() => {});
    }

    if (mensagem.videoUrl) {
      await this.deleteFile(mensagem.videoUrl).catch(() => {});
    }

    await mensagem.destroy();
    return true;
  }

  static async toggleActive(id: string, tenantId: string) {
    const mensagem = await MensagemPronta.findOne({
      where: { id, tenantId },
    });

    if (!mensagem) {
      return null;
    }

    await MensagemPronta.update({ isActive: !mensagem.dataValues.isActive }, { where: { id, tenantId } });

    return await this.getById(id, tenantId);
  }

  static async getByStatus(statusId: string, tenantId: string) {
    const mensagens = await MensagemPronta.findAll({
      where: { 
        statusId,
        tenantId,
        isActive: true
      },
      include: [
        {
          model: Status,
          as: 'status',
          attributes: ['id', 'name', 'color', 'tipo', 'ordem'],
        },
      ],
      order: [['titulo', 'ASC']],
    });

    // Adicionar URLs pré-assinadas para cada mensagem
    return await Promise.all(
      mensagens.map(mensagem => this.addPresignedUrls(mensagem))
    );
  }
}