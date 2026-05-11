import { useEffect, useState } from 'react';
import { 
  Lancamento, 
  CreateLancamento, 
  UpdateLancamento,
  MensagemLancamento,
  CreateMensagemLancamento,
  UpdateMensagemLancamento
} from '../types';
import { lancamentosService } from '../services/lancamentos';
import { isApiEnabled, getErrorMessage } from '../services/api';

export const useLancamentos = (callbacks?: {
  onError?: (message: string, isTokenExpired?: boolean) => void;
  onSuccess?: (message: string) => void;
  onTokenExpired?: () => void;
}) => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLancamentos = async () => {
    if (!isApiEnabled) {
      setLancamentos([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await lancamentosService.getAll();
      setLancamentos(data);
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao carregar lançamentos: ${apiError.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLancamentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createLancamento = async (lancamentoData: CreateLancamento): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await lancamentosService.create(lancamentoData);
      await loadLancamentos();
      callbacks?.onSuccess?.('Lançamento criado com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao criar lançamento: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLancamento = async (id: string, lancamentoData: UpdateLancamento): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await lancamentosService.update(id, lancamentoData);
      await loadLancamentos();
      callbacks?.onSuccess?.('Lançamento atualizado com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao atualizar lançamento: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLancamento = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await lancamentosService.delete(id);
      await loadLancamentos();
      callbacks?.onSuccess?.('Lançamento excluído com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao excluir lançamento: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createMensagem = async (lancamentoId: string, mensagemData: CreateMensagemLancamento): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await lancamentosService.createMensagem(lancamentoId, mensagemData);
      await loadLancamentos();
      callbacks?.onSuccess?.('Mensagem criada com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao criar mensagem: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMensagem = async (mensagemId: string, mensagemData: UpdateMensagemLancamento): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await lancamentosService.updateMensagem(mensagemId, mensagemData);
      await loadLancamentos();
      callbacks?.onSuccess?.('Mensagem atualizada com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao atualizar mensagem: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMensagem = async (mensagemId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!isApiEnabled) return false;
      await lancamentosService.deleteMensagem(mensagemId);
      await loadLancamentos();
      callbacks?.onSuccess?.('Mensagem excluída com sucesso');
      return true;
    } catch (err) {
      const apiError = getErrorMessage(err);
      if (apiError.status === 401) {
        callbacks?.onError?.('Sua sessão expirou. Redirecionando para o login...', true);
        callbacks?.onTokenExpired?.();
      } else {
        callbacks?.onError?.(`Erro ao excluir mensagem: ${apiError.message}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lancamentos,
    isLoading,
    loadLancamentos,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    createMensagem,
    updateMensagem,
    deleteMensagem,
  };
};
