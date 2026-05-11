import { Roleta, User } from "../models";
import { Op } from "sequelize";

export class RoletaService {
    /**
     * Lista todas as roletas de um tenant
     */
    async listRoletas(tenantId: string) {
        const roletas = await Roleta.findAll({
            where: { tenantId },
            order: [["tipo", "ASC"]],
        });

        return roletas;
    }

    /**
     * Busca uma roleta específica por ID
     */
    async getRoletaById(id: string, tenantId: string) {
        const roleta = await Roleta.findOne({
            where: { id, tenantId },
        });

        return roleta;
    }

    /**
     * Busca roleta por tipo
     */
    async getRoletaByTipo(tipo: string, tenantId: string) {
        const roleta = await Roleta.findOne({
            where: { tipo, tenantId },
        });

        return roleta;
    }

    /**
     * Cria uma nova roleta
     * Verifica se já existem 2 roletas para o tenant
     */
    async createRoleta(tipo: string, tenantId: string, sequencia: number = 1) {
        // Verificar quantas roletas o tenant já possui
        const count = await Roleta.count({
            where: { tenantId },
        });

        if (count >= 2) {
            throw new Error("Só são permitidas no máximo 2 roletas.");
        }

        // Verificar se já existe uma roleta com esse tipo
        const existing = await this.getRoletaByTipo(tipo, tenantId);
        if (existing) {
            throw new Error(`Já existe uma roleta do tipo ${tipo}.`);
        }

        // Validar sequência com número de vendedores
        await this.validateSequenciaWithVendedores(tenantId, sequencia);

        const roleta = await Roleta.create({
            tipo,
            tenantId,
            sequencia,
        });

        return roleta;
    }

    /**
     * Atualiza uma roleta existente
     */
    async updateRoleta(
        id: string,
        tenantId: string,
        data: { tipo?: string; sequencia?: number },
    ) {
        const roleta = await this.getRoletaById(id, tenantId);

        if (!roleta) {
            throw new Error("Roleta não encontrada");
        }

        if (
            roleta.dataValues.tipo === "VENDA" &&
            data.tipo &&
            data.tipo !== "VENDA"
        ) {
            throw new Error("Não é permitido alterar o tipo da roleta VENDA");
        }

        // Se está tentando alterar o tipo, verificar se não existe outro com esse tipo
        if (data.tipo && data.tipo !== roleta.dataValues.tipo) {
            const existing = await this.getRoletaByTipo(data.tipo, tenantId);
            if (existing && existing.id !== id) {
                throw new Error(`Já existe uma roleta do tipo ${data.tipo}.`);
            }
        }

        // Validar sequência com número de vendedores
        if (data.sequencia !== undefined) {
            await this.validateSequenciaWithVendedores(
                tenantId,
                data.sequencia,
            );
        }

        await roleta.update(data);
        await roleta.reload();

        return roleta;
    }

    /**
     * Atualiza apenas a sequência da roleta
     */
    async updateSequencia(id: string, tenantId: string, sequencia: number) {
        const roleta = await this.getRoletaById(id, tenantId);

        if (!roleta) {
            throw new Error("Roleta não encontrada");
        }

        // Validar sequência com número de vendedores
        await this.validateSequenciaWithVendedores(tenantId, sequencia);

        await roleta.update({ sequencia });
        await roleta.reload();

        return roleta;
    }

    /**
     * Incrementa a sequência da roleta (para uso na automação)
     */
    async incrementSequencia(id: string, tenantId: string) {
        const roleta = await this.getRoletaById(id, tenantId);

        if (!roleta) {
            throw new Error("Roleta não encontrada");
        }

        // Contar quantos vendedores participam da roleta
        const totalVendedores =
            await this.countVendedoresParticipantes(tenantId);

        // Se a sequência atual é igual ao número de vendedores, volta para 1
        // Senão, incrementa
        const novaSequencia =
            roleta.dataValues.sequencia >= totalVendedores
                ? 1
                : roleta.dataValues.sequencia + 1;

        await roleta.update({ sequencia: novaSequencia });
        await roleta.reload();

        return roleta;
    }

    /**
     * Deleta uma roleta
     * Não permite deletar roletas do tipo VENDA
     */
    async deleteRoleta(id: string, tenantId: string) {
        const roleta = await this.getRoletaById(id, tenantId);

        if (!roleta) {
            throw new Error("Roleta não encontrada");
        }

        if (roleta.dataValues.tipo === "VENDA") {
            throw new Error("Não é permitido excluir a roleta do tipo VENDA");
        }

        await roleta.destroy();
    }

    /**
     * Valida se a sequência não é maior que o número de vendedores
     */
    private async validateSequenciaWithVendedores(
        tenantId: string,
        sequencia: number,
    ) {
        if (sequencia < 1) {
            throw new Error("A sequência deve ser no mínimo 1");
        }

        const totalVendedores =
            await this.countVendedoresParticipantes(tenantId);

        if (sequencia > totalVendedores) {
            throw new Error(
                `A sequência não pode ser maior que o número de vendedores ativos participantes da roleta (${totalVendedores})`,
            );
        }
    }

    /**
     * Conta quantos vendedores estão ativos e participam da roleta
     */
    private async countVendedoresParticipantes(tenantId: string) {
        const count = await User.count({
            where: {
                tenantId,
                isActive: true,
                participateInRoleta: true,
                role: { [Op.in]: ["CORRETOR", "IMOBILIARIA"] },
            },
        });

        if (count === 0) {
            throw new Error(
                "Não há vendedores ativos participando da roleta para este tenant",
            );
        }

        return count;
    }

    /**
     * Obtém o próximo vendedor na roleta baseado na sequência
     */
    async getProximoVendedor(roletaId: string, tenantId: string) {
        const roleta = await this.getRoletaById(roletaId, tenantId);

        if (!roleta) {
            throw new Error("Roleta não encontrada");
        }

        // Buscar vendedores ativos que participam da roleta, ordenados por nome para manter consistência
        const vendedores = await User.findAll({
            where: {
                tenantId,
                isActive: true,
                participateInRoleta: true,
                role: { [Op.in]: ["CORRETOR", "IMOBILIARIA"] },
            },
            order: [["name", "ASC"]],
        });

        if (vendedores.length === 0) {
            throw new Error(
                "Não há vendedores disponíveis para receber o lead",
            );
        }

        // A sequência é 1-indexed, então subtraímos 1 para o array (0-indexed)
        const index = roleta.dataValues.sequencia - 1;

        // Se o índice é maior que o array, pegar o primeiro
        const vendedor = vendedores[index] || vendedores[0];

        return {
            vendedor,
            sequenciaAtual: roleta.sequencia,
            totalVendedores: vendedores.length,
        };
    }
}
