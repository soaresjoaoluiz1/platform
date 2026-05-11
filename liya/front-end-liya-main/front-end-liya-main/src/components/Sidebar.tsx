import React from "react";
import {
    LayoutDashboard,
    Users,
    UserCheck,
    X,
    Building,
    MessageCircle,
    Settings,
    Plug,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeMenu,
    setActiveMenu,
    sidebarOpen,
    setSidebarOpen,
}) => {
    const { hasPermission } = useAuth();
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        ...(hasPermission(["ADMIN", "IMOBILIARIA"])
            ? [{ id: "vendedores", label: "Vendedores", icon: Users }]
            : []),
        { id: "disparos", label: "Disparos", icon: MessageCircle },
        { id: "leads", label: "Leads", icon: UserCheck },
        { id: "integracoes", label: "Integrações", icon: Plug },
        ...(hasPermission(["IMOBILIARIA"])
            ? [{ id: "configuracoes", label: "Configurações", icon: Settings }]
            : []),
        ...(hasPermission(["ADMIN"])
            ? [{ id: "cadastro", label: "Clientes", icon: Building }]
            : []),
    ];

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Fechar menu lateral"
                />
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
            >
                <div className="flex items-center justify-between h-16 px-6 bg-black">
                    <div className="flex items-center space-x-2">
                        {/* inverter cores */}
                        <img
                            src="./logo.png"
                            alt="Lyia Logo"
                            className="h-12 w-auto mr-2 invert"
                        />
                        <h2 className="text-xl font-bold">LYIA</h2>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white hover:text-gray-300"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveMenu(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`
                  w-full flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors
                  ${activeMenu === item.id ? "bg-gray-800 border-r-4 border-gray-400" : ""}
                `}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
