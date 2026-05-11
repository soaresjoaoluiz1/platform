import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { useToast } from "./hooks/useToast";
import { setTokenExpiredCallback } from "./services/api";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Vendedores from "./components/Vendedores";
import Leads from "./components/Leads";
import Configuracoes from "./components/Configuracoes";
import Integracoes from "./components/Integracoes";
import CadastroImobiliaria from "./components/CadastroImobiliaria";
import Login from "./components/Login";
import Disparos from "./components/Disparos";
import MensagensProntas from "./components/MensagensProntas";

const AppContent: React.FC = () => {
    const { user, isLoading, logout } = useAuth();
    const { error } = useToast();
    const [activeMenu, setActiveMenu] = useState(() => {
        // Recuperar a última aba selecionada do localStorage
        return localStorage.getItem("activeMenu") || "dashboard";
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Configurar callback para quando token expirar
        setTokenExpiredCallback(() => {
            error(
                "Sessão Expirada",
                "Sua sessão expirou. Faça login novamente.",
            );
            logout();
        });
    }, [error, logout]);

    // Salvar a aba ativa no localStorage sempre que mudar
    useEffect(() => {
        if (user) {
            localStorage.setItem("activeMenu", activeMenu);
        }
    }, [activeMenu, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    const renderContent = () => {
        switch (activeMenu) {
            case "dashboard":
                return <Dashboard />;
            case "vendedores":
                return <Vendedores />;
            case "leads":
                return <Leads />;
            case "configuracoes":
                return <Configuracoes />;
            case "integracoes":
                return <Integracoes />;
            case "disparos":
                return <Disparos />;
            case "mensagens":
                return <MensagensProntas />;
            case "cadastro":
                return <CadastroImobiliaria />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={(menu) => {
                    setActiveMenu(menu);
                    localStorage.setItem("activeMenu", menu);
                }}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col">
                <Header
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                />

                <main className="flex-1 overflow-auto p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
