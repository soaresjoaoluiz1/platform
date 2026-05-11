import React, { useState } from "react";
import { Plus, Edit, Trash2, Save, X, Copy } from "lucide-react";
import Modal from "./Modal";
import ConfirmationModal from "./ConfirmationModal";
import { useStatus } from "../hooks/useStatus";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { Status, StatusTipo } from "../types";

const StatusLeads: React.FC = () => {
    const { user, logout } = useAuth();
    const { error, success } = useToast();
    const { status, isLoading, createStatus, updateStatus, deleteStatus } =
        useStatus({
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

    const [showModal, setShowModal] = useState(false);
    const [editingStatus, setEditingStatus] = useState<Status | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState<Status | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        color: string;
        tipo: StatusTipo;
        ordem: number;
        isActive: boolean;
    }>({
        name: "",
        color: "#3B82F6",
        tipo: StatusTipo.NOVO,
        ordem: 1,
        isActive: true,
    });

    const colors = [
        "#3B82F6", // blue
        "#10B981", // green
        "#F59E0B", // yellow
        "#EF4444", // red
        "#8B5CF6", // purple
        "#F97316", // orange
        "#06B6D4", // cyan
        "#84CC16", // lime
        "#EC4899", // pink
        "#6B7280", // gray
    ];

    const handleOpenModal = (statusItem?: Status) => {
        if (statusItem) {
            setEditingStatus(statusItem);
            setFormData({
                name: statusItem.name,
                color: statusItem.color,
                tipo: statusItem.tipo,
                ordem: statusItem.ordem,
                isActive: statusItem.isActive,
            });
        } else {
            setEditingStatus(null);
            setFormData({
                name: "",
                color: "#3B82F6",
                tipo: StatusTipo.NOVO,
                ordem: 1,
                isActive: true,
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingStatus(null);
        setFormData({
            name: "",
            color: "#3B82F6",
            tipo: StatusTipo.NOVO,
            ordem: 1,
            isActive: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingStatus) {
            await updateStatus(editingStatus.id, formData);
        } else {
            await createStatus(formData);
        }

        handleCloseModal();
    };

    const handleDelete = (statusItem: Status) => {
        setStatusToDelete(statusItem);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (statusToDelete) {
            await deleteStatus(statusToDelete.id);
            setStatusToDelete(null);
        }
    };

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setStatusToDelete(null);
    };

    const handleCopyId = async (statusId: string) => {
        try {
            await navigator.clipboard.writeText(statusId);
            success("Sucesso", "ID copiado para a área de transferência");
        } catch {
            error("Erro", "Falha ao copiar ID");
        }
    };

    // Só donos de imobiliária e admins podem gerenciar status
    if (user?.role === "CORRETOR") {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600">
                        Acesso Negado
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Apenas proprietários de imobiliária podem gerenciar
                        status de leads.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600">
                        Gerencie os status personalizados para seus leads
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Novo Status</span>
                </button>
            </div>
            {/* Status List */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                        </div>
                    ) : (
                        <>
                            {status.length === 0 ? (
                                <div className="text-center py-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Nenhum status encontrado
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Crie seu primeiro status personalizado
                                    </p>
                                    <button
                                        onClick={() => handleOpenModal()}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black"
                                    >
                                        Criar Status
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {[...status]
                                        .sort((a, b) => a.ordem - b.ordem)
                                        .map((statusItem) => (
                                            <div
                                                key={statusItem.id}
                                                className={`flex items-center justify-between p-4 border rounded-lg ${
                                                    statusItem.isActive
                                                        ? "bg-white"
                                                        : "bg-gray-50 opacity-60"
                                                }`}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                statusItem.color,
                                                        }}
                                                    />
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            {statusItem.name}
                                                            {statusItem.isDefault && (
                                                                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                                                    Padrão
                                                                </span>
                                                            )}
                                                            {!statusItem.isActive && (
                                                                <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded">
                                                                    Inativo
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Ordem:{" "}
                                                            {statusItem.ordem}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleCopyId(
                                                                statusItem.id,
                                                            )
                                                        }
                                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                                        title="Copiar ID"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleOpenModal(
                                                                statusItem,
                                                            )
                                                        }
                                                        disabled={
                                                            !statusItem.canUpdate
                                                        }
                                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    {!statusItem.isDefault && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    statusItem,
                                                                )
                                                            }
                                                            disabled={
                                                                !statusItem.canUpdate
                                                            }
                                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {/* Modal para criar/editar status */}
            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        {editingStatus ? "Editar Status" : "Novo Status"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nome do Status
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                placeholder="Ex: Prospect Qualificado"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="ordem"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Ordem
                            </label>
                            <input
                                type="number"
                                id="ordem"
                                min="1"
                                value={formData.ordem}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        ordem:
                                            Number.parseInt(e.target.value) ||
                                            1,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="1"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Define a ordem do status no funil de vendas
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="color"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Cor do Status
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() =>
                                            setFormData({ ...formData, color })
                                        }
                                        className={`w-8 h-8 rounded-full border-2 ${
                                            formData.color === color
                                                ? "border-gray-800"
                                                : "border-gray-300"
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <input
                                type="color"
                                id="color"
                                value={formData.color}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        color: e.target.value,
                                    })
                                }
                                className="w-full h-10 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="tipo"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Tipo de Status
                            </label>
                            <select
                                id="tipo"
                                value={formData.tipo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tipo: e.target.value as StatusTipo,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                required
                            >
                                <option value={StatusTipo.NOVO}>Novo</option>
                                <option value={StatusTipo.CONTATO}>
                                    Em Contato
                                </option>
                                <option value={StatusTipo.CONVERTIDO}>
                                    Convertido
                                </option>
                                <option value={StatusTipo.QUALIFICADO}>
                                    Qualificado
                                </option>
                                <option value={StatusTipo.PROPOSTA}>
                                    Proposta
                                </option>
                                <option value={StatusTipo.PERDIDO}>
                                    Perdido
                                </option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isActive: e.target.checked,
                                    })
                                }
                                className="h-4 w-4 text-gray-900 focus:ring-gray-800 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="isActive"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Status ativo
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                            >
                                <X className="h-4 w-4" />
                                <span>Cancelar</span>
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-50 flex items-center space-x-2"
                            >
                                <Save className="h-4 w-4" />
                                <span>
                                    {(() => {
                                        if (isLoading) return "Salvando...";
                                        return editingStatus
                                            ? "Atualizar"
                                            : "Criar";
                                    })()}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>{" "}
            {/* Modal de confirmação para exclusão */}
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={handleCloseConfirmModal}
                onConfirm={confirmDelete}
                title="Excluir Status"
                message={`Tem certeza que deseja excluir o status "${statusToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
            />
        </div>
    );
};

export default StatusLeads;
