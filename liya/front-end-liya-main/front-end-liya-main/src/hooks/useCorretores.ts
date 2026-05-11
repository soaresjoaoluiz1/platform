import { useEffect, useState } from 'react';
import { User } from '../types';
import { usersService, type CreateUserInput } from '../services/users';
import { isApiEnabled, getErrorMessage } from '../services/api';
import { mapUserFromApi, type ApiUser } from '../services/mappers';
import { useToast } from './useToast';

export const useCorretores = () => {
  const toast = useToast();
  const [corretores, setCorretores] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      if (!isApiEnabled) return;
      setIsLoading(true);
      try {
        const data = await usersService.corretores({ tenantId });
        
        setCorretores(data);
      } catch (err) {
        const errorMsg = getErrorMessage(err).message;
        toast.error('Erro ao carregar vendedores', errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [tenantId]);

  const toggleStatus = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isApiEnabled) {
        const updated = await usersService.toggleStatus(id);
        const mapped = mapUserFromApi(updated as unknown as ApiUser);
        setCorretores(prev => prev.map(c => (c.id === id ? mapped : c)));
        toast.success('Status alterado com sucesso!');
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 800));
      setCorretores(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
      toast.success('Status alterado com sucesso!');
      return true;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      toast.error('Erro ao alterar status', errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRoleta = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isApiEnabled) {
        const updated = await usersService.toggleRoleta(id);
        const mapped = mapUserFromApi(updated as unknown as ApiUser);
        setCorretores(prev => prev.map(c => (c.id === id ? mapped : c)));
        toast.success('Participação na roleta alterada com sucesso!');
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 600));
      setCorretores(prev => prev.map(c => (c.id === id ? { ...c, participateInRoleta: !c.participateInRoleta } : c)));
      toast.success('Participação na roleta alterada com sucesso!');
      return true;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      toast.error('Erro ao alterar participação na roleta', errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCorretor = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isApiEnabled) {
        await usersService.remove(id);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCorretores(prev => prev.filter(c => c.id !== id));
      toast.success('Vendedor excluído com sucesso!');
      return true;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      toast.error('Erro ao excluir vendedor', errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createCorretor = async (corretorData: Omit<User, 'id'> & { password?: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isApiEnabled) {
        const created = await usersService.create(corretorData as CreateUserInput);
        const mapped = mapUserFromApi(created as unknown as ApiUser);
        setCorretores(prev => [mapped, ...prev]);
        toast.success('Vendedor cadastrado com sucesso!');
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1200));
      const newCorretor: User = { ...corretorData, id: Date.now().toString() };
      setCorretores(prev => [newCorretor, ...prev]);
      toast.success('Vendedor cadastrado com sucesso!');
      return true;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      toast.error('Erro ao cadastrar vendedor', errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCorretor = async (id: string, corretorData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isApiEnabled) {
        const updated = await usersService.update(id, corretorData);
        const mapped = mapUserFromApi(updated as unknown as ApiUser);
        setCorretores(prev => prev.map(c => (c.id === id ? mapped : c)));
        toast.success('Vendedor atualizado com sucesso!');
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 900));
      setCorretores(prev => prev.map(c => (c.id === id ? { ...c, ...corretorData } : c)));
      toast.success('Vendedor atualizado com sucesso!');
      return true;
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      toast.error('Erro ao atualizar vendedor', errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    corretores,
    isLoading,
  setTenantId,
    toggleStatus,
    toggleRoleta,
    deleteCorretor,
    createCorretor,
    updateCorretor
  };
};