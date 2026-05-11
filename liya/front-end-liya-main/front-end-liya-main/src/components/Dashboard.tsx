import React, { useEffect, useMemo, useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    Users,
    UserCheck,
    Phone,
    Mail,
    Filter,
    RefreshCw,
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { useLeads } from "../hooks/useLeads";
import { useAuth } from "../contexts/AuthContext";
import { useTenants } from "../hooks/useTenants";
import type { FilterPeriod } from "../types";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [selectedTenantId, setSelectedTenantId] = useState<string>("");
    const [statusPieData, setStatusPieData] = useState<
        {
            name: string;
            raw: string;
            value: number;
            color: string;
            ordem: number;
        }[]
    >([]);

    // Só carrega tenants se o usuário for admin
    const shouldLoadTenants = user?.role === "ADMIN";
    const { tenants, isLoading: isLoadingTenants } =
        useTenants(shouldLoadTenants);

    const {
        stats,
        isLoading,
        selectedPeriod,
        filterPeriods,
        changePeriod,
        applyCustomDateRange,
        refreshStats,
    } = useDashboard(
        shouldLoadTenants && selectedTenantId ? selectedTenantId : undefined
    );

    const { sendWhatsApp } = useLeads();
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [tempDateRange, setTempDateRange] = useState({ from: "", to: "" });
    // dados derivados para gráficos (antes de qualquer early return)
    const leadsPorDiaChart = useMemo(
        () =>
            (stats?.leadsPorDia || []).map((d) => ({
                date: d.data.split("-").reverse().join("/"),
                count: d.quantidade,
            })),
        [stats]
    );

    useEffect(() => {
        const mapLabel = (s: string) => {
            const k = s.toUpperCase();
            switch (k) {
                case "NOVO":
                    return "Novos";
                case "CONTATO":
                    return "Em Contato";
                case "QUALIFICADO":
                    return "Qualificados";
                case "PROPOSTA":
                    return "Propostas";
                case "CONVERTIDO":
                    return "Convertidos";
                case "PERDIDO":
                    return "Perdidos";
                default:
                    return s;
            }
        };
        const colorFor = (k: string) => {
            switch (k) {
                case "NOVO":
                    return "#3B82F6"; // azul
                case "CONTATO":
                    return "#F59E0B"; // amarelo
                case "QUALIFICADO":
                    return "#06B6D4"; // ciano
                case "PROPOSTA":
                    return "#8B5CF6"; // roxo
                case "CONVERTIDO":
                    return "#10B981"; // verde
                case "PERDIDO":
                    return "#EF4444"; // vermelho
                default:
                    return "#9CA3AF"; // cinza
            }
        };
        const list = stats?.leadsPorStatus ?? [];

        if (!list.length) {
            // fallback: converter convertidos x outros
            const total = stats?.totalLeads ?? 0;
            const conv = stats?.leadsConvertidos ?? 0;
            const outros = Math.max(total - conv, 0);
            setStatusPieData([
                {
                    name: "Convertidos",
                    raw: "CONVERTIDO",
                    value: conv,
                    color: colorFor("CONVERTIDO"),
                    ordem: 1,
                },
                {
                    name: "Outros",
                    raw: "OUTROS",
                    value: outros,
                    color: "#3B82F6",
                    ordem: 2,
                },
            ]);
        }
        setStatusPieData(
            list.map((item) => ({
                name: mapLabel(item.status),
                raw: item.status.toUpperCase(),
                value: item.count,
                color: item.color || colorFor(item.status.toUpperCase()),
                ordem: item.ordem ?? 999,
            }))
        );
    }, [stats]);

    const totalLeads = useMemo(() => stats?.totalLeads ?? 0, [stats]);
    // cores são lidas diretamente de cada item do statusPieData
    const statusTotal = useMemo(
        () => statusPieData.reduce((sum, i) => sum + i.value, 0),
        [statusPieData]
    );

    const handlePeriodChange = (period: FilterPeriod) => {
        if (period.value === "custom") {
            setShowCustomDatePicker(true);
        } else {
            changePeriod(period);
            setShowCustomDatePicker(false);
        }
    };

    const handleCustomDateSubmit = () => {
        if (tempDateRange.from && tempDateRange.to) {
            applyCustomDateRange(tempDateRange.from, tempDateRange.to);
            setShowCustomDatePicker(false);
        }
    };

    if (!stats) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    const statsCards = [
        {
            title: "Total de Leads",
            value: stats.totalLeads?.toLocaleString() || 0,
            changeType: "positive",
            icon: UserCheck,
            color: "bg-gray-800",
        },
        {
            title: "Leads Qualificados",
            value: stats.leadsQualificados?.toLocaleString() || 0,
            changeType: "positive",
            icon: TrendingUp,
            color: "bg-green-500",
        },
        {
            title: "Vendedores Ativos",
            value: stats.corretoresAtivos?.toString() || 0,
            changeType: "positive",
            icon: Users,
            color: "bg-purple-500",
        },
        {
            title: "Taxa de Conversão",
            value: `${stats.taxaConversao}%`,
            changeType: "negative",
            icon: TrendingDown,
            color: "bg-orange-500",
        },
    ];

    const getStatusColor = (
        statusObj: string | { name: string; color: string } | undefined
    ) => {
        // Se for objeto Status, use a propriedade name; senão use como string
        const statusName =
            typeof statusObj === "object" && statusObj?.name
                ? statusObj.name
                : statusObj;
        const status =
            typeof statusName === "string" ? statusName.toUpperCase() : "";

        if (typeof statusObj === "object" && statusObj?.color) {
            console.log("Usando cor customizada:", statusName, statusObj.color);
            return `bg-[${statusObj.color}] text-white`;
        }

        switch (status) {
            case "NOVO":
                return "bg-blue-100 text-blue-800";
            case "CONTATO":
                return "bg-yellow-100 text-yellow-800";
            case "PROPOSTA":
                return "bg-purple-100 text-purple-800";
            case "CONVERTIDO":
                return "bg-green-100 text-green-800";
            case "PERDIDO":
                return "bg-red-100 text-red-800";
            case "QUALIFICADO":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusName = (
        statusObj: string | { name: string } | undefined
    ): string => {
        if (!statusObj) return "Sem status";
        if (typeof statusObj === "object" && statusObj?.name)
            return statusObj.name;
        if (typeof statusObj === "string") return statusObj;
        return "Sem status";
    };

    // cores calculadas acima via useMemo

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard
                    </h1>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={refreshStats}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                isLoading ? "animate-spin" : ""
                            }`}
                        />
                        <span>Atualizar</span>
                    </button>

                    {/* Select de Cliente para Admin */}
                    {user?.role === "ADMIN" && (
                        <div className="flex items-center space-x-2">
                            <select
                                id="tenant-select"
                                value={selectedTenantId}
                                onChange={(e) =>
                                    setSelectedTenantId(e.target.value)
                                }
                                disabled={isLoadingTenants}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 min-w-[200px]"
                            >
                                <option value="">Todos os clientes</option>
                                {tenants.map((tenant) => (
                                    <option key={tenant.id} value={tenant.id}>
                                        {tenant.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="relative">
                        <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                            value={selectedPeriod.value}
                            onChange={(e) => {
                                const period = filterPeriods.find(
                                    (p) => p.value === e.target.value
                                );
                                if (period) handlePeriodChange(period);
                            }}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        >
                            {filterPeriods.map((period) => (
                                <option key={period.value} value={period.value}>
                                    {period.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Custom Date Range Modal */}
            {showCustomDatePicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            Período Personalizado
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="date-from"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Data Inicial
                                </label>
                                <input
                                    id="date-from"
                                    type="date"
                                    value={tempDateRange.from}
                                    onChange={(e) =>
                                        setTempDateRange((prev) => ({
                                            ...prev,
                                            from: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="date-to"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Data Final
                                </label>
                                <input
                                    id="date-to"
                                    type="date"
                                    value={tempDateRange.to}
                                    onChange={(e) =>
                                        setTempDateRange((prev) => ({
                                            ...prev,
                                            to: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCustomDateSubmit}
                                    className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black"
                                >
                                    Aplicar
                                </button>
                                <button
                                    onClick={() =>
                                        setShowCustomDatePicker(false)
                                    }
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className={`bg-white p-6 rounded-lg shadow-md transition-all ${
                                isLoading ? "opacity-50" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                    <p
                                        className={`text-sm font-medium ${
                                            stat.changeType === "positive"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    ></p>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                                >
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Leads, Top Vendedores and Status Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leads Chart and Recent Leads */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Leads por Dia Chart */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Leads por Dia
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedPeriod.label}
                                </p>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3">
                                <div className="text-sm text-gray-600">
                                    Total do período
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                    {stats.leadsPorDia.reduce(
                                        (sum, item) => sum + item.quantidade,
                                        0
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            className={`p-6 transition-opacity ${
                                isLoading ? "opacity-50" : ""
                            }`}
                        >
                            <div className="h-64 relative">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={leadsPorDiaChart}
                                            margin={{
                                                top: 10,
                                                right: 20,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                allowDecimals={false}
                                            />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Leads */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Leads Recentes
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
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
                                            Vendedor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    className={`bg-white divide-y divide-gray-200 ${
                                        isLoading ? "opacity-50" : ""
                                    }`}
                                >
                                    {stats.leadsRecentes.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">
                                                    {lead.nome.split(" ")[0]}{" "}
                                                    {lead.nome.split(" ").pop()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {lead.email}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {lead.telefone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                        lead.leadStatus
                                                    )}`}
                                                >
                                                    {getStatusName(
                                                        lead.leadStatus
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {lead.corretor}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            sendWhatsApp(
                                                                lead.telefone,
                                                                lead.nome
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-900"
                                                        title="WhatsApp"
                                                    >
                                                        <Phone className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                `mailto:${lead.email}`
                                                            )
                                                        }
                                                        className="text-gray-900 hover:text-gray-700"
                                                        title="Email"
                                                    >
                                                        <Mail className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column - Top Vendedores and Status Chart */}
                <div className="space-y-6">
                    {/* Top 5 Vendedores */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Top 5 Vendedores
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Leads em atendimento
                            </p>
                        </div>
                        <div className={`p-6 ${isLoading ? "opacity-50" : ""}`}>
                            <div className="space-y-4">
                                {stats.topCorretores.map((corretor, index) => (
                                    <div
                                        key={corretor.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center">
                                                <span className="text-lg font-bold text-gray-400 w-6">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                            <div
                                                className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center`}
                                            >
                                                <span className="text-white font-semibold text-sm">
                                                    {corretor.nome
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .substring(0, 2)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {corretor.nome}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {corretor.leads} leads
                                                    ativos
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full bg-gray-800"
                                                        style={{
                                                            width: `${
                                                                (corretor.leads /
                                                                    50) *
                                                                100
                                                            }%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {corretor.leads}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">
                                        Total de leads em atendimento
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.topCorretores.reduce(
                                            (sum, c) => sum + c.leads,
                                            0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leads por Status Chart - Funil */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Leads por Status
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Funil de vendas
                            </p>
                        </div>
                        <div className={`p-6 ${isLoading ? "opacity-50" : ""}`}>
                            <div className="space-y-0.5">
                                {/* Gráfico de funil customizado */}
                                {[...statusPieData]
                                    .sort((a, b) => a.ordem - b.ordem)
                                    .map((item) => {
                                        const maxValue = Math.max(
                                            ...statusPieData.map((s) => s.value)
                                        );

                                        const pct =
                                            statusTotal > 0
                                                ? Math.round(
                                                      (item.value /
                                                          statusTotal) *
                                                          1000
                                                  ) / 10
                                                : 0;
                                        const percentage =
                                            maxValue > 0
                                                ? (item.value / maxValue) * 100
                                                : 0;

                                        return (
                                            <div
                                                key={item.raw}
                                                className="relative flex justify-center"
                                            >
                                                <div
                                                    className="relative h-8 bg-gray-100 rounded-lg overflow-hidden"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        minWidth:
                                                            item.value > 0
                                                                ? "30px"
                                                                : "0",
                                                    }}
                                                >
                                                    <div
                                                        className="h-full rounded-lg transition-all duration-500 flex items-center justify-center"
                                                        style={{
                                                            backgroundColor:
                                                                item.color,
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {item.value > 0 && (
                                                            <span className="text-xs font-semibold text-white">
                                                                {item.value} (
                                                                {pct.toFixed(1)}
                                                                %)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                {/* Legenda com percentuais */}
                                <div className="grid grid-cols-1 gap-2 w-full mt-4">
                                    {[...statusPieData]
                                        .sort((a, b) => a.ordem - b.ordem)
                                        .map((item) => {
                                            const pct =
                                                statusTotal > 0
                                                    ? Math.round(
                                                          (item.value /
                                                              statusTotal) *
                                                              1000
                                                      ) / 10
                                                    : 0;
                                            return (
                                                <div
                                                    key={item.raw}
                                                    className="flex items-center justify-between p-2 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    item.color,
                                                            }}
                                                        />
                                                        <span className="text-sm text-gray-700 font-medium">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {item.value}
                                                        </span>
                                                        <span className="text-xs text-gray-500 ml-1">
                                                            ({pct}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                    <p className="text-sm text-gray-500">
                                        Total de Leads
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {totalLeads}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
