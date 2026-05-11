import React, { useState } from "react";
import { Plus, Trash2, Save, X, AlertCircle } from "lucide-react";
import { useRoletas } from "../hooks/useRoletas";
import { Roleta, CreateRoleta, UpdateRoleta } from "../types";
import ConfirmationModal from "./ConfirmationModal";

const RoletaConfig: React.FC = () => {
    const { roletas, isLoading, createRoleta, updateRoleta, deleteRoleta } =
        useRoletas();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingRoleta, setEditingRoleta] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<Roleta | null>(
        null,
    );

    // Formulário de criação
    const [newRoleta, setNewRoleta] = useState<CreateRoleta>({
        tipo: "",
        sequencia: 1,
    });

    // Formulário de edição
    const [editFormData, setEditFormData] = useState<UpdateRoleta>({});

    const handleCreate = async () => {
        if (!newRoleta.tipo.trim()) {
            return;
        }

        const success = await createRoleta(newRoleta);
        if (success) {
            setShowCreateForm(false);
            setNewRoleta({ tipo: "", sequencia: 1 });
        }
    };

    const handleStartEdit = (roleta: Roleta) => {
        setEditingRoleta(roleta.id);
        setEditFormData({
            tipo: roleta.tipo,
            sequencia: roleta.sequencia,
        });
    };

    const handleCancelEdit = () => {
        setEditingRoleta(null);
        setEditFormData({});
    };

    const handleUpdate = async (id: string) => {
        const success = await updateRoleta(id, editFormData);
        if (success) {
            setEditingRoleta(null);
            setEditFormData({});
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirmation) return;

        const success = await deleteRoleta(deleteConfirmation.id);
        if (success) {
            setDeleteConfirmation(null);
        }
    };

    const canDelete = (roleta: Roleta) => {
        return roleta.tipo !== "VENDA";
    };

    const canCreateMore = roletas.length < 2;

    return (
        <div className="space-y-6">
            {/* Header com botão de criar */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Roletas
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Gerencie até 2 roletas para distribuição automática de
                        leads entre vendedores
                    </p>
                </div>
                {canCreateMore && !showCreateForm && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Nova Roleta
                    </button>
                )}
            </div>

            {/* Formulário de criação */}
            {showCreateForm && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Criar Nova Roleta
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo da Roleta *
                            </label>
                            <input
                                type="text"
                                value={newRoleta.tipo}
                                onChange={(e) =>
                                    setNewRoleta({
                                        ...newRoleta,
                                        tipo: e.target.value,
                                    })
                                }
                                placeholder="Ex: LOCACAO, COMERCIAL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Identificador único para esta roleta
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sequência Inicial
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={newRoleta.sequencia}
                                onChange={(e) =>
                                    setNewRoleta({
                                        ...newRoleta,
                                        sequencia:
                                            parseInt(e.target.value) || 1,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Posição inicial na sequência de vendedores
                                (padrão: 1)
                            </p>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setNewRoleta({ tipo: "", sequencia: 1 });
                                }}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={!newRoleta.tipo.trim() || isLoading}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Criar Roleta
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Aviso se já tiver 2 roletas */}
            {roletas.length >= 2 && !showCreateForm && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-yellow-800 font-medium">
                            Limite de roletas atingido
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                            Você já possui 2 roletas cadastradas. Para criar uma
                            nova, é necessário excluir uma existente.
                        </p>
                    </div>
                </div>
            )}

            {/* Lista de roletas */}
            {isLoading && roletas.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="text-gray-600 mt-2">Carregando roletas...</p>
                </div>
            ) : roletas.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600">Nenhuma roleta cadastrada</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Clique em "Nova Roleta" para criar sua primeira roleta
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {roletas.map((roleta) => (
                        <div
                            key={roleta.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                        >
                            {editingRoleta === roleta.id ? (
                                // Modo de edição
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo da Roleta
                                        </label>
                                        <input
                                            type="text"
                                            value={editFormData.tipo}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    tipo: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sequência
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={editFormData.sequencia}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    sequencia:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleUpdate(roleta.id)
                                            }
                                            disabled={isLoading}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Modo de visualização
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {roleta.tipo}
                                            </h3>
                                            {roleta.tipo === "VENDA" && (
                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                                                    Padrão
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">
                                                Sequência atual:
                                            </span>{" "}
                                            {roleta.sequencia}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Criada em{" "}
                                            {new Date(
                                                roleta.createdAt,
                                            ).toLocaleDateString("pt-BR")}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleStartEdit(roleta)
                                            }
                                            className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            Editar
                                        </button>
                                        {canDelete(roleta) && (
                                            <button
                                                onClick={() =>
                                                    setDeleteConfirmation(
                                                        roleta,
                                                    )
                                                }
                                                className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center gap-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Excluir
                                            </button>
                                        )}
                                        {!canDelete(roleta) && (
                                            <div className="px-3 py-2 text-gray-400 text-xs italic">
                                                Não pode ser excluída
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de confirmação de exclusão */}
            {deleteConfirmation && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={() => setDeleteConfirmation(null)}
                    onConfirm={handleDelete}
                    title="Excluir Roleta"
                    message={`Tem certeza que deseja excluir a roleta "${deleteConfirmation.tipo}"? Esta ação não pode ser desfeita.`}
                    confirmText="Excluir"
                    cancelText="Cancelar"
                />
            )}
        </div>
    );
};

export default RoletaConfig;
