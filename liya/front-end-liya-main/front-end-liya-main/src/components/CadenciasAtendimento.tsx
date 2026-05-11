import React, { useMemo, useState } from "react";
import { ArrowRight, Edit, Plus, Save, Trash2, X } from "lucide-react";
import Modal from "./Modal";
import ConfirmationModal from "./ConfirmationModal";
import { useCadencias } from "../hooks/useCadencias";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import {
    TipoAcao,
    type CadenciaAtendimento,
    type CreateCadenciaAtendimento,
    type CreateTentativaAtendimento,
    type TentativaAtendimento,
} from "../types";
import { getTipoAcaoMeta, sortTentativas } from "../utils/cadencia";

type CadenciaFormState = CreateCadenciaAtendimento & {
    ativo: boolean;
};

type TentativaFormState = CreateTentativaAtendimento;

const initialCadenciaForm: CadenciaFormState = {
    nome: "",
    descricao: "",
    ativo: true,
};

const initialTentativaForm: TentativaFormState = {
    ordem: 1,
    tipoAcao: TipoAcao.MENSAGEM,
    descricao: "",
    instrucoes: "",
};

const CadenciasAtendimento: React.FC = () => {
    const { logout } = useAuth();
    const { error, success } = useToast();
    const {
        cadencias,
        isLoading,
        createCadencia,
        updateCadencia,
        deleteCadencia,
        createTentativa,
        updateTentativa,
        deleteTentativa,
    } = useCadencias({
        onError: (message, isTokenExpired) => {
            if (isTokenExpired) {
                error("Token Expirado", message);
            } else {
                error("Erro", message);
            }
        },
        onSuccess: (message) => success("Sucesso", message),
        onTokenExpired: () => {
            setTimeout(() => logout(), 2000);
        },
    });

    const [selectedCadenciaId, setSelectedCadenciaId] = useState<string>("");
    const [showCadenciaModal, setShowCadenciaModal] = useState(false);
    const [showTentativaModal, setShowTentativaModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<
        null | (() => Promise<void>)
    >(null);
    const [confirmContent, setConfirmContent] = useState({
        title: "",
        message: "",
    });
    const [editingCadencia, setEditingCadencia] =
        useState<CadenciaAtendimento | null>(null);
    const [editingTentativa, setEditingTentativa] =
        useState<TentativaAtendimento | null>(null);
    const [cadenciaForm, setCadenciaForm] =
        useState<CadenciaFormState>(initialCadenciaForm);
    const [tentativaForm, setTentativaForm] =
        useState<TentativaFormState>(initialTentativaForm);

    const selectedCadencia = useMemo(() => {
        return (
            cadencias.find((cadencia) => cadencia.id === selectedCadenciaId) ||
            cadencias[0] ||
            null
        );
    }, [cadencias, selectedCadenciaId]);

    const tentativasOrdenadas = sortTentativas(selectedCadencia?.tentativas);

    React.useEffect(() => {
        if (!selectedCadenciaId && cadencias[0]?.id) {
            setSelectedCadenciaId(cadencias[0].id);
        }

        if (
            selectedCadenciaId &&
            !cadencias.some((cadencia) => cadencia.id === selectedCadenciaId)
        ) {
            setSelectedCadenciaId(cadencias[0]?.id || "");
        }
    }, [cadencias, selectedCadenciaId]);

    const openCadenciaModal = (cadencia?: CadenciaAtendimento) => {
        setEditingCadencia(cadencia || null);
        setCadenciaForm(
            cadencia
                ? {
                      nome: cadencia.nome,
                      descricao: cadencia.descricao || "",
                      ativo: cadencia.ativo,
                  }
                : initialCadenciaForm,
        );
        setShowCadenciaModal(true);
    };

    const openTentativaModal = (tentativa?: TentativaAtendimento) => {
        if (!selectedCadencia) {
            error(
                "Erro",
                "Selecione uma cadência antes de cadastrar tentativas.",
            );
            return;
        }

        setEditingTentativa(tentativa || null);
        setTentativaForm(
            tentativa
                ? {
                      ordem: tentativa.ordem,
                      tipoAcao: tentativa.tipoAcao,
                      descricao: tentativa.descricao,
                      instrucoes: tentativa.instrucoes || "",
                  }
                : {
                      ...initialTentativaForm,
                      ordem: tentativasOrdenadas.length + 1,
                  },
        );
        setShowTentativaModal(true);
    };

    const closeCadenciaModal = () => {
        setShowCadenciaModal(false);
        setEditingCadencia(null);
        setCadenciaForm(initialCadenciaForm);
    };

    const closeTentativaModal = () => {
        setShowTentativaModal(false);
        setEditingTentativa(null);
        setTentativaForm(initialTentativaForm);
    };

    const validateTentativa = () => {
        if (!selectedCadencia) {
            error("Erro", "Nenhuma cadência selecionada.");
            return false;
        }

        const duplicatedOrder = tentativasOrdenadas.some(
            (tentativa) =>
                tentativa.ordem === tentativaForm.ordem &&
                tentativa.id !== editingTentativa?.id,
        );

        if (duplicatedOrder) {
            error(
                "Ordem duplicada",
                "Não pode haver duas tentativas com a mesma ordem na mesma cadência.",
            );
            return false;
        }

        return true;
    };

    const handleCadenciaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nome: cadenciaForm.nome.trim(),
            descricao: cadenciaForm.descricao.trim() || undefined,
            ativo: cadenciaForm.ativo,
        };

        const result = editingCadencia
            ? await updateCadencia(editingCadencia.id, payload)
            : await createCadencia(payload);

        if (result) {
            setSelectedCadenciaId(result.id);
            closeCadenciaModal();
        }
    };

    const handleTentativaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCadencia || !validateTentativa()) {
            return;
        }

        const payload = {
            ordem: tentativaForm.ordem,
            tipoAcao: tentativaForm.tipoAcao,
            descricao: tentativaForm.descricao.trim(),
            instrucoes: tentativaForm.instrucoes.trim() || undefined,
        };

        const result = editingTentativa
            ? await updateTentativa(
                  selectedCadencia.id,
                  editingTentativa.id,
                  payload,
              )
            : await createTentativa(selectedCadencia.id, payload);

        if (result) {
            closeTentativaModal();
        }
    };

    const handleDeleteCadencia = (cadencia: CadenciaAtendimento) => {
        setConfirmContent({
            title: "Excluir cadência",
            message: `Tem certeza que deseja excluir a cadência \"${cadencia.nome}\"?`,
        });
        setConfirmAction(() => async () => {
            await deleteCadencia(cadencia.id);
        });
        setShowConfirmModal(true);
    };

    const handleDeleteTentativa = (tentativa: TentativaAtendimento) => {
        if (!selectedCadencia) {
            return;
        }

        setConfirmContent({
            title: "Excluir tentativa",
            message: `Tem certeza que deseja excluir a tentativa ${tentativa.ordem}?`,
        });
        setConfirmAction(() => async () => {
            await deleteTentativa(selectedCadencia.id, tentativa.id);
        });
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        if (confirmAction) {
            await confirmAction();
        }
        setShowConfirmModal(false);
        setConfirmAction(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Cadência de Atendimento
                    </h2>
                    <p className="mt-1 text-gray-600">
                        Configure a sequência de tentativas que orienta o
                        próximo contato com cada lead.
                    </p>
                </div>
                <button
                    onClick={() => openCadenciaModal()}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition hover:bg-black"
                >
                    <Plus className="h-4 w-4" />
                    Nova Cadência
                </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
                <section className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Cadências cadastradas
                        </h3>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            {cadencias.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {cadencias.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                                Nenhuma cadência cadastrada ainda.
                            </div>
                        ) : (
                            cadencias.map((cadencia) => (
                                <button
                                    type="button"
                                    key={cadencia.id}
                                    onClick={() =>
                                        setSelectedCadenciaId(cadencia.id)
                                    }
                                    className={`w-full rounded-xl border p-4 text-left transition ${
                                        selectedCadencia?.id === cadencia.id
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-semibold">
                                                {cadencia.nome}
                                            </p>
                                            <p
                                                className={`mt-1 text-sm ${
                                                    selectedCadencia?.id ===
                                                    cadencia.id
                                                        ? "text-gray-200"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {cadencia.descricao ||
                                                    "Sem descrição"}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                cadencia.ativo
                                                    ? selectedCadencia?.id ===
                                                      cadencia.id
                                                        ? "bg-white/15 text-white"
                                                        : "bg-emerald-50 text-emerald-700"
                                                    : selectedCadencia?.id ===
                                                        cadencia.id
                                                      ? "bg-white/10 text-gray-200"
                                                      : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {cadencia.ativo
                                                ? "Ativa"
                                                : "Inativa"}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span
                                            className={`text-xs ${
                                                selectedCadencia?.id ===
                                                cadencia.id
                                                    ? "text-gray-300"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {(cadencia.tentativas || []).length}{" "}
                                            tentativa(s)
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openCadenciaModal(cadencia);
                                                }}
                                                className="rounded-lg p-2 hover:bg-black/5"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </span>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCadencia(
                                                        cadencia,
                                                    );
                                                }}
                                                className="rounded-lg p-2 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </section>

                <section className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedCadencia?.nome ||
                                    "Selecione uma cadência"}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {selectedCadencia?.descricao ||
                                    "As tentativas definem a ordem e a instrução de cada contato."}
                            </p>
                        </div>
                        <button
                            onClick={() => openTentativaModal()}
                            disabled={!selectedCadencia}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            Nova Tentativa
                        </button>
                    </div>

                    {!selectedCadencia ? (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500">
                            Escolha uma cadência para ver e editar as
                            tentativas.
                        </div>
                    ) : tentativasOrdenadas.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500">
                            Cadência sem tentativas. Cadastre a primeira etapa
                            para começar.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tentativasOrdenadas.map((tentativa, index) => {
                                const tipoMeta = getTipoAcaoMeta(
                                    tentativa.tipoAcao,
                                );
                                const Icon = tipoMeta.icon;
                                const proxima = tentativasOrdenadas[index + 1];

                                return (
                                    <div
                                        key={tentativa.id}
                                        className="rounded-xl border border-gray-200 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                                                    {tentativa.ordem}
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${tipoMeta.badgeClassName}`}
                                                        >
                                                            <Icon
                                                                className={`h-3.5 w-3.5 ${tipoMeta.iconClassName}`}
                                                            />
                                                            {tipoMeta.label}
                                                        </span>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {
                                                                tentativa.descricao
                                                            }
                                                        </p>
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        {tentativa.instrucoes ||
                                                            "Sem instruções detalhadas."}
                                                    </p>
                                                    <p className="mt-3 inline-flex items-center gap-2 text-xs text-gray-500">
                                                        <ArrowRight className="h-3.5 w-3.5" />
                                                        Próxima etapa:{" "}
                                                        {proxima?.descricao ||
                                                            "não existe próxima etapa"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openTentativaModal(
                                                            tentativa,
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                                    title="Editar tentativa"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteTentativa(
                                                            tentativa,
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                                                    title="Excluir tentativa"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            <Modal isOpen={showCadenciaModal} onClose={closeCadenciaModal}>
                <form onSubmit={handleCadenciaSubmit} className="px-6 pb-6">
                    <h3 className="mb-6 text-xl font-semibold text-gray-900">
                        {editingCadencia ? "Editar Cadência" : "Nova Cadência"}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={cadenciaForm.nome}
                                onChange={(e) =>
                                    setCadenciaForm((current) => ({
                                        ...current,
                                        nome: e.target.value,
                                    }))
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Descrição
                            </label>
                            <textarea
                                value={cadenciaForm.descricao}
                                onChange={(e) =>
                                    setCadenciaForm((current) => ({
                                        ...current,
                                        descricao: e.target.value,
                                    }))
                                }
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>

                        <label className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={cadenciaForm.ativo}
                                onChange={(e) =>
                                    setCadenciaForm((current) => ({
                                        ...current,
                                        ativo: e.target.checked,
                                    }))
                                }
                                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-800"
                            />
                            Cadência ativa para associação a leads
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={closeCadenciaModal}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            Salvar
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={showTentativaModal} onClose={closeTentativaModal}>
                <form onSubmit={handleTentativaSubmit} className="px-6 pb-6">
                    <h3 className="mb-6 text-xl font-semibold text-gray-900">
                        {editingTentativa
                            ? "Editar Tentativa"
                            : "Nova Tentativa"}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Ordem
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={tentativaForm.ordem}
                                onChange={(e) =>
                                    setTentativaForm((current) => ({
                                        ...current,
                                        ordem:
                                            Number.parseInt(
                                                e.target.value,
                                                10,
                                            ) || 1,
                                    }))
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Tipo de ação
                            </label>
                            <select
                                value={tentativaForm.tipoAcao}
                                onChange={(e) =>
                                    setTentativaForm((current) => ({
                                        ...current,
                                        tipoAcao: e.target.value as TipoAcao,
                                    }))
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            >
                                {Object.values(TipoAcao).map((tipoAcao) => (
                                    <option key={tipoAcao} value={tipoAcao}>
                                        {getTipoAcaoMeta(tipoAcao).label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Descrição
                            </label>
                            <input
                                type="text"
                                value={tentativaForm.descricao}
                                onChange={(e) =>
                                    setTentativaForm((current) => ({
                                        ...current,
                                        descricao: e.target.value,
                                    }))
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Instruções
                            </label>
                            <textarea
                                value={tentativaForm.instrucoes}
                                onChange={(e) =>
                                    setTentativaForm((current) => ({
                                        ...current,
                                        instrucoes: e.target.value,
                                    }))
                                }
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={closeTentativaModal}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            Salvar
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirm}
                title={confirmContent.title}
                message={confirmContent.message}
                confirmText="Excluir"
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
};

export default CadenciasAtendimento;
