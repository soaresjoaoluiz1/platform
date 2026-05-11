import { useEffect, useState } from 'react';
import { Status } from '../types';
import { statusService } from '../services/status';
import { isApiEnabled, getErrorMessage } from '../services/api';

export const useStatus = (callbacks?: {
  onError?: (message: string, isTokenExpired?: boolean) => void;
  onSuccess?: (message: string) => void;
  onTokenExpired?: () => void;
}) => {
  const [status, setStatus] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadStatus = async () => {
    if (!isApiEnabled) {
      setStatus([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await statusService.list();
      setStatus(data);
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao carregar status: ${apiError.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createStatus = async (statusData: Omit<Status, 'id' | 'tenantId' | 'isDefault' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await statusService.create(statusData);
      await loadStatus();
      callbacks?.onSuccess?.('Status criado com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao criar status: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, statusData: Partial<Omit<Status, 'id' | 'tenantId' | 'isDefault' | 'createdAt' | 'updatedAt'>>): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await statusService.update(id, statusData);
      await loadStatus();
      callbacks?.onSuccess?.('Status atualizado com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao atualizar status: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStatus = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await statusService.remove(id);
      await loadStatus();
      callbacks?.onSuccess?.('Status excluído com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao excluir status: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    status,
    isLoading,
    loadStatus,
    createStatus,
    updateStatus,
    deleteStatus,
  };
};
