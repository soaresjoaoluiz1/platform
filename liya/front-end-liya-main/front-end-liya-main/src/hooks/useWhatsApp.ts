import { useState, useEffect, useCallback } from 'react';
import { whatsappService } from '../services/whatsapp';
import { WhatsAppInstance, WhatsAppConnectionResponse } from '../types';
import { getErrorMessage } from '../services/api';

interface UseWhatsAppOptions {
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
  autoRefresh?: boolean; // Auto verificar status a cada X segundos
  refreshInterval?: number; // Intervalo em ms (padrão: 5000)
}

export const useWhatsApp = (options: UseWhatsAppOptions = {}) => {
  const {
    onError,
    onSuccess,
    autoRefresh = false,
    refreshInterval = 5000,
  } = options;

  const [instance, setInstance] = useState<WhatsAppInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Carregar instância do usuário
  const loadInstance = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await whatsappService.getMinhaInstancia();
      setInstance(data);
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // Conectar/Criar instância
  const conectar = useCallback(async () => {
    try {
      setIsConnecting(true);
      const response: WhatsAppConnectionResponse = await whatsappService.conectar();
      
      // Atualizar estado local
      setInstance({
        id: '', // Será preenchido no próximo load
        instanceName: response.instanceName,
        status: response.status,
        qrCode: response.qrCode || null,
        createdAt: new Date().toISOString(),
      });

      onSuccess?.(response.message);
      
      // Se já está conectada, recarregar para pegar dados completos
      if (response.status === 'conectada') {
        await loadInstance();
      }
      
      return response;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      onError?.(errorMsg);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [onError, onSuccess, loadInstance]);

  // Verificar status
  const verificarStatus = useCallback(async () => {
    try {
      const status = await whatsappService.verificarStatus();
      
      // Atualizar apenas o status na instância atual, preservando QR Code se existir
      if (instance) {
        setInstance({
          ...instance,
          status: status.status,
          lastConnection: status.lastConnection || instance.lastConnection,
          // Preservar QR Code durante verificação de status
          qrCode: instance.qrCode,
        });
      }
      
      return status;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      onError?.(errorMsg);
      throw err;
    }
  }, [instance, onError]);

  // Desconectar
  const desconectar = useCallback(async () => {
    try {
      setIsLoading(true);
      await whatsappService.desconectar();
      
      // Atualizar estado local
      if (instance) {
        setInstance({
          ...instance,
          status: 'desconectada',
          qrCode: null,
        });
      }
      
      onSuccess?.('Instância desconectada com sucesso');
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      onError?.(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [instance, onError, onSuccess]);

  // Atualizar QR Code
  const atualizarQrCode = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await whatsappService.atualizarQrCode();
      
      // Atualizar QR Code na instância
      if (instance) {
        setInstance({
          ...instance,
          qrCode: result.qrCode,
          status: 'conectando',
        });
      }
      
      onSuccess?.(result.message);
      return result;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      onError?.(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [instance, onError, onSuccess]);

  // Carregar instância ao montar
  useEffect(() => {
    void loadInstance();
  }, []);

  // Auto refresh do status
  useEffect(() => {
    if (!autoRefresh || !instance || instance.status === 'desconectada') {
      return;
    }

    const interval = setInterval(() => {
      void verificarStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, instance, refreshInterval]);

  return {
    instance,
    isLoading,
    isConnecting,
    conectar,
    desconectar,
    verificarStatus,
    atualizarQrCode,
    loadInstance,
  };
};

// Hook para listar todas as instâncias (admin)
export const useWhatsAppInstances = (options: UseWhatsAppOptions = {}) => {
  const { onError } = options;
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadInstances = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await whatsappService.listarInstancias();
      setInstances(data);
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  return {
    instances,
    isLoading,
    loadInstances,
  };
};
