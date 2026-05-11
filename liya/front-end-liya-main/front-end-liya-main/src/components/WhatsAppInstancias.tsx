import React, { useEffect } from 'react';
import { Smartphone, CheckCircle2, Clock, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useWhatsAppInstances } from '../hooks/useWhatsApp';
import { useToast } from '../hooks/useToast';

const WhatsAppInstancias: React.FC = () => {
  const { error } = useToast();
  const { instances, isLoading, loadInstances } = useWhatsAppInstances({
    onError: (message) => error('Erro', message),
  });

  useEffect(() => {
    loadInstances();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'conectada':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3" />
            <span>Conectada</span>
          </span>
        );
      case 'conectando':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3" />
            <span>Conectando</span>
          </span>
        );
      case 'desconectada':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            <WifiOff className="h-3 w-3" />
            <span>Desconectada</span>
          </span>
        );
      case 'erro':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3" />
            <span>Erro</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            <span>Desconhecido</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Instâncias de WhatsApp</h2>
          </div>
          <button
            onClick={() => loadInstances()}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{instances.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Conectadas</p>
            <p className="text-2xl font-bold text-green-700">
              {instances.filter(i => i.status === 'conectada').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Conectando</p>
            <p className="text-2xl font-bold text-yellow-700">
              {instances.filter(i => i.status === 'conectando').length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Desconectadas</p>
            <p className="text-2xl font-bold text-gray-700">
              {instances.filter(i => i.status === 'desconectada').length}
            </p>
          </div>
        </div>

        {/* Tabela de Instâncias */}
        {isLoading && instances.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando instâncias...</p>
          </div>
        ) : instances.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma instância encontrada
            </h3>
            <p className="text-gray-500">
              Os vendedores ainda não configuraram suas instâncias de WhatsApp.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instância
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Conexão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criada em
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {instances.map((instance) => (
                  <tr key={instance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {instance.userName?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {instance.userName || 'Usuário desconhecido'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {instance.userId?.substring(0, 8) || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{instance.instanceName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(instance.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {instance.lastConnection
                        ? new Date(instance.lastConnection).toLocaleString('pt-BR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(instance.createdAt).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-semibold text-blue-900">Sobre as Instâncias</h4>
            <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Cada vendedor possui sua própria instância de WhatsApp</li>
              <li>As instâncias são pessoais e intransferíveis</li>
              <li>O status é atualizado automaticamente a cada 5 segundos</li>
              <li>Vendedores devem manter suas instâncias conectadas para enviar mensagens</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppInstancias;
