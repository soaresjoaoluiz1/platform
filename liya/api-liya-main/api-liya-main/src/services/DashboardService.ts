import { Lead, User, Status } from '../models';
import { UserRole, StatusTipo } from '../types';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export class DashboardService {
  async getStats(userId: string, userRole: UserRole, period = '30d', from?: string, to?: string, tenantId?: string) {
    const dateFilter = this.getDateFilter(period, from, to);
    const userFilter = await this.getUserFilter(userId, userRole, tenantId);

    // Buscar status de "convertido" e "qualificado" do tenant baseado no campo tipo
    const [convertedStatus, qualifiedStatus] = await Promise.all([
      Status.findOne({
        where: { 
          ...((tenantId || userFilter.tenantId) ? { tenantId: tenantId || userFilter.tenantId } : {}),
          tipo: StatusTipo.CONVERTIDO,
          isActive: true
        },
      }),
      Status.findOne({
        where: { 
          ...((tenantId || userFilter.tenantId) ? { tenantId: tenantId || userFilter.tenantId } : {}),
          tipo: StatusTipo.QUALIFICADO,
          isActive: true
        },
      })
    ]);

    const [
      totalLeads,
      leadsConvertidos,
      leadsQualificados,
      corretoresAtivos,
      leadsPorDia,
      top5Corretores,
      leadsRecentes,
      leadsPorStatus
    ] = await Promise.all([
      this.getTotalLeads(userFilter, dateFilter),
      this.getLeadsConvertidos(userFilter, dateFilter, convertedStatus?.dataValues?.id),
      this.getLeadsQualificados(userFilter, dateFilter, qualifiedStatus?.dataValues?.id),
      this.getCorretoresAtivos(userRole, tenantId),
      this.getLeadsPorDia(userFilter, dateFilter),
      this.getTop5Corretores(userFilter, dateFilter, convertedStatus?.dataValues?.id),
      this.getLeadsRecentes(userFilter),
      this.getTotalLeadsPorStatus(userFilter, dateFilter, tenantId)
    ]);

    const taxaConversao = totalLeads > 0 ? (leadsConvertidos / totalLeads) * 100 : 0;

    return {
      stats: {
        totalLeads,
        leadsConvertidos,
        leadsQualificados,
        corretoresAtivos,
        taxaConversao: Number(taxaConversao.toFixed(2))
      },
      leadsPorDia,
      top5Corretores,
      leadsRecentes,
      leadsPorStatus
    };
  }

  private async getTotalLeads(userFilter: any, dateFilter: any) {
    return await Lead.count({
      where: {
        ...userFilter,
        ...dateFilter
      }
    });
  }

  private async getTotalLeadsPorStatus(userFilter: any, dateFilter: any, tenantId?: string) {
    // Agrupa apenas por statusId
    const results = await Lead.findAll({
      where: {
        ...userFilter,
        ...dateFilter
      },
      attributes: [
        'statusId',
        [sequelize.fn('COUNT', sequelize.col('Lead.id')), 'count']
      ],
      include: [
        {
          model: Status,
          as: 'leadStatus',
          attributes: ['name', 'color', 'ordem'],
          where: { isActive: true },
          required: false
        }
      ],
      group: ['statusId', 'leadStatus.id', 'leadStatus.name', 'leadStatus.color'],
      raw: false
    });

    return results.map((result: any) => ({
      statusId: result.dataValues.statusId,
      status: result.dataValues.leadStatus?.dataValues?.name || 'Sem Status',
      color: result.dataValues.leadStatus?.dataValues?.color || '#6B7280',
      ordem: result.dataValues.leadStatus?.dataValues?.ordem || 9999,
      count: parseInt(result.dataValues.count)
    }));
  }

  private async getLeadsConvertidos(userFilter: any, dateFilter: any, convertedStatusId?: string) {
    if (!convertedStatusId) return 0;
    
    return await Lead.count({
      where: {
        ...userFilter,
        ...dateFilter,
        statusId: convertedStatusId
      }
    });
  }

  private async getLeadsQualificados(userFilter: any, dateFilter: any, qualifiedStatusId?: string) {
    if (!qualifiedStatusId) return 0;

    return await Lead.count({
      where: {
        ...userFilter,
        ...dateFilter,
        statusId: qualifiedStatusId
      }
    });
  }

  private async getCorretoresAtivos(userRole: UserRole, tenantId?: string) {
    if (userRole === UserRole.CORRETOR) {
      return 1;
    }

    return await User.count({
      where: {
        role: UserRole.CORRETOR,
        isActive: true,
        ...(tenantId ? { tenantId } : {})
      }
    });
  }

  private async getLeadsPorDia(userFilter: any, dateFilter: any) {
    const results = await Lead.findAll({
      where: {
        ...userFilter,
        ...dateFilter
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    return results.map((item: any) => ({
      date: item.date,
      count: parseInt(item.count)
    }));
  }

  private async getTop5Corretores(userFilter: any, dateFilter: any, convertedStatusId?: string) {
    const results = await Lead.findAll({
      where: {
        ...userFilter,
        ...dateFilter
      },
      attributes: [
        'assignedTo',
        [sequelize.fn('COUNT', sequelize.col('Lead.id')), 'totalLeads'],
        [
          sequelize.fn(
            'COUNT',
            sequelize.literal(
              convertedStatusId 
                ? `CASE WHEN "statusId" = '${convertedStatusId}' THEN 1 END`
                : 'CASE WHEN "statusId" IS NULL THEN 1 END'
            )
          ),
          'convertidos'
        ]
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          where: { role: UserRole.CORRETOR }
        }
      ],
      group: ['assignedTo', 'user.id', 'user.name'],
      order: [[sequelize.col('totalLeads'), 'DESC']],
      limit: 5,
      raw: false
    });

    return results.map((item: any) => {
      const totalLeads = parseInt(item.dataValues.totalLeads);
      const convertidos = parseInt(item.dataValues.convertidos || 0);
      const taxaConversao = totalLeads > 0 ? (convertidos / totalLeads) * 100 : 0;

      return {
        id: item.user.dataValues.id,
        name: item.user.dataValues.name,
        totalLeads,
        convertidos,
        taxaConversao: Number(taxaConversao.toFixed(2))
      };
    });
  }

  private async getLeadsRecentes(userFilter: any) {
    return await Lead.findAll({
      where: userFilter,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        },
        {
          model: Status,
          as: 'leadStatus',
          attributes: ['name', 'color', 'ordem']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
  }

  private getDateFilter(period: string, from?: string, to?: string) {
    if (period === 'custom' && from && to) {
      return {
        createdAt: {
          [Op.between]: [new Date(from), new Date(to)]
        }
      };
    }

    if (period === 'all') {
      return {};
    }

    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return {
      createdAt: {
        [Op.gte]: startDate
      }
    };
  }

  private async getUserFilter(userId: string, userRole: UserRole, tenantId?: string) {
    const tenantFilter = tenantId ? { tenantId } : {};
    if (userRole === UserRole.ADMIN) {
      return tenantFilter;
    }

    if (userRole === UserRole.CORRETOR) {
      return { assignedTo: userId, ...tenantFilter };
    }

    if (userRole === UserRole.IMOBILIARIA) {
      const corretores = await User.findAll({
        where: { role: UserRole.CORRETOR, ...tenantFilter },
        attributes: ['id']
      });
      return {
        assignedTo: { [Op.in]: corretores.map(c => c.id) },
        ...tenantFilter
      };
    }

    return tenantFilter;
  }
}