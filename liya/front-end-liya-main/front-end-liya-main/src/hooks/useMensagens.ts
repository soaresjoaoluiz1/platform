import { useState, useCallback, useEffect } from 'react';
import type { 
  MensagemPronta, 
  CreateMensagemPronta, 
  UpdateMensagemPronta,
  MensagemProntaFilters 
} from '../types';
import {
  fetchMensagensProntas,
  fetchMensagemProntaById,
  fetchMensagensProntasByStatus,
  createMensagemPronta,
  updateMensagemPronta,
  toggleMensagemProntaActive,
  deleteMensagemPronta,
} from '../services/mensagens';
import { useToast } from './useToast';
import { getErrorMessage } from '../services/api';

export function useMensagens() {
  const [mensagens, setMensagens] = useState<MensagemPronta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  /**
   * Carrega mensagens prontas com filtros opcionais
   */
  const loadMensagens = useCallback(async (filters?: MensagemProntaFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMensagensProntas(filters);
      setMensagens(data);
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      setError(errorMsg);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Carrega uma mensagem específica por ID
   */
  const loadMensagemById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMensagemProntaById(id);
      return data;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      setError(errorMsg);
      toast.error('Erro ao carregar mensagem');
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Carrega mensagens por status
   */
  const loadMensagensByStatus = useCallback(async (statusId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMensagensProntasByStatus(statusId);
      setMensagens(data);
      return data;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      setError(errorMsg);
      toast.error('Erro ao carregar mensagens do status');
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Cria uma nova mensagem pronta
   */
  const createMensagem = useCallback(async (data: CreateMensagemPronta) => {
    setLoading(true);
    setError(null);
    try {
      const novaMensagem = await createMensagemPronta(data);
      setMensagens(prev => [...prev, novaMensagem]);
      toast.success('Mensagem criada com sucesso!');
      return novaMensagem;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      setError(errorMsg);
      toast.error(errorMsg || 'Erro ao criar mensagem');
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Atualiza uma mensagem existente
   */
  const updateMensagem = useCallback(async (id: string, data: UpdateMensagemPronta) => {
    setLoading(true);
    setError(null);
    try {
      const mensagemAtualizada = await updateMensagemPronta(id, data);
      setMensagens(prev => 
        prev.map(msg => msg.id === id ? mensagemAtualizada : msg)
      );
      toast.success('Mensagem atualizada com sucesso!');
      return mensagemAtualizada;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      setError(errorMsg);
      toast.error(errorMsg || 'Erro ao atualizar mensagem');
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Alterna o status ativo/inativo
   */
  const toggleActive = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const mensagemAtualizada = await toggleMensagemProntaActive(id);
      setMensagens(prev => 
        prev.map(msg => msg.id === id ? mensagemAtualizada : msg)
      );
      toast.success(
        `Mensagem ${mensagemAtualizada.isActive ? 'ativada' : 'desativada'} com sucesso!`
      );
      return mensagemAtualizada;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      setError(errorMsg);
      toast.error(errorMsg || 'Erro ao alternar status da mensagem');
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Deleta uma mensagem permanentemente
   */
  const deleteMensagem = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMensagemPronta(id);
      setMensagens(prev => prev.filter(msg => msg.id !== id));
      toast.success('Mensagem excluída com sucesso!');
      return true;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      setError(errorMsg);
      toast.error(errorMsg || 'Erro ao excluir mensagem');
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Auto-carrega mensagens ao montar o componente
   */
  useEffect(() => {
    loadMensagens();
  }, []);

  return {
    mensagens,
    loading,
    error,
    loadMensagens,
    loadMensagemById,
    loadMensagensByStatus,
    createMensagem,
    updateMensagem,
    toggleActive,
    deleteMensagem,
  };
}
