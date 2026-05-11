import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">{user?.name}</span>
                  {user?.tenantName && (
                    <span className="text-xs text-gray-500">{user.tenantName}</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="Confirmar Logout"
        message="Tem certeza que deseja sair do sistema? Você precisará fazer login novamente para acessar."
        confirmText="Sair"
        cancelText="Cancelar"
        type="warning"
      />
    </>
  );
};

export default Header;
