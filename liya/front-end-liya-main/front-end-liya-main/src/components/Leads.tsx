import React, { useState, useEffect, useRef } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Mail,
    MessageCircle,
    Filter,
    Phone,
    List,
    LayoutGrid,
    Download,
    Loader2,
} from "lucide-react";
import Modal from "./Modal";
import ConfirmationModal from "./ConfirmationModal";
import LeadCadenciaInfo from "./LeadCadenciaInfo";
import CadenciaLeadModal from "./CadenciaLeadModal";
import { useLeads } from "../hooks/useLeads";
import { useCadencias } from "../hooks/useCadencias";
import { useCorretores } from "../hooks/useCorretores";
import { useStatus } from "../hooks/useStatus";
// Disparo em Massa foi movido para a página Disparos
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { useTenants } from "../hooks/useTenants";
import { tenantsService } from "../services/tenants";
import { Lead } from "../types";

// Função para formatar data no formato DD/MM/AAAA às HH:mm
const formatDateTime = (date: Date | string): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

// Função para formatar valor como moeda brasileira
const formatCurrency = (value: string | number): string => {
    if (!value && value !== 0) return "";

    // Remove tudo que não é dígito
    const numericValue = value.toString().replace(/\D/g, "");

    if (!numericValue) return "";

    // Converte para número e divide por 100 para considerar os centavos
    const numberValue = Number.parseFloat(numericValue) / 100;

    // Formata como moeda brasileira
    return numberValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// Função para remover formatação e retornar valor numérico
const parseCurrency = (value: string): number => {
    if (!value) return 0;

    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, "");

    // Converte para número (já está em centavos)
    return (Number.parseInt(numericValue, 10) || 0) / 100;
};

// Componente de Card do Lead
const LeadCard: React.FC<{
    lead: Lead;
    onEdit: (lead: Lead) => void;
    onDelete: (id: string) => void;
    onWhatsApp: (telefone: string, nome: string) => void;
    onCadencia: (lead: Lead) => void;
}> = ({ lead, onEdit, onDelete, onWhatsApp, onCadencia }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow cursor-move">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                        {lead.nome}
                    </h3>
                    {lead.email && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{lead.email}</span>
                        </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{lead.telefone}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Origem:</span>
                    <span className="font-medium text-gray-700">
                        {lead.origem}
                    </span>
                </div>
                {lead.publico && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Público:</span>
                        <span className="font-medium text-gray-700">
                            {lead.publico}
                        </span>
                    </div>
                )}
                {lead.corretor && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Corretor:</span>
                        <span className="font-medium text-gray-700 truncate ml-2">
                            {lead.corretor}
                        </span>
                    </div>
                )}
                {lead.interesse && (
                    <div className="text-sm">
                        <span className="text-gray-500">Interesse:</span>
                        <p className="text-gray-700 mt-1 line-clamp-2">
                            {lead.interesse}
                        </p>
                    </div>
                )}
                <LeadCadenciaInfo
                    lead={lead}
                    onClick={() => onCadencia(lead)}
                />
            </div>

            <div className="flex flex-col space-y-2 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => onEdit(lead)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onWhatsApp(lead.telefone, lead.nome)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="WhatsApp"
                        >
                            <MessageCircle className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onDelete(lead.id)}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Excluir"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col space-y-1 text-xs text-gray-500">
                    <div>
                        <span className="font-medium">Criado:</span>{" "}
                        {lead.createdAt
                            ? formatDateTime(lead.createdAt)
                            : "Não informado"}
                    </div>
                    <div>
                        <span className="font-medium">Atualizado:</span>{" "}
                        {lead.updatedAt
                            ? formatDateTime(lead.updatedAt)
                            : "Não informado"}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Leads: React.FC = () => {
    const { user, logout } = useAuth();
    const { error, success } = useToast();
    const kanbanScrollRef = useRef<HTMLDivElement>(null);
    const [isDraggingScroll, setIsDraggingScroll] = useState(false);
    const [scrollStartPos, setScrollStartPos] = useState({ left: 0, x: 0 });
    const autoScrollIntervalRef = useRef<number | null>(null);
    const [primeiraMensagem, setPrimeiraMensagem] = useState<string>("");

    const {
        leads,
        isLoading,
        createLead,
        updateLead,
        deleteLead,
        sendWhatsApp,
        loadLeads,
        getLeadDetails,
        assignCadenciaToLead,
        updateLeadTentativa,
        counters,
        total,
        pages,
        currentPage,
    } = useLeads({
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
    const { cadencias } = useCadencias({
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
    const { corretores } = useCorretores();
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
    const { tenants } = useTenants();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [corretorFilter, setCorretorFilter] = useState("");
    const [origemFilter, setOrigemFilter] = useState("");
    const [tenantFilter, setTenantFilter] = useState<string>("");
    const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
    const [isExporting, setIsExporting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCadenciaModal, setShowCadenciaModal] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [selectedCadenciaLead, setSelectedCadenciaLead] =
        useState<Lead | null>(null);
    const [isCadenciaLoading, setIsCadenciaLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState<null | {
        id: string;
        nome: string;
    }>(null);
    const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
        statusId: "",
        corretorId: "",
        origem: "",
        valorPotencial: "",
        obs: "",
        interesse: "",
        cadenciaAtendimentoId: "",
    });

    const origemOptions = [
        "SITE",
        "FACEBOOK",
        "GOOGLE",
        "LINKEDIN",
        "INDICACAO",
        "OUTRO",
    ];

    // Carregar primeira mensagem ao montar o componente
    useEffect(() => {
        const loadPrimeiraMensagem = async () => {
            if (!user?.tenantId) return;
            try {
                const config = await tenantsService.getConfig(user.tenantId);
                if (config.primeiraMensagem) {
                    setPrimeiraMensagem(config.primeiraMensagem);
                }
            } catch (err) {
                console.error("Erro ao carregar primeira mensagem:", err);
            }
        };
        loadPrimeiraMensagem();
    }, [user?.tenantId]);

    const handleOpenModal = (lead?: Lead) => {
        if (lead) {
            setEditingLead(lead);
            console.log("lead", lead);
            setFormData({
                nome: lead.nome,
                email: lead.email || "",
                telefone: lead.telefone,
                statusId: lead.statusId,
                corretorId: lead.corretorId,
                origem: lead.origem,
                valorPotencial: formatCurrency(lead.valorPotencial),
                obs: lead.obs || "",
                interesse: lead.interesse || "",
                cadenciaAtendimentoId: lead.cadenciaAtendimentoId || "",
            });
        } else {
            setEditingLead(null);
            const defaultStatusId =
                statusOptions.find((s) => s.isDefault)?.id ||
                statusOptions[0]?.id ||
                "";
            setFormData({
                nome: "",
                email: "",
                telefone: "",
                statusId: defaultStatusId,
                corretorId: user?.role === "CORRETOR" ? user.id : "",
                origem: "",
                valorPotencial: "",
                obs: "",
                interesse: "",
                cadenciaAtendimentoId: "",
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingLead(null);
        const defaultStatusId =
            statusOptions.find((s) => s.isDefault)?.id ||
            statusOptions[0]?.id ||
            "";
        setFormData({
            nome: "",
            email: "",
            telefone: "",
            statusId: defaultStatusId,
            corretorId: "",
            origem: "",
            valorPotencial: "",
            obs: "",
            interesse: "",
            cadenciaAtendimentoId: "",
        });
    };

    const handleOpenCadenciaModal = async (lead: Lead) => {
        setShowCadenciaModal(true);
        setSelectedCadenciaLead(lead);
        setIsCadenciaLoading(true);

        try {
            const detailedLead = await getLeadDetails(lead.id);
            setSelectedCadenciaLead(detailedLead || lead);
        } finally {
            setIsCadenciaLoading(false);
        }
    };

    const handleCloseCadenciaModal = () => {
        setShowCadenciaModal(false);
        setSelectedCadenciaLead(null);
        setIsCadenciaLoading(false);
    };

    const handleChangeLeadTentativa = async (tentativaId: string) => {
        if (!selectedCadenciaLead) {
            return;
        }

        const tentativaSelecionada =
            selectedCadenciaLead.cadenciaAtendimento?.tentativas?.find(
                (tentativa) => tentativa.id === tentativaId,
            );

        if (tentativaSelecionada) {
            setSelectedCadenciaLead((currentLead) => {
                if (!currentLead) {
                    return currentLead;
                }

                return {
                    ...currentLead,
                    tentativaAtendimentoId: tentativaId,
                    tentativaAtual: tentativaSelecionada,
                };
            });
        }

        setIsCadenciaLoading(true);
        try {
            const updatedLead = await updateLeadTentativa(
                selectedCadenciaLead.id,
                tentativaId,
            );

            if (updatedLead) {
                const detailedLead = await getLeadDetails(updatedLead.id);

                if (detailedLead?.tentativaAtendimentoId === tentativaId) {
                    setSelectedCadenciaLead(detailedLead);
                } else if (updatedLead.tentativaAtendimentoId === tentativaId) {
                    setSelectedCadenciaLead((currentLead) => ({
                        ...(currentLead || updatedLead),
                        ...updatedLead,
                        tentativaAtendimentoId: tentativaId,
                        tentativaAtual:
                            updatedLead.tentativaAtual ||
                            currentLead?.tentativaAtual,
                    }));
                }
            }
        } finally {
            setIsCadenciaLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("submit", editingLead);
        console.log("formData", formData);
        let result: Lead | null = null;
        if (editingLead) {
            console.log("editingLead", editingLead);
            result = await updateLead(editingLead.id, {
                ...formData,
                valorPotencial: parseCurrency(formData.valorPotencial),
                statusId: formData.statusId,
                origem: formData.origem.toUpperCase(),
                corretor:
                    corretores.find((c) => c.id === formData.corretorId)
                        ?.name || "",
                ultimoContato: new Date(),
                cadenciaAtendimentoId: undefined,
            });
        } else {
            result = await createLead({
                ...formData,
                valorPotencial: parseCurrency(formData.valorPotencial),
                statusId: formData.statusId,
                origem: formData.origem.toUpperCase(),
                corretor:
                    corretores.find((c) => c.id === formData.corretorId)
                        ?.name || "",
                cadenciaAtendimentoId: undefined,
            });
        }

        if (
            result &&
            formData.cadenciaAtendimentoId &&
            result.cadenciaAtendimentoId !== formData.cadenciaAtendimentoId
        ) {
            result =
                (await assignCadenciaToLead(
                    result.id,
                    formData.cadenciaAtendimentoId,
                )) || result;
        }

        if (result) {
            // Recarrega os leads após criar/atualizar com sucesso
            await loadLeads({
                statusId: statusFilter || undefined,
                assignedTo:
                    corretorFilter ||
                    (user?.role === "CORRETOR" ? user?.id : "") ||
                    undefined,
                source: origemFilter || undefined,
                tenantId:
                    user?.role === "ADMIN"
                        ? tenantFilter || undefined
                        : undefined,
                viewType: viewMode,
                page: viewMode === "list" ? currentPage : undefined,
                limit: viewMode === "list" ? 10 : undefined,
            });
        }

        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        const lead = leads.find((l) => l.id === id);
        if (lead) {
            setLeadToDelete({ id: lead.id, nome: lead.nome });
            setShowConfirmModal(true);
        }
    };

    const handleWhatsApp = (telefone: string, nome: string) => {
        sendWhatsApp(telefone, nome, primeiraMensagem);
    };

    const cadenciaOptions = cadencias.filter(
        (cadencia) =>
            cadencia.ativo || cadencia.id === formData.cadenciaAtendimentoId,
    );

    const getLeadWithCadenciaDisplay = (lead: Lead): Lead => {
        if (!lead.cadenciaAtendimentoId) {
            return lead;
        }

        if (lead.cadenciaAtendimento?.tentativas?.length) {
            return lead;
        }

        const cadenciaAtendimento = cadencias.find(
            (cadencia) => cadencia.id === lead.cadenciaAtendimentoId,
        );

        if (!cadenciaAtendimento) {
            return lead;
        }

        return {
            ...lead,
            cadenciaAtendimento,
        };
    };

    // Carrega os leads ao montar e quando o papel/filtros base mudarem
    useEffect(() => {
        const assigned =
            corretorFilter ||
            (user?.role === "CORRETOR" ? user.id : "") ||
            undefined;
        void loadLeads({
            statusId: statusFilter || undefined,
            assignedTo: assigned,
            source: origemFilter || undefined,
            tenantId:
                user?.role === "ADMIN" ? tenantFilter || undefined : undefined,
            viewType: viewMode,
            page: currentPage,
            limit: viewMode === "list" ? 10 : undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.role]);

    // Recarrega quando filtros mudam
    useEffect(() => {
        loadLeads({
            statusId: statusFilter || undefined,
            assignedTo:
                corretorFilter ||
                (user?.role === "CORRETOR" ? user?.id : "") ||
                undefined,
            source: origemFilter || undefined,
            tenantId:
                user?.role === "ADMIN" ? tenantFilter || undefined : undefined,
            viewType: viewMode,
            page: viewMode === "list" ? currentPage : undefined,
            limit: viewMode === "list" ? 10 : undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        statusFilter,
        corretorFilter,
        origemFilter,
        user?.role,
        user?.id,
        tenantFilter,
        viewMode,
        currentPage,
    ]);

    const handlePageChange = (newPage: number) => {
        loadLeads({
            statusId: statusFilter || undefined,
            assignedTo:
                corretorFilter ||
                (user?.role === "CORRETOR" ? user?.id : "") ||
                undefined,
            source: origemFilter || undefined,
            tenantId:
                user?.role === "ADMIN" ? tenantFilter || undefined : undefined,
            viewType: viewMode,
            page: newPage,
            limit: viewMode === "list" ? 10 : undefined,
        });
    };

    // Auto-scroll ao arrastar card próximo às bordas
    const handleDragMove = (e: React.DragEvent) => {
        if (!kanbanScrollRef.current || !draggedLead) return;

        const container = kanbanScrollRef.current;
        const threshold = 100; // Distância da borda para começar o scroll
        const scrollSpeed = 15; // Velocidade do scroll

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX;

        // Limpa qualquer scroll anterior
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }

        // Scroll para a esquerda
        if (mouseX < rect.left + threshold) {
            autoScrollIntervalRef.current = globalThis.setInterval(() => {
                if (container.scrollLeft > 0) {
                    container.scrollLeft -= scrollSpeed;
                }
            }, 20);
        }
        // Scroll para a direita
        else if (mouseX > rect.right - threshold) {
            autoScrollIntervalRef.current = globalThis.setInterval(() => {
                if (
                    container.scrollLeft <
                    container.scrollWidth - container.clientWidth
                ) {
                    container.scrollLeft += scrollSpeed;
                }
            }, 20);
        }
    };

    const stopAutoScroll = () => {
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }
    };

    // Limpa o intervalo quando o componente desmonta
    useEffect(() => {
        return () => {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
        };
    }, []);

    const handleExportToExcel = async () => {
        try {
            setIsExporting(true);
            const { leadsService } = await import("../services/leads");

            const exportParams: Partial<{
                statusId: string;
                source: string;
                assignedTo: string;
                tenantId: string;
            }> = {};

            // Adiciona os filtros ativos
            if (statusFilter) {
                exportParams.statusId = statusFilter;
            }
            if (origemFilter) {
                exportParams.source = origemFilter;
            }
            if (corretorFilter || (user?.role === "CORRETOR" && user?.id)) {
                exportParams.assignedTo =
                    corretorFilter ||
                    (user?.role === "CORRETOR" ? user?.id : "");
            }
            if (user?.role === "ADMIN" && tenantFilter) {
                exportParams.tenantId = tenantFilter;
            }

            await leadsService.exportToExcel(exportParams);
            success("Sucesso", "Relatório exportado com sucesso!");
        } catch (err) {
            console.error("Erro ao exportar leads:", err);
            error("Erro", "Não foi possível exportar o relatório");
        } finally {
            setIsExporting(false);
        }
    };

    const confirmDelete = async () => {
        if (leadToDelete) {
            await deleteLead(leadToDelete.id);
            setLeadToDelete(null);
        }
    };

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setLeadToDelete(null);
    };

    // Botão principal do modal (evita ternário aninhado)
    let submitText = "Criar";
    if (isLoading) submitText = "Salvando...";
    else if (editingLead) submitText = "Atualizar";

    return (
        <div className="space-y-6 overflow-y-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
                <div className="flex space-x-3">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`px-3 py-1.5 rounded-md flex items-center space-x-2 transition-colors ${
                                viewMode === "list"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                            title="Visualização em lista"
                        >
                            <List className="h-4 w-4" />
                            <span className="text-sm font-medium">Lista</span>
                        </button>
                        <button
                            onClick={() => setViewMode("kanban")}
                            className={`px-3 py-1.5 rounded-md flex items-center space-x-2 transition-colors ${
                                viewMode === "kanban"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                            title="Visualização em Kanban"
                        >
                            <LayoutGrid className="h-4 w-4" />
                            <span className="text-sm font-medium">Kanban</span>
                        </button>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Novo Lead</span>
                    </button>
                    {/* Botão de Disparo em Massa removido desta tela */}
                </div>
            </div>

            {/* Filters */}
            <div
                className={`bg-white p-4 rounded-lg shadow-md ${isLoading ? "opacity-50" : ""}`}
            >
                <div
                    className={`grid grid-cols-1 ${user?.role === "ADMIN" ? "md:grid-cols-5" : "md:grid-cols-4"} gap-4`}
                >
                    {user?.role === "ADMIN" && (
                        <div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <select
                                    id="tenant-filter"
                                    value={tenantFilter}
                                    onChange={(e) =>
                                        setTenantFilter(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                >
                                    <option value="">Todos os clientes</option>
                                    {tenants.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        >
                            <option value="">Todos os Status</option>
                            {statusOptions.map((status) => (
                                <option key={status.id} value={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {(user?.role === "ADMIN" ||
                        user?.role === "IMOBILIARIA") && (
                        <div className="relative">
                            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <select
                                value={corretorFilter}
                                onChange={(e) =>
                                    setCorretorFilter(e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            >
                                <option value="">Todos os Vendedores</option>
                                {corretores.map((corretor) => (
                                    <option
                                        key={corretor.id}
                                        value={corretor.id}
                                    >
                                        {corretor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="relative">
                        <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                            value={origemFilter}
                            onChange={(e) => setOrigemFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        >
                            <option value="">Todas as Origens</option>
                            {origemOptions.map((origem) => (
                                <option key={origem} value={origem}>
                                    {origem}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {
                        title: "Total de Leads",
                        value: total,
                        color: "bg-gray-800",
                    },
                    {
                        title: "Novos",
                        value: counters.novo || 0,
                        color: "bg-yellow-500",
                    },
                    {
                        title: "Em Contato",
                        value: counters.contato || 0,
                        color: "bg-orange-500",
                    },
                    {
                        title: "Convertidos",
                        value: counters.convertido || 0,
                        color: "bg-green-500",
                    },
                ].map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                            >
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visualização em Lista */}
            {viewMode === "list" && (
                <div
                    className={`bg-white rounded-lg shadow-md overflow-hidden ${isLoading ? "opacity-50" : ""}`}
                >
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Lista de Leads
                        </h3>
                        <button
                            onClick={handleExportToExcel}
                            disabled={isLoading || isExporting}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Exportar para Excel"
                        >
                            {isExporting ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4 mr-2" />
                            )}
                            {isExporting ? "Exportando..." : "Exportar Excel"}
                        </button>
                    </div>
                    <div className="overflow-x-auto overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
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
                                        Corretor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Origem
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Público
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cadência
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Datas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leads
                                    .filter((lead) => {
                                        const matchesSearch =
                                            searchTerm === "" ||
                                            lead.nome
                                                .toLowerCase()
                                                .includes(
                                                    searchTerm.toLowerCase(),
                                                ) ||
                                            lead.email
                                                ?.toLowerCase()
                                                .includes(
                                                    searchTerm.toLowerCase(),
                                                ) ||
                                            lead.telefone.includes(searchTerm);
                                        return matchesSearch;
                                    })
                                    .map((lead) => {
                                        const leadDisplay =
                                            getLeadWithCadenciaDisplay(lead);

                                        return (
                                            <tr
                                                key={lead.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {leadDisplay.nome}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {leadDisplay.email ||
                                                            "-"}
                                                    </div>
                                                    <div className="text-sm text-gray-900">
                                                        {leadDisplay.telefone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                leadDisplay
                                                                    .leadStatus
                                                                    ?.color +
                                                                "20",
                                                            color: leadDisplay
                                                                .leadStatus
                                                                ?.color,
                                                        }}
                                                    >
                                                        {leadDisplay.leadStatus
                                                            ?.name ||
                                                            "Sem status"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {leadDisplay.corretor ||
                                                        "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {leadDisplay.origem}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {leadDisplay.publico || "-"}
                                                </td>
                                                <td className="px-6 py-4 min-w-80">
                                                    <LeadCadenciaInfo
                                                        lead={leadDisplay}
                                                        onClick={() =>
                                                            handleOpenCadenciaModal(
                                                                leadDisplay,
                                                            )
                                                        }
                                                        compact
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="text-sm text-gray-900">
                                                        Criado:{" "}
                                                        {leadDisplay.createdAt
                                                            ? formatDateTime(
                                                                  leadDisplay.createdAt,
                                                              )
                                                            : "Não informado"}
                                                    </div>
                                                    <div className="text-sm text-gray-900">
                                                        Atualizado:{" "}
                                                        {leadDisplay.updatedAt
                                                            ? formatDateTime(
                                                                  leadDisplay.updatedAt,
                                                              )
                                                            : "Não informado"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleWhatsApp(
                                                                    leadDisplay.telefone,
                                                                    leadDisplay.nome,
                                                                )
                                                            }
                                                            className="text-green-600 hover:text-green-900"
                                                            title="WhatsApp"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </button>
                                                        {leadDisplay.email && (
                                                            <button
                                                                onClick={() =>
                                                                    window.open(
                                                                        `mailto:${leadDisplay.email}`,
                                                                    )
                                                                }
                                                                className="text-purple-600 hover:text-purple-900"
                                                                title="Email"
                                                            >
                                                                <Mail className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() =>
                                                                handleOpenModal(
                                                                    leadDisplay,
                                                                )
                                                            }
                                                            disabled={isLoading}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Editar"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    leadDisplay.id,
                                                                )
                                                            }
                                                            disabled={isLoading}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    {pages > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Página{" "}
                                    <span className="font-medium">
                                        {currentPage}
                                    </span>{" "}
                                    de{" "}
                                    <span className="font-medium">{pages}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={
                                            currentPage === 1 || isLoading
                                        }
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    {Array.from(
                                        { length: Math.min(5, pages) },
                                        (_, i) => {
                                            let pageNum: number;
                                            if (pages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (
                                                currentPage >=
                                                pages - 2
                                            ) {
                                                pageNum = pages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() =>
                                                        handlePageChange(
                                                            pageNum,
                                                        )
                                                    }
                                                    disabled={isLoading}
                                                    className={`px-3 py-1 border rounded-md text-sm font-medium ${
                                                        currentPage === pageNum
                                                            ? "bg-gray-900 text-white border-gray-900"
                                                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        },
                                    )}
                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={
                                            currentPage === pages || isLoading
                                        }
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Próxima
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Kanban Board */}
            {viewMode === "kanban" && (
                <div
                    className={` ${isLoading ? "opacity-50" : ""} max-w-screen-xl over`}
                    style={{ maxHeight: "calc(100vh - 350px)", width: "100%" }}
                >
                    <div
                        ref={kanbanScrollRef}
                        className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                        style={{
                            maxHeight: "calc(100vh - 350px)",
                            width: "100%",
                            cursor: isDraggingScroll ? "grabbing" : "grab",
                        }}
                        onPointerDown={(e) => {
                            if (
                                kanbanScrollRef.current &&
                                e.button === 0 &&
                                !draggedLead
                            ) {
                                setIsDraggingScroll(true);
                                setScrollStartPos({
                                    left: kanbanScrollRef.current.scrollLeft,
                                    x: e.clientX,
                                });
                                kanbanScrollRef.current.style.userSelect =
                                    "none";
                            }
                        }}
                        onPointerLeave={() => {
                            setIsDraggingScroll(false);
                        }}
                        onPointerUp={() => {
                            setIsDraggingScroll(false);
                            if (kanbanScrollRef.current) {
                                kanbanScrollRef.current.style.userSelect = "";
                            }
                        }}
                        onPointerMove={(e) => {
                            if (!isDraggingScroll || !kanbanScrollRef.current)
                                return;
                            e.preventDefault();
                            const dx = e.clientX - scrollStartPos.x;
                            kanbanScrollRef.current.scrollLeft =
                                scrollStartPos.left - dx;
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            handleDragMove(e);
                        }}
                        onDrop={() => {
                            stopAutoScroll();
                        }}
                        onDragLeave={() => {
                            stopAutoScroll();
                        }}
                    >
                        <div
                            className="flex gap-4 pb-4 w-max"
                            style={{
                                maxHeight: "calc(100vh - 350px)",
                                width: "100%",
                            }}
                        >
                            {[...statusOptions]
                                .filter((status) => {
                                    // Se for ADMIN e houver filtro de tenant, mostrar apenas status daquele tenant
                                    if (
                                        user?.role === "ADMIN" &&
                                        tenantFilter
                                    ) {
                                        return status.tenantId === tenantFilter;
                                    }
                                    // Se for ADMIN sem filtro, mostrar todos
                                    if (
                                        user?.role === "ADMIN" &&
                                        !tenantFilter
                                    ) {
                                        return true;
                                    }
                                    // Para outros roles, mostrar apenas status do próprio tenant
                                    return status.tenantId === user?.tenantId;
                                })
                                .sort((a, b) => a.ordem - b.ordem)
                                .map((status) => {
                                    const statusLeads = leads.filter((lead) => {
                                        const matchesStatus =
                                            lead.statusId === status.id;
                                        const matchesSearch =
                                            searchTerm === "" ||
                                            lead.nome
                                                .toLowerCase()
                                                .includes(
                                                    searchTerm.toLowerCase(),
                                                ) ||
                                            lead.email
                                                ?.toLowerCase()
                                                .includes(
                                                    searchTerm.toLowerCase(),
                                                ) ||
                                            lead.telefone.includes(searchTerm);
                                        return matchesStatus && matchesSearch;
                                    });

                                    return (
                                        <section
                                            key={status.id}
                                            className="flex-shrink-0 w-80 h-full"
                                            aria-label={`Coluna ${status.name}`}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                e.dataTransfer.dropEffect =
                                                    "move";
                                            }}
                                            onDrop={async (e) => {
                                                e.preventDefault();
                                                stopAutoScroll();
                                                if (
                                                    draggedLead &&
                                                    draggedLead.statusId !==
                                                        status.id
                                                ) {
                                                    const result =
                                                        await updateLead(
                                                            draggedLead.id,
                                                            {
                                                                statusId:
                                                                    status.id,
                                                                ultimoContato:
                                                                    new Date(),
                                                            },
                                                        );
                                                    if (result) {
                                                        // Recarrega os leads após atualização bem-sucedida
                                                        await loadLeads({
                                                            statusId:
                                                                statusFilter ||
                                                                undefined,
                                                            assignedTo:
                                                                corretorFilter ||
                                                                (user?.role ===
                                                                "CORRETOR"
                                                                    ? user?.id
                                                                    : "") ||
                                                                undefined,
                                                            source:
                                                                origemFilter ||
                                                                undefined,
                                                            tenantId:
                                                                user?.role ===
                                                                "ADMIN"
                                                                    ? tenantFilter ||
                                                                      undefined
                                                                    : undefined,
                                                            viewType: viewMode,

                                                            page: currentPage,
                                                            limit: undefined,
                                                        });
                                                    }
                                                }
                                                setDraggedLead(null);
                                            }}
                                        >
                                            <div
                                                className="bg-gray-50 rounded-lg flex flex-col"
                                                style={{
                                                    height: "calc(100vh - 370px)",
                                                }}
                                            >
                                                <div
                                                    className="px-4 py-3 border-b border-gray-200 flex items-center justify-between rounded-t-lg flex-shrink-0"
                                                    style={{
                                                        borderTopColor:
                                                            status.color,
                                                        borderTopWidth: "3px",
                                                    }}
                                                >
                                                    <h3 className="font-semibold text-gray-900">
                                                        {status.name}
                                                    </h3>
                                                    <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                                                        {statusLeads.length}
                                                    </span>
                                                </div>
                                                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                                                    {statusLeads.length ===
                                                    0 ? (
                                                        <div className="text-center py-8 text-gray-400 text-sm">
                                                            Nenhum lead neste
                                                            status
                                                        </div>
                                                    ) : (
                                                        statusLeads.map(
                                                            (lead) => {
                                                                const leadDisplay =
                                                                    getLeadWithCadenciaDisplay(
                                                                        lead,
                                                                    );

                                                                return (
                                                                    <div
                                                                        key={
                                                                            leadDisplay.id
                                                                        }
                                                                        draggable
                                                                        onDragStart={(
                                                                            e,
                                                                        ) => {
                                                                            setDraggedLead(
                                                                                leadDisplay,
                                                                            );
                                                                            e.dataTransfer.effectAllowed =
                                                                                "move";
                                                                            setIsDraggingScroll(
                                                                                false,
                                                                            ); // Desabilita scroll manual ao arrastar card
                                                                        }}
                                                                        onDragEnd={() => {
                                                                            setDraggedLead(
                                                                                null,
                                                                            );
                                                                            stopAutoScroll();
                                                                        }}
                                                                        className={
                                                                            draggedLead?.id ===
                                                                            leadDisplay.id
                                                                                ? "opacity-50"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        <LeadCard
                                                                            lead={
                                                                                leadDisplay
                                                                            }
                                                                            onEdit={
                                                                                handleOpenModal
                                                                            }
                                                                            onDelete={
                                                                                handleDelete
                                                                            }
                                                                            onWhatsApp={
                                                                                handleWhatsApp
                                                                            }
                                                                            onCadencia={
                                                                                handleOpenCadenciaModal
                                                                            }
                                                                        />
                                                                    </div>
                                                                );
                                                            },
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </section>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                        {editingLead ? "Editar Lead" : "Novo Lead"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="lead-nome"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nome
                                </label>
                                <input
                                    id="lead-nome"
                                    type="text"
                                    value={formData.nome}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nome: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="lead-email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    id="lead-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="lead-telefone"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Telefone *
                                </label>
                                <input
                                    id="lead-telefone"
                                    type="tel"
                                    value={formData.telefone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            telefone: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="lead-status"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Status
                                </label>
                                <select
                                    id="lead-status"
                                    value={formData.statusId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            statusId: e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                >
                                    <option value="">
                                        Selecione um status
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
                            </div>
                            <div>
                                <label
                                    htmlFor="lead-corretor"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Vendedor
                                </label>
                                <select
                                    id="lead-corretor"
                                    value={formData.corretorId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            corretorId: e.target.value,
                                        })
                                    }
                                    disabled={
                                        isLoading || user?.role === "CORRETOR"
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                >
                                    <option value="">
                                        Selecione um corretor
                                    </option>
                                    {corretores
                                        .filter((c) => c.isActive)
                                        .map((corretor) => (
                                            <option
                                                key={corretor.id}
                                                value={corretor.id}
                                            >
                                                {corretor.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="lead-origem"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Origem
                                </label>
                                <select
                                    id="lead-origem"
                                    value={formData.origem}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            origem: e.target.value,
                                        })
                                    }
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                >
                                    <option value="">Selecione a origem</option>
                                    {origemOptions.map((origem) => (
                                        <option key={origem} value={origem}>
                                            {origem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="lead-cadencia"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Cadência de Atendimento
                                </label>
                                <select
                                    id="lead-cadencia"
                                    value={formData.cadenciaAtendimentoId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cadenciaAtendimentoId:
                                                e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                >
                                    <option value="">Sem cadência</option>
                                    {cadenciaOptions.map((cadencia) => (
                                        <option
                                            key={cadencia.id}
                                            value={cadencia.id}
                                        >
                                            {cadencia.nome}
                                            {cadencia.ativo ? "" : " (inativa)"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="lead-valor"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Valor Potencial
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">
                                        R$
                                    </span>
                                    <input
                                        id="lead-valor"
                                        type="text"
                                        value={formData.valorPotencial}
                                        onChange={(e) => {
                                            const formatted = formatCurrency(
                                                e.target.value,
                                            );
                                            setFormData({
                                                ...formData,
                                                valorPotencial: formatted,
                                            });
                                        }}
                                        placeholder="0,00"
                                        required
                                        disabled={isLoading}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="lead-interesse"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Interesse
                                </label>
                                <textarea
                                    id="lead-interesse"
                                    value={formData.interesse}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            interesse: e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                    placeholder="Por que o lead entrou em contato com a imobiliária?"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="lead-observacoes"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Observações
                                </label>
                                <textarea
                                    id="lead-observacoes"
                                    value={formData.obs}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            obs: e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                    placeholder="Observações sobre o lead..."
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black"
                            >
                                {submitText}
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

            {/* Disparo em Massa Modal removido desta tela */}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={handleCloseConfirmModal}
                onConfirm={confirmDelete}
                title="Excluir Lead"
                message={`Tem certeza que deseja excluir o lead "${leadToDelete?.nome}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                type="danger"
            />

            <CadenciaLeadModal
                isOpen={showCadenciaModal}
                lead={selectedCadenciaLead}
                isLoading={isCadenciaLoading}
                onClose={handleCloseCadenciaModal}
                onChangeTentativa={handleChangeLeadTentativa}
            />
        </div>
    );
};

export default Leads;
