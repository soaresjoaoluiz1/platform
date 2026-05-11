import React, { useState } from "react";
import {
    Building,
    Check,
    Copy,
    Mail,
    Pencil,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Trash2,
    User,
} from "lucide-react";
import { useTenants } from "../hooks/useTenants";
import CadastroClienteModal from "./CadastroClienteModal";
import ConfirmationModal from "./ConfirmationModal";
import { TenantDTO } from "../services/tenants";

const CadastroImobiliaria: React.FC = () => {
    const { tenants, isLoading, toggleStatus, deleteTenant, reloadTenants } =
        useTenants();
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [tenantToEdit, setTenantToEdit] = useState<TenantDTO | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [tenantToDelete, setTenantToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const filteredTenants = tenants.filter(
        (tenant) =>
            tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.admin?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            tenant.admin?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const handleToggleStatus = async (id: string, isActive: boolean) => {
        try {
            await toggleStatus(id, isActive);
        } catch {
            // Erro já tratado no hook com toast
        }
    };

    const handleDeleteClick = (tenant: { id: string; name: string }) => {
        setTenantToDelete(tenant);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!tenantToDelete) return;

        try {
            await deleteTenant(tenantToDelete.id);
            setShowConfirmModal(false);
            setTenantToDelete(null);
        } catch {
            // Erro já tratado no hook com toast
        }
    };

    const handleModalSuccess = () => {
        reloadTenants();
    };

    const handleOpenCreate = () => {
        setTenantToEdit(null);
        setShowModal(true);
    };

    const handleOpenEdit = (tenant: TenantDTO) => {
        setTenantToEdit(tenant);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTenantToEdit(null);
    };

    const [copiedId, setCopiedId] = useState<string | null>(null);
    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Clientes
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Gerencie os clientes cadastrados no sistema
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Novo Cliente</span>
                </button>
            </div>

            {/* Barra de busca */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar clientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                    />
                </div>
            </div>

            {/* Lista de Clientes */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {filteredTenants.length === 0 ? (
                            <div className="text-center py-12">
                                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">
                                    {searchTerm
                                        ? "Nenhum cliente encontrado."
                                        : "Nenhum cliente cadastrado ainda."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nome do Cliente
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Administrador
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contato
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTenants.map((tenant) => (
                                            <tr
                                                key={tenant.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-1">
                                                        <span
                                                            className="font-mono text-xs text-gray-500"
                                                            title={tenant.id}
                                                        >
                                                            {tenant.id.slice(
                                                                0,
                                                                10,
                                                            )}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleCopyId(
                                                                    tenant.id,
                                                                )
                                                            }
                                                            className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
                                                            title="Copiar ID completo"
                                                        >
                                                            {copiedId ===
                                                            tenant.id ? (
                                                                <Check className="h-3.5 w-3.5 text-green-500" />
                                                            ) : (
                                                                <Copy className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                            <Building className="h-5 w-5 text-gray-900" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {tenant.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {tenant.admin ? (
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <User className="h-4 w-4 mr-2 text-gray-500" />
                                                            <span>
                                                                {
                                                                    tenant.admin
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            Sem administrador
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {tenant.admin?.email ? (
                                                        <div className="flex items-center text-sm text-gray-700">
                                                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                                            <span>
                                                                {
                                                                    tenant.admin
                                                                        .email
                                                                }
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                            tenant.isActive
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {tenant.isActive
                                                            ? "Ativo"
                                                            : "Inativo"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleOpenEdit(
                                                                    tenant,
                                                                )
                                                            }
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Pencil className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    tenant.id,
                                                                    !tenant.isActive,
                                                                )
                                                            }
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                tenant.isActive
                                                                    ? "text-green-600 hover:bg-green-50"
                                                                    : "text-gray-400 hover:bg-gray-50"
                                                            }`}
                                                            title={
                                                                tenant.isActive
                                                                    ? "Desativar"
                                                                    : "Ativar"
                                                            }
                                                        >
                                                            {tenant.isActive ? (
                                                                <ToggleRight className="h-5 w-5" />
                                                            ) : (
                                                                <ToggleLeft className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    tenant,
                                                                )
                                                            }
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Cadastro */}
            <CadastroClienteModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSuccess={handleModalSuccess}
                tenantToEdit={tenantToEdit}
            />

            {/* Modal de Confirmação */}
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setTenantToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Excluir Cliente"
                message={`Tem certeza que deseja excluir o cliente "${tenantToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
};

export default CadastroImobiliaria;
