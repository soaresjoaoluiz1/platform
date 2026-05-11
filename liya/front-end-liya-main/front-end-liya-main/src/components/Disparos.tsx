import React, { useEffect, useMemo, useState } from "react";
import {
    Check,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    Copy,
    Edit,
    Trash2,
    Plus,
    Filter,
} from "lucide-react";
import Modal from "./Modal";
import DisparoMassaModal from "./DisparoMassaModal";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { useTenants } from "../hooks/useTenants";
import { disparosService } from "../services/disparos";
import { getErrorMessage } from "../services/api";
import { useStatus } from "../hooks/useStatus";

type DisparoRow = {
    id: string;
    mensagem: string;
    imagem?: string;
    video?: string;
    instancia: string;
    status: string;
    dataAgendada?: Date;
    tipo: "agendado" | "follow_up";
    followUpDays?: number;
    followUpStatusId?: string;
};

const Disparos: React.FC = () => {
    const { user, hasPermission, logout } = useAuth();
    const { error, success } = useToast();
    const { tenants } = useTenants();
    const [tenantFilter, setTenantFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [leadStatusFilter, setLeadStatusFilter] = useState<string>("");
    const [items, setItems] = useState<DisparoRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / pageSize)),
        [total, pageSize],
    );
    const { status: statusOptions } = useStatus({
        onError: (message, isTokenExpired) => {
            if (isTokenExpired) {
                error("Token Expirado", message);
            } else {
                error("Erro", message);
            }
        },
        onTokenExpired: () => {
            setTimeout(() => logout(), 2000);
        },
    });
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<DisparoRow | null>(null);
    const [formData, setFormData] = useState({
        message: "",
        image: null as File | null,
        video: null as File | null,
        instance: "WhatsApp Business",
        status: "agendado",
        filtroStatusIds: [] as string[],
        date: "",
        time: "",
        allLeads: false,
        tipo: "agendado" as "agendado" | "follow_up",
        followUpDays: 7,
        followUpStatusId: "",
    });
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
    const [copiedDisparoId, setCopiedDisparoId] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState<string | null>(null);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "image" | "video",
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, [type]: file }));
            const url = URL.createObjectURL(file);
            if (type === "image") {
                setImagePreviewUrl(url);
            } else {
                setVideoPreviewUrl(url);
            }
        }
    };

    const handleStatusChange = (statusId: string) => {
        setFormData((prev) => ({
            ...prev,
            filtroStatusIds: prev.filtroStatusIds.includes(statusId)
                ? prev.filtroStatusIds.filter((s) => s !== statusId)
                : [...prev.filtroStatusIds, statusId],
        }));
    };

    const load = async () => {
        setIsLoading(true);
        try {
            const data = await disparosService.list({
                page,
                limit: pageSize,
                tenantId:
                    user?.role === "ADMIN"
                        ? tenantFilter || undefined
                        : undefined,
                statusId: leadStatusFilter || undefined,
            });
            // Nota: backend da listagem no serviço atual retorna array simples; aqui fazemos paginação client-side quando total não é fornecido
            setTotal(data.length);
            setItems(
                data.map((d) => ({
                    id: d.id,
                    mensagem: d.texto,
                    imagem: d.imagem,
                    video: d.video,
                    instancia: d.instancia,
                    status: d.status,
                    dataAgendada: d.dataAgendamento,
                    tipo: d.tipo,
                    followUpDays: d.followUpDays,
                    followUpStatusId: d.followUpStatusId,
                })),
            );
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                error(
                    "Token Expirado",
                    "Sua sessão expirou. Redirecionando para o login...",
                );
                setTimeout(() => logout(), 2000);
            } else {
                error("Erro ao Carregar", apiError.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, tenantFilter, leadStatusFilter]);

    useEffect(() => {
        // Escutar evento de criação de disparo para atualizar a lista
        const handleDisparoCreated = async () => {
            // Resetar filtros ao criar novo disparo
            setStatusFilter("");
            setLeadStatusFilter("");
            setPage(1);
            // Aguardar um pequeno delay para garantir que os filtros sejam resetados
            setTimeout(async () => {
                await load();
            }, 100);
        };
        window.addEventListener("disparo-created", handleDisparoCreated);
        return () => {
            window.removeEventListener("disparo-created", handleDisparoCreated);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openCreate = () => {
        setEditing(null);
        setFormData({
            message: "",
            image: null,
            video: null,
            instance: "WhatsApp Business",
            status: "agendado",
            date: "",
            time: "",
            filtroStatusIds: [],
            allLeads: false,
            tipo: "agendado",
            followUpDays: 7,
            followUpStatusId: "",
        });
        setImagePreviewUrl("");
        setVideoPreviewUrl("");
        setShowModal(true);
    };
    const openEdit = async (id: string) => {
        setIsLoading(true);
        try {
            const d = await disparosService.get(id);
            setEditing({
                id: d.id,
                mensagem: d.texto,
                imagem: d.imagem,
                video: d.video,
                instancia: d.instancia,
                status: d.status,
                dataAgendada: d.dataAgendamento,
                tipo: d.tipo,
                followUpDays: d.followUpDays,
                followUpStatusId: d.followUpStatusId,
            });
            setFormData({
                message: d.texto,
                image: null, // Arquivo não pode ser pré-carregado
                video: null, // Arquivo não pode ser pré-carregado
                instance: d.instancia,
                status: d.status || "agendado",
                filtroStatusIds:
                    d.tipo === "agendado" ? d.filtroStatus || [] : [],
                date: d.dataAgendamento
                    ? d.dataAgendamento.toISOString().slice(0, 10)
                    : "",
                time: d.dataAgendamento
                    ? d.dataAgendamento.toTimeString().slice(0, 5)
                    : "",
                allLeads: d.allLeads || false,
                tipo: d.tipo,
                followUpDays: d.followUpDays || 7,
                followUpStatusId: d.followUpStatusId || "",
            });
            // Mostrar previews das URLs existentes
            setImagePreviewUrl(d.imagem || "");
            setVideoPreviewUrl(d.video || "");
            setShowModal(true);
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                error(
                    "Token Expirado",
                    "Sua sessão expirou. Redirecionando para o login...",
                );
                setTimeout(() => logout(), 2000);
            } else {
                error("Erro ao Carregar Disparo", apiError.message);
            }
        } finally {
            setIsLoading(false);
        }
    };
    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
        setImagePreviewUrl("");
        setVideoPreviewUrl("");
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const scheduledAt =
                formData.tipo === "agendado" && formData.date && formData.time
                    ? new Date(
                          `${formData.date}T${formData.time}`,
                      ).toISOString()
                    : undefined;

            const payload = {
                message: formData.message,
                image: formData.image || undefined,
                video: formData.video || undefined,
                instance: formData.instance,
                scheduledAt,
                filter:
                    formData.tipo === "agendado"
                        ? {
                              statusId: formData.filtroStatusIds,
                          }
                        : undefined,
                allLeads: formData.allLeads,
                tipo: formData.tipo,
                followUpDays:
                    formData.tipo === "follow_up"
                        ? formData.followUpDays
                        : undefined,
                followUpStatusId:
                    formData.tipo === "follow_up"
                        ? formData.followUpStatusId
                        : undefined,
            };
            if (editing) {
                await disparosService.update(editing.id, payload);
                success(
                    "Disparo Atualizado",
                    "O disparo foi atualizado com sucesso.",
                );
            } else {
                await disparosService.create({
                    ...payload,
                    tenantId:
                        user?.role === "ADMIN"
                            ? tenantFilter || undefined
                            : undefined,
                });
                success("Disparo Criado", "O disparo foi criado com sucesso.");
            }
            await load();
            closeModal();
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                error(
                    "Token Expirado",
                    "Sua sessão expirou. Redirecionando para o login...",
                );
                setTimeout(() => logout(), 2000);
            } else {
                const action = editing ? "atualizar" : "criar";
                error(`Erro ao ${action} disparo`, apiError.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (id: string) => {
        setToDelete(id);
        setConfirmOpen(true);
    };
    const doDelete = async () => {
        if (!toDelete) return;
        setIsLoading(true);
        try {
            await disparosService.remove(toDelete);
            success("Disparo Excluído", "O disparo foi excluído com sucesso.");
            await load();
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                error(
                    "Token Expirado",
                    "Sua sessão expirou. Redirecionando para o login...",
                );
                setTimeout(() => logout(), 2000);
            } else {
                error("Erro ao Excluir", apiError.message);
            }
        } finally {
            setIsLoading(false);
            setConfirmOpen(false);
            setToDelete(null);
        }
    };

    const visibleItems = useMemo(() => {
        let list = items;
        if (statusFilter) list = list.filter((i) => i.status === statusFilter);
        // paginação client-side caso o backend não retorne total
        const start = (page - 1) * pageSize;
        return list.slice(start, start + pageSize);
    }, [items, statusFilter, page, pageSize]);

    const canManage = hasPermission(["ADMIN", "IMOBILIARIA"]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Disparos</h1>
                {canManage && (
                    <button
                        onClick={openCreate}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Novo Disparo</span>
                    </button>
                )}
            </div>

            <div
                className={`bg-white p-4 rounded-lg shadow-md ${
                    isLoading ? "opacity-50" : ""
                }`}
            >
                <div
                    className={`grid grid-cols-1 ${
                        user?.role === "ADMIN"
                            ? "md:grid-cols-4"
                            : "md:grid-cols-3"
                    } gap-4`}
                >
                    {user?.role === "ADMIN" && (
                        <div>
                            <label
                                htmlFor="tenant-filter"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Cliente
                            </label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <select
                                    id="tenant-filter"
                                    value={tenantFilter}
                                    onChange={(e) => {
                                        setTenantFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                >
                                    <option value="">Todos</option>
                                    {tenants.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="status-filter"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Status do Disparo
                        </label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            >
                                <option value="">Todos</option>
                                {["agendado", "enviado", "cancelado"].map(
                                    (s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="lead-status-filter"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Status do Lead
                        </label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <select
                                id="lead-status-filter"
                                value={leadStatusFilter}
                                onChange={(e) => {
                                    setLeadStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            >
                                <option value="">Todos</option>
                                {statusOptions
                                    .filter((s) => s.isActive)
                                    .map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                    isLoading ? "opacity-50" : ""
                }`}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mensagem
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Anexos
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Agendamento/Config
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Instância
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {visibleItems.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-1">
                                            <span
                                                className="font-mono text-xs text-gray-500"
                                                title={d.id}
                                            >
                                                {d.id.slice(0, 10)}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        d.id,
                                                    );
                                                    setCopiedDisparoId(d.id);
                                                    setTimeout(
                                                        () =>
                                                            setCopiedDisparoId(
                                                                null,
                                                            ),
                                                        1500,
                                                    );
                                                }}
                                                className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
                                                title="Copiar ID completo"
                                            >
                                                {copiedDisparoId === d.id ? (
                                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                                ) : (
                                                    <Copy className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                d.tipo === "agendado"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {d.tipo === "agendado"
                                                ? "📅 Agendado"
                                                : "🔄 Follow-up"}
                                        </span>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[300px] truncate"
                                        title={d.mensagem}
                                    >
                                        {d.mensagem}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex space-x-2">
                                            {d.imagem && (
                                                <div className="flex items-center">
                                                    <img
                                                        src={d.imagem}
                                                        alt="Preview"
                                                        className="w-8 h-8 rounded object-cover"
                                                        title="Imagem anexada"
                                                    />
                                                </div>
                                            )}
                                            {d.video && (
                                                <div className="flex items-center">
                                                    <video
                                                        className="w-8 h-8 rounded object-cover"
                                                        title="Vídeo anexado"
                                                        muted
                                                    >
                                                        <source src={d.video} />
                                                        <track
                                                            kind="captions"
                                                            srcLang="pt"
                                                            label="Português"
                                                        />
                                                    </video>
                                                </div>
                                            )}
                                            {!d.imagem && !d.video && (
                                                <span className="text-gray-400 text-xs">
                                                    Sem anexos
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {(() => {
                                            if (d.tipo === "agendado") {
                                                if (d.dataAgendada) {
                                                    return (
                                                        <div>
                                                            <div className="font-medium">
                                                                {d.dataAgendada.toLocaleDateString()}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {d.dataAgendada.toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <span className="text-gray-400">
                                                        -
                                                    </span>
                                                );
                                            }
                                            return (
                                                <div>
                                                    <div className="text-xs font-medium text-gray-700">
                                                        {d.followUpDays} dias
                                                        sem contato
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {statusOptions.find(
                                                            (s) =>
                                                                s.id ===
                                                                d.followUpStatusId,
                                                        )?.name ||
                                                            "Status não encontrado"}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {d.instancia}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                        {d.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openEdit(d.id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    confirmDelete(d.id)
                                                }
                                                className="text-red-600 hover:text-red-900"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    {total === 0 ? (
                        <span>Nenhum disparo encontrado</span>
                    ) : (
                        <span>
                            Mostrando{" "}
                            <span className="font-medium">
                                {(page - 1) * pageSize + 1}
                            </span>
                            <span className="mx-1">–</span>
                            <span className="font-medium">
                                {Math.min(page * pageSize, total)}
                            </span>
                            <span className="mx-1">de</span>
                            <span className="font-medium">{total}</span>
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                        <button
                            className="p-2 rounded border text-gray-600 disabled:opacity-40"
                            onClick={() => setPage(1)}
                            disabled={page <= 1}
                            aria-label="Primeira página"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </button>
                        <button
                            className="p-2 rounded border text-gray-600 disabled:opacity-40"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            aria-label="Página anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-gray-700">
                            Página <span className="font-medium">{page}</span>{" "}
                            de <span className="font-medium">{totalPages}</span>
                        </span>
                        <button
                            className="p-2 rounded border text-gray-600 disabled:opacity-40"
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={page >= totalPages}
                            aria-label="Próxima página"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                            className="p-2 rounded border text-gray-600 disabled:opacity-40"
                            onClick={() => setPage(totalPages)}
                            disabled={page >= totalPages}
                            aria-label="Última página"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label
                            htmlFor="disparos-page-size"
                            className="text-sm text-gray-700"
                        >
                            por página
                        </label>
                        <select
                            id="disparos-page-size"
                            className="border rounded px-2 py-1 text-sm"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            {[10, 20, 50].map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {canManage &&
                (editing ? (
                    <Modal isOpen={showModal} onClose={closeModal}>
                        <div className="px-6 pb-4">
                            <h2 className="text-xl font-bold mb-4">
                                Editar Disparo
                            </h2>
                            <form onSubmit={submit} className="space-y-4">
                                {/* Seleção do tipo de disparo */}
                                <div>
                                    <p className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Disparo
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    tipo: "agendado",
                                                }))
                                            }
                                            disabled={isLoading}
                                            className={`p-4 rounded-lg border-2 transition-all ${
                                                formData.tipo === "agendado"
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-300 bg-white hover:border-gray-400"
                                            }`}
                                        >
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-900">
                                                    📅 Agendado
                                                </div>
                                                <div className="text-xs text-gray-600 mt-1">
                                                    Disparo em data e hora
                                                    específicas
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    tipo: "follow_up",
                                                }))
                                            }
                                            disabled={isLoading}
                                            className={`p-4 rounded-lg border-2 transition-all ${
                                                formData.tipo === "follow_up"
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-300 bg-white hover:border-gray-400"
                                            }`}
                                        >
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-900">
                                                    🔄 Follow-up
                                                </div>
                                                <div className="text-xs text-gray-600 mt-1">
                                                    Baseado no tempo sem contato
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="disp-message"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Mensagem
                                    </label>
                                    <textarea
                                        id="disp-message"
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                message: e.target.value,
                                            })
                                        }
                                        required
                                        disabled={isLoading}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="disp-image"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Imagem (arquivo)
                                        </label>
                                        <input
                                            id="disp-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleFileChange(e, "image")
                                            }
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                        {imagePreviewUrl && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreviewUrl}
                                                    alt="Preview"
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="disp-video"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Vídeo (arquivo)
                                        </label>
                                        <input
                                            id="disp-video"
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) =>
                                                handleFileChange(e, "video")
                                            }
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                        {videoPreviewUrl && (
                                            <div className="mt-2">
                                                <video
                                                    controls
                                                    className="w-full h-32 object-cover rounded-lg"
                                                >
                                                    <source
                                                        src={videoPreviewUrl}
                                                    />
                                                    <track
                                                        kind="captions"
                                                        srcLang="pt"
                                                        label="Português"
                                                    />
                                                    Seu navegador não suporta o
                                                    elemento de vídeo.
                                                </video>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Campos condicionais baseados no tipo */}
                                <div>
                                    <p className="block text-sm font-medium text-gray-700 mb-2">
                                        {formData.tipo === "agendado"
                                            ? "Filtrar por Status"
                                            : "Status para Follow-up"}
                                    </p>
                                    {formData.tipo === "agendado" ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {statusOptions
                                                .filter((s) => s.isActive)
                                                .map((status) => (
                                                    <label
                                                        key={status.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.filtroStatusIds.includes(
                                                                status.id,
                                                            )}
                                                            onChange={() =>
                                                                handleStatusChange(
                                                                    status.id,
                                                                )
                                                            }
                                                            disabled={isLoading}
                                                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-800"
                                                        />
                                                        <span className="text-sm capitalize">
                                                            {status.name}
                                                        </span>
                                                    </label>
                                                ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <select
                                                id="follow-up-status-edit"
                                                value={
                                                    formData.followUpStatusId
                                                }
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        followUpStatusId:
                                                            e.target.value,
                                                    }))
                                                }
                                                required={
                                                    formData.tipo ===
                                                    "follow_up"
                                                }
                                                disabled={isLoading}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 bg-white"
                                            >
                                                <option value="">
                                                    Selecione o status...
                                                </option>
                                                {statusOptions
                                                    .filter((s) => s.isActive)
                                                    .map((status) => (
                                                        <option
                                                            key={status.id}
                                                            value={status.id}
                                                        >
                                                            {status.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Leads com este status que não
                                                tiveram contato há X dias
                                                receberão a mensagem
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Campo de dias para follow-up */}
                                {formData.tipo === "follow_up" && (
                                    <div>
                                        <label
                                            htmlFor="follow-up-days-edit"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Dias sem contato
                                        </label>
                                        <input
                                            id="follow-up-days-edit"
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={formData.followUpDays}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    followUpDays:
                                                        Number.parseInt(
                                                            e.target.value,
                                                        ) || 7,
                                                }))
                                            }
                                            required={
                                                formData.tipo === "follow_up"
                                            }
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Leads que não tiveram contato há{" "}
                                            {formData.followUpDays} dias ou mais
                                            receberão a mensagem
                                        </p>
                                    </div>
                                )}

                                {user?.role === "IMOBILIARIA" && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <label
                                            htmlFor="edit-disp-all-leads"
                                            className="flex items-center space-x-3 cursor-pointer"
                                        >
                                            <input
                                                id="edit-disp-all-leads"
                                                type="checkbox"
                                                checked={formData.allLeads}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        allLeads:
                                                            e.target.checked,
                                                        filtroStatusIds: e
                                                            .target.checked
                                                            ? []
                                                            : prev.filtroStatusIds,
                                                    }))
                                                }
                                                disabled={isLoading}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                                            />
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    Enviar para todos os leads
                                                    da imobiliária
                                                </span>
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                    {formData.tipo ===
                                                    "agendado"
                                                        ? "Ao ativar esta opção, o disparo será enviado para todos os leads cadastrados, que corresponderem aos status selecionados"
                                                        : "Ao ativar esta opção, o disparo será enviado para todos os leads do status selecionado que não tiveram contato no período especificado"}
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                )}

                                <div className="flex w-full justify-between gap-3">
                                    <div className="w-full">
                                        <label
                                            htmlFor="disp-instance"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Instância
                                        </label>
                                        <select
                                            id="disp-instance"
                                            value={formData.instance}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    instance: e.target.value,
                                                })
                                            }
                                            required
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                        >
                                            {[
                                                "WhatsApp Business",
                                                "WhatsApp Cloud",
                                            ].map((i) => (
                                                <option key={i} value={i}>
                                                    {i}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label
                                            htmlFor="disp-status"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Status do Disparo
                                        </label>
                                        <select
                                            id="disp-status"
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    status: e.target.value,
                                                })
                                            }
                                            required
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                        >
                                            <option value="agendado">
                                                Agendado
                                            </option>
                                            <option value="inativo">
                                                Inativo
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {formData.tipo === "agendado" && (
                                    <div className="flex w-full justify-between gap-3">
                                        <div className="w-full">
                                            <label
                                                htmlFor="disp-date"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Data
                                            </label>
                                            <input
                                                id="disp-date"
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        date: e.target.value,
                                                    })
                                                }
                                                required={
                                                    formData.tipo === "agendado"
                                                }
                                                disabled={isLoading}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label
                                                htmlFor="disp-time"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Hora
                                            </label>
                                            <input
                                                id="disp-time"
                                                type="time"
                                                value={formData.time}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        time: e.target.value,
                                                    })
                                                }
                                                required={
                                                    formData.tipo === "agendado"
                                                }
                                                disabled={isLoading}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black disabled:opacity-50"
                                    >
                                        {isLoading
                                            ? "Atualizando..."
                                            : "Atualizar"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isLoading}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                ) : (
                    <DisparoMassaModal
                        isOpen={showModal}
                        onClose={closeModal}
                        tenantId={
                            user?.role === "ADMIN"
                                ? tenantFilter || undefined
                                : undefined
                        }
                    />
                ))}

            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={doDelete}
                title="Excluir Disparo"
                message="Tem certeza que deseja excluir este disparo?"
                confirmText="Excluir"
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
};

export default Disparos;
