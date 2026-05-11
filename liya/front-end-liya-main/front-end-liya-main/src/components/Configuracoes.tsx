import React, { useState } from "react";
import {
    Tags,
    MessageSquare,
    ListOrdered,
    Megaphone,
    Mail,
    Repeat,
    GitBranch,
} from "lucide-react";
import StatusLeads from "./StatusLeads";
import MensagensProntas from "./MensagensProntas";
import SequenciasQualificacao from "./SequenciasQualificacao";
import Lancamentos from "./Lancamentos";
import PrimeiraMensagem from "./PrimeiraMensagem";
import RoletaConfig from "./RoletaConfig";
import CadenciasAtendimento from "./CadenciasAtendimento";
import { useAuth } from "../contexts/AuthContext";

type TabType =
    | "status"
    | "mensagens"
    | "sequencias"
    | "lancamentos"
    | "primeira-mensagem"
    | "roletas"
    | "cadencias";

const Configuracoes: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("status");

    const tabs = [
        {
            id: "status" as TabType,
            label: "Status de Leads",
            icon: Tags,
            roles: ["ADMIN", "IMOBILIARIA"],
        },
        {
            id: "sequencias" as TabType,
            label: "Qualificação de Lead",
            icon: ListOrdered,
            roles: ["IMOBILIARIA"],
        },
        {
            id: "lancamentos" as TabType,
            label: "Lançamentos",
            icon: Megaphone,
            roles: ["IMOBILIARIA"],
        },
        {
            id: "mensagens" as TabType,
            label: "Mensagens para FollowUp",
            icon: MessageSquare,
            roles: ["IMOBILIARIA"],
        },
        {
            id: "cadencias" as TabType,
            label: "Cadência de Atendimento",
            icon: GitBranch,
            roles: ["IMOBILIARIA"],
        },
        {
            id: "primeira-mensagem" as TabType,
            label: "Primeira Mensagem",
            icon: Mail,
            roles: ["IMOBILIARIA"],
        },
        {
            id: "roletas" as TabType,
            label: "Roletas",
            icon: Repeat,
            roles: ["ADMIN", "IMOBILIARIA"],
        },
        // Adicione novas abas aqui no futuro
    ].filter((tab) => tab.roles.includes(user?.role || ""));

    const renderTabContent = () => {
        // Renderiza o conteúdo baseado na aba ativa
        switch (activeTab) {
            case "status":
                return <StatusLeads />;
            case "sequencias":
                return <SequenciasQualificacao />;
            case "lancamentos":
                return <Lancamentos />;
            case "mensagens":
                return <MensagensProntas />;
            case "cadencias":
                return <CadenciasAtendimento />;
            case "primeira-mensagem":
                return <PrimeiraMensagem />;
            case "roletas":
                return <RoletaConfig />;
            default:
                return <StatusLeads />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Configurações
                </h1>
                <p className="text-gray-600 mt-1">
                    Gerencie as configurações do sistema
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  transition-colors duration-150
                  ${
                      activeTab === tab.id
                          ? "border-gray-800 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">{renderTabContent()}</div>
        </div>
    );
};

export default Configuracoes;
