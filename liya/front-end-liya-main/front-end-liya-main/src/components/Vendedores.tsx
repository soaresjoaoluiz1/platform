import React, { useEffect, useState } from "react";
import {
    Check,
    Copy,
    Plus,
    Search,
    Edit,
    Trash2,
    Mail,
    MessageCircle,
    ToggleLeft,
    ToggleRight,
    Users,
    Award,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from "lucide-react";
import Modal from "./Modal";
import ConfirmationModal from "./ConfirmationModal";
import { useCorretores } from "../hooks/useCorretores";
import { useAuth } from "../contexts/AuthContext";
import { useTenants } from "../hooks/useTenants";

const Vendedores: React.FC = () => {
    const { user, hasPermission } = useAuth();
    const {
        corretores,
        isLoading,
        toggleStatus,
        toggleRoleta,
        deleteCorretor,
        createCorretor,
        updateCorretor,
        setTenantId,
    } = useCorretores();
    const { tenants } = useTenants();
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCorretor, setEditingCorretor] = useState<null | {
        id: string;
        name: string;
        email: string;
        whatsapp?: string;
        segmento?: string;
        isActive: boolean;
        participateInRoleta: boolean;
    }>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [corretorToDelete, setCorretorToDelete] = useState<null | {
        id: string;
        name: string;
    }>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        segmento: "",
        password: "",
    });
    // Paginação
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [copiedVendedorId, setCopiedVendedorId] = useState<string | null>(
        null,
    );

    // Se for corretor, mostrar apenas ele mesmo
    const displayCorretores =
        user?.role === "CORRETOR"
            ? corretores.filter((c) => c.id === user.id)
            : corretores;

    const filteredCorretores = displayCorretores.filter(
        (corretor) =>
            corretor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            corretor.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Derivados de paginação
    const totalCorretores = filteredCorretores.length;
    const totalPages = Math.max(1, Math.ceil(totalCorretores / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedCorretores = filteredCorretores.slice(
        startIndex,
        startIndex + pageSize,
    );

    // Reset/clamp page quando filtros/termo mudarem
    useEffect(() => {
        setPage(1);
    }, [searchTerm, user?.role]);
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const handleOpenModal = (corretor?: {
        id: string;
        name: string;
        email: string;
        whatsapp?: string;
        segmento?: string;
        isActive: boolean;
        participateInRoleta: boolean;
    }) => {
        if (corretor) {
            setEditingCorretor(corretor);
            setFormData({
                name: corretor.name,
                email: corretor.email,
                whatsapp: corretor.whatsapp || "",
                segmento: corretor.segmento || "",
                password: "",
            });
        } else {
            setEditingCorretor(null);
            setFormData({
                name: "",
                email: "",
                whatsapp: "",
                segmento: "",
                password: "",
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCorretor(null);
        setFormData({
            name: "",
            email: "",
            whatsapp: "",
            segmento: "",
            password: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCorretor) {
            await updateCorretor(editingCorretor.id, {
                ...formData,
                role: "CORRETOR",
                isActive: editingCorretor.isActive,
                participateInRoleta: editingCorretor.participateInRoleta,
            });
        } else {
            await createCorretor({
                ...formData,
                role: "CORRETOR",
                isActive: true,
                participateInRoleta: true,
            });
        }

        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        console.log("Deletar corretor", id);
        const corretor = corretores.find((c) => c.id === id);
        console.log("Deletar corretor", corretor);
        if (corretor)
            setCorretorToDelete({ id: corretor.id, name: corretor.name });
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (corretorToDelete) {
            await deleteCorretor(corretorToDelete.id);
            setCorretorToDelete(null);
        }
    };

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setCorretorToDelete(null);
    };

    const handleWhatsApp = (phone: string) => {
        const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, "")}`;
        window.open(whatsappUrl, "_blank");
    };

    const handleToggleStatus = async (id: string) => {
        await toggleStatus(id);
    };

    const handleToggleRoleta = async (id: string) => {
        await toggleRoleta(id);
    };

    const canManageCorretores = hasPermission(["ADMIN", "IMOBILIARIA"]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Vendedores</h1>
                {canManageCorretores && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Novo Vendedor</span>
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="vendedores-filter"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Vendedores
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                id="vendedores-filter"
                                type="text"
                                placeholder="Pesquisar vendedores..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            />
                        </div>
                    </div>
                    {user?.role === "ADMIN" && (
                        <div>
                            <label
                                htmlFor="tenant-filter"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Cliente
                            </label>
                            <select
                                id="tenant-filter"
                                onChange={(e) =>
                                    setTenantId(e.target.value || undefined)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            >
                                <option value="">Todos</option>
                                {tenants.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                Total de Vendedores
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {displayCorretores.length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                Vendedores Ativos
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    displayCorretores.filter((c) => c.isActive)
                                        .length
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                            <ToggleRight className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                Na Roleta
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    displayCorretores.filter(
                                        (c) => c.participateInRoleta,
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div
                className={`bg-white rounded-lg shadow-md overflow-hidden ${isLoading ? "opacity-50" : ""}`}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contato
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Roleta
                                </th>
                                {canManageCorretores && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Segmento
                                    </th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedCorretores.map((corretor) => {
                                return (
                                    <tr
                                        key={corretor.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-1">
                                                <span
                                                    className="font-mono text-xs text-gray-500"
                                                    title={corretor.id}
                                                >
                                                    {corretor.id.slice(0, 10)}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            corretor.id,
                                                        );
                                                        setCopiedVendedorId(
                                                            corretor.id,
                                                        );
                                                        setTimeout(
                                                            () =>
                                                                setCopiedVendedorId(
                                                                    null,
                                                                ),
                                                            1500,
                                                        );
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
                                                    title="Copiar ID completo"
                                                >
                                                    {copiedVendedorId ===
                                                    corretor.id ? (
                                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">
                                                {corretor.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {corretor.email}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {corretor.whatsapp}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            corretor.id,
                                                        )
                                                    }
                                                    disabled={
                                                        !canManageCorretores ||
                                                        isLoading
                                                    }
                                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                        corretor.isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    } ${canManageCorretores ? "hover:opacity-80 cursor-pointer" : "cursor-default"}`}
                                                >
                                                    {corretor.isActive ? (
                                                        <ToggleRight className="h-3 w-3" />
                                                    ) : (
                                                        <ToggleLeft className="h-3 w-3" />
                                                    )}
                                                    <span>
                                                        {corretor.isActive
                                                            ? "Ativo"
                                                            : "Inativo"}
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleToggleRoleta(
                                                            corretor.id,
                                                        )
                                                    }
                                                    disabled={
                                                        !canManageCorretores ||
                                                        isLoading
                                                    }
                                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                        corretor.participateInRoleta
                                                            ? "bg-purple-100 text-purple-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    } ${canManageCorretores ? "hover:opacity-80 cursor-pointer" : "cursor-default"}`}
                                                >
                                                    <Award className="h-3 w-3" />
                                                    <span>
                                                        {corretor.participateInRoleta
                                                            ? "Sim"
                                                            : "Não"}
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                        {canManageCorretores && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {corretor.segmento || "-"}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleWhatsApp(
                                                            corretor.whatsapp ||
                                                                "",
                                                        )
                                                    }
                                                    className="text-green-600 hover:text-green-900"
                                                    title="WhatsApp"
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        window.open(
                                                            `mailto:${corretor.email}`,
                                                        )
                                                    }
                                                    className="text-purple-600 hover:text-purple-900"
                                                    title="Email"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </button>
                                                {canManageCorretores && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleOpenModal(
                                                                    corretor,
                                                                )
                                                            }
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Editar"
                                                            disabled={isLoading}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    corretor.id,
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Excluir"
                                                            disabled={isLoading}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    {totalCorretores === 0 ? (
                        <span>Nenhum corretor encontrado</span>
                    ) : (
                        <span>
                            Mostrando{" "}
                            <span className="font-medium">
                                {startIndex + 1}
                            </span>
                            <span className="mx-1">–</span>
                            <span className="font-medium">
                                {Math.min(
                                    startIndex + pageSize,
                                    totalCorretores,
                                )}
                            </span>
                            <span className="mx-1">de</span>
                            <span className="font-medium">
                                {totalCorretores}
                            </span>
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                        <button
                            className="p-2 rounded border text-gray-600 disabled:opacity-40"
                            onClick={() => setPage(1)}
                            disabled={currentPage <= 1}
                            aria-label="Primeira página"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </button>
                        <button
                            className="p-2 rounded border text-gray-600 disabled:opacity-40"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            aria-label="Página anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-gray-700">
                            Página{" "}
                            <span className="font-medium">{currentPage}</span>{" "}
                            de <span className="font-medium">{totalPages}</span>
                        </span>
                        <button
                            className="p-2 rounded border text-gray-600 disabled:opacity-40"
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage >= totalPages}
                            aria-label="Próxima página"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                            className="p-2 rounded border text-gray-600 disabled:opacity-40"
                            onClick={() => setPage(totalPages)}
                            disabled={currentPage >= totalPages}
                            aria-label="Última página"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label
                            htmlFor="corretores-page-size"
                            className="text-sm text-gray-700"
                        >
                            por página
                        </label>
                        <select
                            id="corretores-page-size"
                            className="border rounded px-2 py-1 text-sm"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            {[10, 20, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {canManageCorretores && (
                <Modal isOpen={showModal} onClose={handleCloseModal}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCorretor
                                ? "Editar Corretor"
                                : "Novo Corretor"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="corretor-nome"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nome
                                </label>
                                <input
                                    id="corretor-nome"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="corretor-email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    id="corretor-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="corretor-whatsapp"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    WhatsApp
                                </label>
                                <input
                                    id="corretor-whatsapp"
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            whatsapp: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="corretor-segmento"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Segmento
                                </label>
                                <input
                                    id="corretor-segmento"
                                    type="text"
                                    value={formData.segmento}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            segmento: e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                />
                            </div>
                            {!editingCorretor && (
                                <div>
                                    <label
                                        htmlFor="corretor-password"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Senha
                                    </label>
                                    <input
                                        id="corretor-password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            })
                                        }
                                        required
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                    />
                                </div>
                            )}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black"
                                >
                                    {isLoading && "Salvando..."}
                                    {!isLoading &&
                                        (editingCorretor
                                            ? "Atualizar"
                                            : "Criar")}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}

            {/* Confirmation Modal */}
            {canManageCorretores && (
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    onClose={handleCloseConfirmModal}
                    onConfirm={confirmDelete}
                    title="Excluir Corretor"
                    message={`Tem certeza que deseja excluir o corretor "${corretorToDelete?.name}"? Esta ação não pode ser desfeita.`}
                    confirmText="Excluir"
                    cancelText="Cancelar"
                    type="danger"
                />
            )}
        </div>
    );
};

export default Vendedores;
