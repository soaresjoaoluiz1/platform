import { api } from './api';
import { WhatsAppInstance, WhatsAppConnectionResponse, WhatsAppStatusResponse } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const whatsappService = {
  // Conectar/Criar instância
  async conectar(): Promise<WhatsAppConnectionResponse> {
    const response = await api.post<ApiResponse<WhatsAppConnectionResponse>>('/api/instancias/conectar');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Erro ao conectar instância');
    }
    return response.data.data;
  },

  // Obter minha instância
  async getMinhaInstancia(): Promise<WhatsAppInstance | null> {
    try {
      const response = await api.get<ApiResponse<WhatsAppInstance>>('/api/instancias/minhas');
      if (!response.data.success) {
        return null;
      }
      return response.data.data || null;
    } catch (error) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Verificar status da conexão
  async verificarStatus(): Promise<WhatsAppStatusResponse> {
    const response = await api.get<ApiResponse<WhatsAppStatusResponse>>('/api/instancias/status');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Erro ao verificar status');
    }
    return response.data.data;
  },

  // Desconectar instância
  async desconectar(): Promise<void> {
    const response = await api.post<ApiResponse<void>>('/api/instancias/desconectar');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao desconectar instância');
    }
  },

  // Atualizar QR Code
  async atualizarQrCode(): Promise<{ qrCode: string; message: string }> {
    const response = await api.post<ApiResponse<{ qrCode: string; message: string }>>('/api/instancias/qrcode');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Erro ao atualizar QR Code');
    }
    return response.data.data;
  },

  // Listar todas as instâncias (admin)
  async listarInstancias(): Promise<WhatsAppInstance[]> {
    const response = await api.get<ApiResponse<WhatsAppInstance[]>>('/api/instancias');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao listar instâncias');
    }
    return response.data.data || [];
  },
};
