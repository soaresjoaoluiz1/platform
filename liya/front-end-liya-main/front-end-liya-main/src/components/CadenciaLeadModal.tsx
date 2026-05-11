import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import type { Lead } from "../types";
import {
    formatTentativaLabel,
    getProximaTentativa,
    getTentativaAtual,
    getTipoAcaoMeta,
    sortTentativas,
} from "../utils/cadencia";

interface CadenciaLeadModalProps {
    isOpen: boolean;
    lead: Lead | null;
    isLoading?: boolean;
    onClose: () => void;
    onChangeTentativa: (tentativaId: string) => Promise<void>;
}

const CadenciaLeadModal: React.FC<CadenciaLeadModalProps> = ({
    isOpen,
    lead,
    isLoading = false,
    onClose,
    onChangeTentativa,
}) => {
    const [selectedTentativaId, setSelectedTentativaId] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const tentativas = sortTentativas(lead?.cadenciaAtendimento?.tentativas);
    const tentativaAtual = getTentativaAtual(
        lead?.cadenciaAtendimento,
        lead?.tentativaAtendimentoId,
        lead?.tentativaAtual,
    );
    const proximaTentativa = getProximaTentativa(
        lead?.cadenciaAtendimento,
        lead?.tentativaAtendimentoId,
        lead?.tentativaAtual,
    );
    const primeiraTentativaId = tentativas[0]?.id || "";

    useEffect(() => {
        if (!isOpen) return;
        setSelectedTentativaId(tentativaAtual?.id || primeiraTentativaId);
    }, [isOpen, lead?.id, tentativaAtual?.id, primeiraTentativaId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !selectedTentativaId ||
            selectedTentativaId === tentativaAtual?.id
        ) {
            onClose();
            return;
        }

        setIsSaving(true);
        try {
            await onChangeTentativa(selectedTentativaId);
        } finally {
            setIsSaving(false);
        }
    };

    const hasCadencia = Boolean(lead?.cadenciaAtendimento);
    const hasTentativas = tentativas.length > 0;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            );
        }

        if (!hasCadencia) {
            return (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                    <p className="font-medium text-gray-700">
                        Este lead ainda não possui cadência associada.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Associe uma cadência ao lead no cadastro ou edição para
                        acompanhar as etapas.
                    </p>
                </div>
            );
        }

        if (!hasTentativas) {
            return (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                    <p className="font-medium text-gray-700">
                        Esta cadência não possui tentativas cadastradas.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Cadastre tentativas na seção de configurações para usar
                        esta cadência.
                    </p>
                </div>
            );
        }

        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                {tentativaAtual ? (
                    <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Ação atual
                                </p>
                                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                                    Tentativa {tentativaAtual.ordem} de{" "}
                                    {tentativas.length}
                                </h3>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600">
                                {lead?.cadenciaAtendimento?.nome}
                            </span>
                        </div>

                        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex items-center gap-3">
                                {(() => {
                                    const tipoMeta = getTipoAcaoMeta(
                                        tentativaAtual.tipoAcao,
                                    );
                                    const Icon = tipoMeta.icon;

                                    return (
                                        <>
                                            <span
                                                className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${tipoMeta.badgeClassName}`}
                                            >
                                                <Icon
                                                    className={`h-5 w-5 ${tipoMeta.iconClassName}`}
                                                />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {tipoMeta.label}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {tentativaAtual.descricao}
                                                </p>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                                <p className="font-medium text-gray-900">
                                    Instruções
                                </p>
                                <p className="mt-2 whitespace-pre-wrap">
                                    {tentativaAtual.instrucoes ||
                                        tentativaAtual.descricao}
                                </p>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                        <p className="font-medium text-gray-700">
                            Nenhuma tentativa atual foi definida para este lead.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Selecione abaixo a tentativa que deve ficar ativa.
                        </p>
                    </section>
                )}

                <section className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm font-medium text-gray-900">
                        Próxima etapa
                    </p>
                    {proximaTentativa ? (
                        <p className="mt-2 text-sm text-gray-600">
                            Tentativa {proximaTentativa.ordem}:{" "}
                            {proximaTentativa.descricao}
                        </p>
                    ) : (
                        <p className="mt-2 text-sm text-gray-500">
                            Este lead está na última tentativa da cadência.
                        </p>
                    )}
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-4">
                    <label
                        htmlFor="tentativa-atual"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Alterar etapa manualmente
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                        Use o seletor para avançar, corrigir ou pular para outra
                        tentativa válida da mesma cadência.
                    </p>
                    <select
                        id="tentativa-atual"
                        value={selectedTentativaId}
                        onChange={(e) => setSelectedTentativaId(e.target.value)}
                        className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                    >
                        {tentativas.map((tentativa) => (
                            <option key={tentativa.id} value={tentativa.id}>
                                {formatTentativaLabel(tentativa)}
                            </option>
                        ))}
                    </select>
                </section>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || !selectedTentativaId}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Confirmar alteração
                    </button>
                </div>
            </form>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="px-6 pb-6">
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Cadência de atendimento
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {lead ? `Lead: ${lead.nome}` : "Carregando lead..."}
                    </p>
                </div>

                {renderContent()}
            </div>
        </Modal>
    );
};

export default CadenciaLeadModal;
