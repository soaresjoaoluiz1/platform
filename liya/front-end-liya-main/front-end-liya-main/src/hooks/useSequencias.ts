import { useEffect, useState } from 'react';
import { SequenciaQualificacao, CreateSequenciaQualificacao, UpdateSequenciaQualificacao } from '../types';
import { sequenciasService } from '../services/sequencias';
import { isApiEnabled, getErrorMessage } from '../services/api';

export const useSequencias = (callbacks?: {
  onError?: (message: string, isTokenExpired?: boolean) => void;
  onSuccess?: (message: string) => void;
  onTokenExpired?: () => void;
}) => {
  const [sequencias, setSequencias] = useState<SequenciaQualificacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSequencias = async () => {
    if (!isApiEnabled) {
      setSequencias([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await sequenciasService.getAll();
      // Ordenar por ordem
      const sorted = data.sort((a, b) => a.ordem - b.ordem);
      setSequencias(sorted);
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao carregar sequências: ${apiError.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSequencias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createSequencia = async (sequenciaData: CreateSequenciaQualificacao): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await sequenciasService.create(sequenciaData);
      await loadSequencias();
      callbacks?.onSuccess?.('Sequência criada com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao criar sequência: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSequencia = async (id: string, sequenciaData: UpdateSequenciaQualificacao): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await sequenciasService.update(id, sequenciaData);
      await loadSequencias();
      callbacks?.onSuccess?.('Sequência atualizada com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao atualizar sequência: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSequencia = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await sequenciasService.delete(id);
      await loadSequencias();
      callbacks?.onSuccess?.('Sequência excluída com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao excluir sequência: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sequencias,
    isLoading,
    loadSequencias,
    createSequencia,
    updateSequencia,
    deleteSequencia,
  };
};
