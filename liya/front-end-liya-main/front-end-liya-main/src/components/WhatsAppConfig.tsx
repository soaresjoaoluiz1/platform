import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, Wifi, WifiOff, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { useToast } from '../hooks/useToast';
import ConfirmationModal from './ConfirmationModal';

const WhatsAppConfig: React.FC = () => {
  const { error, success } = useToast();
  const {
    instance,
    isLoading,
    isConnecting,
    conectar,
    desconectar,
    verificarStatus,
    atualizarQrCode,
  } = useWhatsApp({
    onError: (message) => error('Erro', message),
    onSuccess: (message) => success('Sucesso', message),
    autoRefresh: true,
    refreshInterval: 5000,
  });

  const [showQrCode, setShowQrCode] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Atualizar QR Code local quando instance mudar
  useEffect(() => {
    if (instance?.qrCode) {
      setCurrentQrCode(instance.qrCode);
    }
  }, [instance?.qrCode]);

  // Controlar exibição do QR Code
  useEffect(() => {
    if (instance?.status === 'conectando' && currentQrCode) {
      setShowQrCode(true);
    } else if (instance?.status === 'conectada') {
      setShowQrCode(false);
      setCurrentQrCode(null);
    }
  }, [instance?.status, currentQrCode]);

  const handleConectar = async () => {
    try {
      await conectar();
      setShowQrCode(true);
    } catch {
      // Erro já tratado no hook
    }
  };

  const handleDesconectar = () => {
    setShowConfirmModal(true);
  };

  const confirmDesconectar = async () => {
    try {
      await desconectar();
      setShowQrCode(false);
      setShowConfirmModal(false);
    } catch {
      // Erro já tratado no hook
    }
  };

  const handleAtualizarQr = async () => {
    try {
      await atualizarQrCode();
      setShowQrCode(true);
    } catch {
      // Erro já tratado no hook
    }
  };

  const getStatusIcon = () => {
    switch (instance?.status) {
      case 'conectada':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'conectando':
        return <Clock className="h-6 w-6 text-yellow-500 animate-pulse" />;
      case 'desconectada':
        return <WifiOff className="h-6 w-6 text-gray-400" />;
      case 'erro':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <WifiOff className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (instance?.status) {
      case 'conectada':
        return 'Conectado';
      case 'conectando':
        return 'Conectando...';
      case 'desconectada':
        return 'Desconectado';
      case 'erro':
        return 'Erro na conexão';
      default:
        return 'Sem instância';
    }
  };

  const getStatusColor = () => {
    switch (instance?.status) {
      case 'conectada':
        return 'text-green-600';
      case 'conectando':
        return 'text-yellow-600';
      case 'desconectada':
        return 'text-gray-600';
      case 'erro':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-6">
          <Smartphone className="h-6 w-6 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Configuração do WhatsApp</h2>
        </div>

        {/* Status Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <p className="text-sm text-gray-500">Status da Conexão</p>
                <p className={`text-lg font-semibold ${getStatusColor()}`}>
                  {getStatusText()}
                </p>
              </div>
            </div>
            {instance?.status === 'conectada' && (
              <button
                onClick={() => verificarStatus()}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                title="Verificar status"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          {instance?.instanceName && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Instância:</span> {instance.instanceName}
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3">
          {!instance || instance.status === 'desconectada' ? (
            <button
              onClick={handleConectar}
              disabled={isConnecting || isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
            >
              <Wifi className="h-5 w-5" />
              <span>{isConnecting ? 'Conectando...' : 'Conectar WhatsApp'}</span>
            </button>
          ) : (
            <button
              onClick={handleDesconectar}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
            >
              <WifiOff className="h-5 w-5" />
              <span>Desconectar WhatsApp</span>
            </button>
          )}

          {instance?.status === 'conectando' && (
            <button
              onClick={handleAtualizarQr}
              disabled={isLoading}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Atualizar QR Code</span>
            </button>
          )}
        </div>

        {/* QR Code Display */}
        {showQrCode && currentQrCode && (instance?.status === 'conectando' || instance?.status === 'conectada') && (
          <div className="mt-6 bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Escaneie o QR Code
            </h3>
            <div className="flex flex-col items-center">
              <img
                src={currentQrCode}
                alt="QR Code WhatsApp"
                className="w-64 h-64 border border-gray-300 rounded-lg"
              />
              <div className="mt-4 text-sm text-gray-600 text-center max-w-md">
                <p className="mb-2">Para conectar sua conta do WhatsApp:</p>
                <ol className="text-left space-y-1 list-decimal list-inside">
                  <li>Abra o WhatsApp no seu celular</li>
                  <li>Toque em <strong>Mais opções</strong> ou <strong>Configurações</strong></li>
                  <li>Toque em <strong>Aparelhos conectados</strong></li>
                  <li>Toque em <strong>Conectar um aparelho</strong></li>
                  <li>Aponte seu celular para esta tela para escanear o código</li>
                </ol>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                O QR Code expira após alguns minutos. Se isso acontecer, clique em "Atualizar QR Code".
              </p>
            </div>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-blue-900">Importante</h4>
              <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Mantenha seu WhatsApp sempre conectado para enviar mensagens</li>
                <li>Não faça logout do WhatsApp Web em outros dispositivos</li>
                <li>A conexão é pessoal e intransferível</li>
                <li>Você pode desconectar a qualquer momento</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDesconectar}
        title="Desconectar WhatsApp"
        message="Tem certeza que deseja desconectar sua instância do WhatsApp? Você precisará escanear o QR Code novamente para reconectar."
        confirmText="Desconectar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default WhatsAppConfig;
