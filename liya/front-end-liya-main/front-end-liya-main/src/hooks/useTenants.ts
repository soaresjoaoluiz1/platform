import { useEffect, useState, useCallback } from 'react';
import { isApiEnabled, getErrorMessage } from '../services/api';
import { tenantsService, TenantDTO } from '../services/tenants';
import { useToast } from './useToast';

export const useTenants = (shouldLoad: boolean = true) => {
  const toast = useToast();
  const [tenants, setTenants] = useState<TenantDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTenants = useCallback(async () => {
    if (!isApiEnabled || !shouldLoad) return;
    setIsLoading(true);
    try {
      const data = await tenantsService.list();
      setTenants(data);
    } catch (err) {
      const errorData = getErrorMessage(err);
      // Não mostrar toast para erro 403 (Forbidden)
      if (errorData.status !== 403) {
        toast.error('Erro ao carregar clientes', errorData.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [shouldLoad, toast]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const toggleStatus = async (id: string, isActive: boolean) => {
    if (!isApiEnabled) return;
    try {
      await tenantsService.toggleStatus(id, isActive);
      // Atualizar localmente
      setTenants(prev => prev.map(t => 
        t.id === id ? { ...t, isActive: !t.isActive } : t
      ));
      toast.success('Status do cliente alterado com sucesso!');
    } catch (err) {
      const errorData = getErrorMessage(err);
      // Não mostrar toast para erro 403 (Forbidden)
      if (errorData.status !== 403) {
        toast.error('Erro ao alterar status do cliente', errorData.message);
      }
      throw err;
    }
  };

  const deleteTenant = async (id: string) => {
    if (!isApiEnabled) return;
    try {
      await tenantsService.delete(id);
      setTenants(prev => prev.filter(t => t.id !== id));
      toast.success('Cliente excluído com sucesso!');
    } catch (err) {
      const errorData = getErrorMessage(err);
      // Não mostrar toast para erro 403 (Forbidden)
      if (errorData.status !== 403) {
        toast.error('Erro ao excluir cliente', errorData.message);
      }
      throw err;
    }
  };

  return { 
    tenants, 
    isLoading, 
    toggleStatus, 
    deleteTenant,
    reloadTenants: loadTenants 
  };
};


