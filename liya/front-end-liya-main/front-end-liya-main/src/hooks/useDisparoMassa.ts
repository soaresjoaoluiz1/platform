import { useEffect, useState } from 'react';
import { DisparoMassa } from '../types';
import { disparosService } from '../services/disparos';
import { isApiEnabled, getErrorMessage } from '../services/api';
import { useToast } from './useToast';


export const useDisparoMassa = () => {
  const toast = useToast();
  const [disparos, setDisparos] = useState<DisparoMassa[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isApiEnabled) return;
      setIsLoading(true);
      try {
        const data = await disparosService.list();
        setDisparos(data);
      } catch (err) {
        const errorMsg = getErrorMessage(err).message;
        toast.error('Erro ao carregar disparos', errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [toast]);

  const createDisparo = async (
    disparoData: {
      texto: string;
      instancia: string;
      filtroStatus: string[];
      dataAgendamento?: Date;
      imagem?: File | null;
      video?: File | null;
      allLeads?: boolean;
      tipo?: 'agendado' | 'follow_up';
      followUpDays?: number;
      followUpStatusId?: string;
    },
    options?: { tenantId?: string }
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isApiEnabled) {
        const created = await disparosService.create({
          message: disparoData.texto,
          image: disparoData.imagem || undefined,
          video: disparoData.video || undefined,
          scheduledAt: disparoData.dataAgendamento?.toISOString(),
          instance: disparoData.instancia,
          filter: { statusId: disparoData.filtroStatus },
          tenantId: options?.tenantId,
          allLeads: disparoData.allLeads,
          tipo: disparoData.tipo,
          followUpDays: disparoData.followUpDays,
          followUpStatusId: disparoData.followUpStatusId,
        });
        setDisparos(prev => [created, ...prev]);
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newDisparo: DisparoMassa = {
        texto: disparoData.texto,
        imagem: disparoData.imagem ? URL.createObjectURL(disparoData.imagem) : undefined,
        video: disparoData.video ? URL.createObjectURL(disparoData.video) : undefined,
        instancia: disparoData.instancia,
        filtroStatus: disparoData.filtroStatus,
        dataAgendamento: disparoData.dataAgendamento,
        id: Date.now().toString(),
        status: 'agendado',
        totalEnvios: Math.floor(Math.random() * 100) + 10,
        allLeads: disparoData.allLeads,
        tipo: disparoData.tipo || 'agendado',
        followUpDays: disparoData.followUpDays,
        followUpStatusId: disparoData.followUpStatusId,
      };
      setDisparos(prev => [newDisparo, ...prev]);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDisparo = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isApiEnabled) {
        await disparosService.update(id, { /* marcar status via payload se necessário */ });
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      setDisparos(prev => prev.map(d => (d.id === id ? { ...d, status: 'cancelado' } : d)));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDisparo = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isApiEnabled) {
        await disparosService.remove(id);
      } else {
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      setDisparos(prev => prev.filter(d => d.id !== id));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const getDisparosAgendados = () => {
    return disparos.filter(disparo => 
      disparo.status === 'agendado' && 
      disparo.dataAgendamento && 
      disparo.dataAgendamento > new Date()
    );
  };

  return {
    disparos,
    isLoading,
    createDisparo,
    cancelDisparo,
    deleteDisparo,
    disparosAgendados: getDisparosAgendados()
  };
};