import { useState, useEffect } from 'react';
import { DashboardStats, FilterPeriod } from '../types';
import { isApiEnabled, getErrorMessage } from '../services/api';
import { dashboardService } from '../services/dashboard';
import { useToast } from './useToast';

const FILTER_PERIODS: FilterPeriod[] = [
  { label: '7 dias', value: '7d', days: 7 },
  { label: '14 dias', value: '14d', days: 14 },
  { label: '30 dias', value: '30d', days: 30 },
  { label: '90 dias', value: '90d', days: 90 },
  { label: 'Todo período', value: 'all' },
  { label: 'Personalizado', value: 'custom' }
];

export const useDashboard = (tenantId?: string) => {
  const toast = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>(FILTER_PERIODS[0]);
  const [customDateRange, setCustomDateRange] = useState({
    from: '',
    to: ''
  });


  const loadStats = async (period: FilterPeriod) => {
    setIsLoading(true);
    try {
      const params: { period?: string; from?: string; to?: string; tenantId?: string } = {};
      if (period.value !== 'custom' && period.value !== 'all') params.period = period.value;
      if (period.value === 'custom' && customDateRange.from && customDateRange.to) {
        params.from = customDateRange.from;
        params.to = customDateRange.to;
      }
      if (tenantId) {
        params.tenantId = tenantId;
      }
      if (!isApiEnabled) {
        // Sem API habilitada, retornar vazio (sem mocks)
        setStats({
          totalLeads: 0,
          leadsConvertidos: 0,
          leadsQualificados: 0,
          corretoresAtivos: 0,
          taxaConversao: 0,
          leadsPorDia: [],
          topCorretores: [],
          leadsRecentes: [],
          leadsPorStatus: [],
        });
        return;
      }
      const data = await dashboardService.stats(params);
      setStats(data);
    } catch (err) {
      const errorMsg = getErrorMessage(err).message;
      toast.error('Erro ao carregar estatísticas', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats(selectedPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, customDateRange.from, customDateRange.to, tenantId]);

  const changePeriod = (period: FilterPeriod) => {
    setSelectedPeriod(period);
  };

  const applyCustomDateRange = (from: string, to: string) => {
    setCustomDateRange({ from, to });
    const customPeriod: FilterPeriod = {
      label: `${from} até ${to}`,
      value: 'custom'
    };
    setSelectedPeriod(customPeriod);
  };

  return {
    stats,
    isLoading,
    selectedPeriod,
    customDateRange,
    filterPeriods: FILTER_PERIODS,
    changePeriod,
    applyCustomDateRange,
    refreshStats: () => loadStats(selectedPeriod)
  };
};