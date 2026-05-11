import React, { useState } from "react";
import { Smartphone } from "lucide-react";
import WhatsAppConfig from "./WhatsAppConfig";
import { useAuth } from "../contexts/AuthContext";

type TabType = "whatsapp";

const Integracoes: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("whatsapp");

    const tabs = [
        {
            id: "whatsapp" as TabType,
            label: "Meu WhatsApp",
            icon: Smartphone,
            roles: ["CORRETOR", "IMOBILIARIA", "ADMIN"],
        },
    ].filter((tab) => tab.roles.includes(user?.role || ""));

    const renderTabContent = () => {
        // switch (activeTab) {
        //   case 'whatsapp':
        //     return <WhatsAppConfig />;
        //   default:
        //     return <WhatsAppConfig />;
        // }
        return <WhatsAppConfig />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Integrações
                </h1>
                <p className="text-gray-600 mt-1">
                    Gerencie as integrações do sistema
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

export default Integracoes;
