import React from "react";
import { ChevronRight } from "lucide-react";
import type { Lead } from "../types";
import {
    getProximaTentativa,
    getTentativaAtual,
    getTipoAcaoMeta,
    sortTentativas,
} from "../utils/cadencia";

interface LeadCadenciaInfoProps {
    lead: Lead;
    onClick: () => void;
    compact?: boolean;
}

const LeadCadenciaInfo: React.FC<LeadCadenciaInfoProps> = ({
    lead,
    onClick,
    compact = false,
}) => {
    const tentativaAtual = getTentativaAtual(
        lead.cadenciaAtendimento,
        lead.tentativaAtendimentoId,
        lead.tentativaAtual,
    );
    const proximaTentativa = getProximaTentativa(
        lead.cadenciaAtendimento,
        lead.tentativaAtendimentoId,
        lead.tentativaAtual,
    );
    const totalTentativas = sortTentativas(
        lead.cadenciaAtendimento?.tentativas,
    ).length;

    if (!lead.cadenciaAtendimento || !tentativaAtual) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-left transition hover:border-gray-400 hover:bg-gray-100 ${
                    compact ? "text-xs" : "text-sm"
                }`}
            >
                <p className="font-medium text-gray-700">Cadência</p>
                <p className="mt-1 text-gray-500">
                    Sem tentativa atual definida
                </p>
            </button>
        );
    }

    const tipoMeta = getTipoAcaoMeta(tentativaAtual.tipoAcao);
    const Icon = tipoMeta.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left transition hover:border-gray-300 hover:bg-white"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {tentativaAtual.descricao}
                        </span>
                        <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${tipoMeta.badgeClassName}`}
                        >
                            <Icon
                                className={`h-3.5 w-3.5 ${tipoMeta.iconClassName}`}
                            />
                            {tipoMeta.label}
                        </span>
                    </div>
                    <p className="mt-[0.5] text-xs text-gray-500">
                        Tentativa {tentativaAtual.ordem}
                        {totalTentativas > 0 ? ` de ${totalTentativas}` : ""}
                    </p>
                    <p className="mt-[0.5] truncate text-xs text-gray-500">
                        Próxima etapa:{" "}
                        {proximaTentativa?.descricao ||
                            "última etapa da cadência"}
                    </p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
            </div>
        </button>
    );
};

export default LeadCadenciaInfo;
