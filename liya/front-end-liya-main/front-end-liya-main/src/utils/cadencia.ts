import {
    CalendarDays,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    type LucideIcon,
} from "lucide-react";
import {
    TipoAcao,
    type CadenciaAtendimento,
    type TentativaAtendimento,
} from "../types";

type TipoAcaoMeta = {
    label: string;
    icon: LucideIcon;
    badgeClassName: string;
    iconClassName: string;
};

const tipoAcaoMeta: Record<TipoAcao, TipoAcaoMeta> = {
    [TipoAcao.MENSAGEM]: {
        label: "Mensagem",
        icon: MessageSquare,
        badgeClassName: "bg-blue-50 text-blue-700 border-blue-100",
        iconClassName: "text-blue-600",
    },
    [TipoAcao.LIGACAO]: {
        label: "Ligação",
        icon: Phone,
        badgeClassName: "bg-emerald-50 text-emerald-700 border-emerald-100",
        iconClassName: "text-emerald-600",
    },
    [TipoAcao.EMAIL]: {
        label: "E-mail",
        icon: Mail,
        badgeClassName: "bg-amber-50 text-amber-700 border-amber-100",
        iconClassName: "text-amber-600",
    },
    [TipoAcao.REUNIAO]: {
        label: "Reunião",
        icon: CalendarDays,
        badgeClassName: "bg-violet-50 text-violet-700 border-violet-100",
        iconClassName: "text-violet-600",
    },
    [TipoAcao.WHATSAPP]: {
        label: "WhatsApp",
        icon: MessageSquare,
        badgeClassName: "bg-lime-50 text-lime-700 border-lime-100",
        iconClassName: "text-lime-600",
    },
    [TipoAcao.VISITA]: {
        label: "Visita",
        icon: MapPin,
        badgeClassName: "bg-rose-50 text-rose-700 border-rose-100",
        iconClassName: "text-rose-600",
    },
};

export const getTipoAcaoMeta = (tipoAcao: TipoAcao | string) => {
    return (
        tipoAcaoMeta[(tipoAcao as TipoAcao) || TipoAcao.MENSAGEM] ||
        tipoAcaoMeta[TipoAcao.MENSAGEM]
    );
};

export const sortTentativas = (
    tentativas?: TentativaAtendimento[],
): TentativaAtendimento[] => {
    return [...(tentativas || [])].sort((a, b) => a.ordem - b.ordem);
};

export const getTentativaAtual = (
    cadencia?: CadenciaAtendimento,
    tentativaAtualId?: string,
    tentativaAtual?: TentativaAtendimento,
) => {
    if (tentativaAtual) {
        return tentativaAtual;
    }

    return sortTentativas(cadencia?.tentativas).find(
        (tentativa) => tentativa.id === tentativaAtualId,
    );
};

export const getProximaTentativa = (
    cadencia?: CadenciaAtendimento,
    tentativaAtualId?: string,
    tentativaAtual?: TentativaAtendimento,
) => {
    const ordenadas = sortTentativas(cadencia?.tentativas);
    const atual = getTentativaAtual(cadencia, tentativaAtualId, tentativaAtual);

    if (!atual) {
        return ordenadas[0];
    }

    return ordenadas.find((tentativa) => tentativa.ordem > atual.ordem);
};

export const formatTentativaLabel = (tentativa: TentativaAtendimento) => {
    return `${tentativa.ordem}. ${tentativa.descricao}`;
};
