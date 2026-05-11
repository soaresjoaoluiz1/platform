import React, { useState } from 'react';
import { Plus, Edit, Trash2, Power, Search, Filter } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import MensagemProntaModal from './MensagemProntaModal';
import { useMensagens } from '../hooks/useMensagens';
import { useStatus } from '../hooks/useStatus';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import type { MensagemPronta } from '../types';

const MensagensProntas: React.FC = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { status } = useStatus({
    onError: (message, isTokenExpired) => {
      if (isTokenExpired) {
        toast.error('Token Expirado', message);
        setTimeout(() => logout(), 2000);
      } else {
        toast.error('Erro', message);
      }
    },
    onSuccess: (message) => toast.success('Sucesso', message),
    onTokenExpired: () => {
      setTimeout(() => logout(), 2000);
    }
  });

  const {
    mensagens,
    loading,
    loadMensagens,
    toggleActive,
    deleteMensagem
  } = useMensagens();

  const [showModal, setShowModal] = useState(false);
  const [editingMensagem, setEditingMensagem] = useState<MensagemPronta | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mensagemToDelete, setMensagemToDelete] = useState<MensagemPronta | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterActive, setFilterActive] = useState<string>('all');

  // Verifica se o usuário tem permissão
  if (!user || user.role === 'CORRETOR') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta funcionalidade.
          </p>
        </div>
      </div>
    );
  }

  const handleOpenModal = (mensagem?: MensagemPronta) => {
    setEditingMensagem(mensagem || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMensagem(null);
  };

  const handleConfirmDelete = async () => {
    if (!mensagemToDelete) return;
    
    const success = await deleteMensagem(mensagemToDelete.id);
    if (success) {
      setShowConfirmModal(false);
      setMensagemToDelete(null);
    }
  };

  const handleToggleActive = async (mensagem: MensagemPronta) => {
    await toggleActive(mensagem.id);
  };

  const handleSearch = () => {
    loadMensagens({
      search: searchTerm || undefined,
      statusId: filterStatus || undefined,
      isActive: filterActive === 'all' ? undefined : filterActive === 'active'
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterActive('all');
    loadMensagens();
  };

  const truncateText = (text: string, maxLength = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredMensagens = mensagens;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Mensagens para FollowUp
          </h1>
          <p className="text-gray-600">
            Gerencie mensagens pré-configuradas para uso rápido
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Busca */}
            <div className="md:col-span-3">
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <input
                  id="search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar por título ou conteúdo..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Filtro por Status */}
            <div className="md:col-span-1">
              <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os status</option>
                {status.filter(s => s.isActive).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Aplicar Filtros
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpar
            </button>
            <div className="flex-1"></div>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Mensagem
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando mensagens...</p>
          </div>
        )}

        {/* Lista de Mensagens */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMensagens.length === 0 ? (
              <div className="col-span-full bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-600 text-lg">
                  Nenhuma mensagem encontrada
                </p>
                <button
                  onClick={() => handleOpenModal()}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Criar primeira mensagem
                </button>
              </div>
            ) : (
              filteredMensagens.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`col-span-full bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                    mensagem.isActive ? '' : 'opacity-60'
                  }`}
                >
                  {/* Header do Card */}
                  <div
                    className="h-2"
                    style={{
                      backgroundColor: mensagem.status?.color || '#6B7280'
                    }}
                  ></div>

                  <div className="p-6">
                    {/* Título */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 flex-1">
                        {mensagem.titulo}
                      </h3>
                      <div className="flex items-center gap-2 ml-2">
                        {!mensagem.isActive && (
                          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                            Inativa
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Conteúdo (limitado a 50 caracteres) */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {truncateText(mensagem.conteudo, 50)}
                    </p>

                    {/* Badge de Status */}
                    {mensagem.status && (
                      <div className="mb-4">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${mensagem.status.color}20`,
                            color: mensagem.status.color
                          }}
                        >
                          {mensagem.status.name}
                        </span>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleOpenModal(mensagem)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleActive(mensagem)}
                        className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
                          mensagem.isActive
                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <Power className="h-4 w-4" />
                        {mensagem.isActive ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => {
                          setMensagemToDelete(mensagem);
                          setShowConfirmModal(true);
                        }}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <MensagemProntaModal
          mensagem={editingMensagem}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            loadMensagens();
          }}
        />
      )}

      {/* Modal de Confirmação */}
      {showConfirmModal && mensagemToDelete && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          title="Excluir Mensagem"
          message={`Tem certeza que deseja excluir a mensagem "${mensagemToDelete.titulo}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleConfirmDelete}
          onClose={() => {
            setShowConfirmModal(false);
            setMensagemToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default MensagensProntas;
