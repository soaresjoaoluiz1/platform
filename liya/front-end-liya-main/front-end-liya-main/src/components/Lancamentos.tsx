import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { useLancamentos } from '../hooks/useLancamentos';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Lancamento, MensagemLancamento } from '../types';

const Lancamentos: React.FC = () => {
  const { logout } = useAuth();
  const { error, success } = useToast();
  const { 
    lancamentos, 
    isLoading, 
    createLancamento, 
    updateLancamento, 
    deleteLancamento,
    createMensagem,
    updateMensagem,
    deleteMensagem
  } = useLancamentos({
    onError: (message, isTokenExpired) => {
      if (isTokenExpired) {
        error('Token Expirado', message);
      } else {
        error('Erro', message);
      }
    },
    onSuccess: (message) => success('Sucesso', message),
    onTokenExpired: () => {
      setTimeout(() => logout(), 2000);
    }
  });

  // Estado para expansão dos lançamentos
  const [expandedLancamentos, setExpandedLancamentos] = useState<Set<string>>(new Set());

  // Modais de lançamento
  const [showLancamentoModal, setShowLancamentoModal] = useState(false);
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(null);
  const [showConfirmLancamentoModal, setShowConfirmLancamentoModal] = useState(false);
  const [lancamentoToDelete, setLancamentoToDelete] = useState<Lancamento | null>(null);
  const [lancamentoFormData, setLancamentoFormData] = useState<{
    titulo: string;
    identificacaoAnuncio: string;
  }>({
    titulo: '',
    identificacaoAnuncio: ''
  });

  // Modais de mensagem
  const [showMensagemModal, setShowMensagemModal] = useState(false);
  const [editingMensagem, setEditingMensagem] = useState<MensagemLancamento | null>(null);
  const [selectedLancamentoId, setSelectedLancamentoId] = useState<string>('');
  const [showConfirmMensagemModal, setShowConfirmMensagemModal] = useState(false);
  const [mensagemToDelete, setMensagemToDelete] = useState<MensagemLancamento | null>(null);
  const [mensagemFormData, setMensagemFormData] = useState<{
    pergunta: string;
    resposta: string;
  }>({
    pergunta: '',
    resposta: ''
  });

  // Funções de expansão
  const toggleLancamento = (id: string) => {
    const newExpanded = new Set(expandedLancamentos);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLancamentos(newExpanded);
  };

  // Handlers de lançamento
  const handleOpenLancamentoModal = (lancamento?: Lancamento) => {
    if (lancamento) {
      setEditingLancamento(lancamento);
      setLancamentoFormData({
        titulo: lancamento.titulo,
        identificacaoAnuncio: lancamento.identificacaoAnuncio
      });
    } else {
      setEditingLancamento(null);
      setLancamentoFormData({
        titulo: '',
        identificacaoAnuncio: ''
      });
    }
    setShowLancamentoModal(true);
  };

  const handleCloseLancamentoModal = () => {
    setShowLancamentoModal(false);
    setEditingLancamento(null);
    setLancamentoFormData({
      titulo: '',
      identificacaoAnuncio: ''
    });
  };

  const handleSubmitLancamento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLancamento) {
      await updateLancamento(editingLancamento.id, lancamentoFormData);
    } else {
      await createLancamento(lancamentoFormData);
    }
    
    handleCloseLancamentoModal();
  };

  const handleDeleteLancamentoClick = (lancamento: Lancamento) => {
    setLancamentoToDelete(lancamento);
    setShowConfirmLancamentoModal(true);
  };

  const handleConfirmDeleteLancamento = async () => {
    if (lancamentoToDelete) {
      await deleteLancamento(lancamentoToDelete.id);
      setShowConfirmLancamentoModal(false);
      setLancamentoToDelete(null);
    }
  };

  const handleCancelDeleteLancamento = () => {
    setShowConfirmLancamentoModal(false);
    setLancamentoToDelete(null);
  };

  // Handlers de mensagem
  const handleOpenMensagemModal = (lancamentoId: string, mensagem?: MensagemLancamento) => {
    setSelectedLancamentoId(lancamentoId);
    if (mensagem) {
      setEditingMensagem(mensagem);
      setMensagemFormData({
        pergunta: mensagem.pergunta,
        resposta: mensagem.resposta
      });
    } else {
      setEditingMensagem(null);
      setMensagemFormData({
        pergunta: '',
        resposta: ''
      });
    }
    setShowMensagemModal(true);
  };

  const handleCloseMensagemModal = () => {
    setShowMensagemModal(false);
    setEditingMensagem(null);
    setSelectedLancamentoId('');
    setMensagemFormData({
      pergunta: '',
      resposta: ''
    });
  };

  const handleSubmitMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMensagem) {
      await updateMensagem(editingMensagem.id, mensagemFormData);
    } else {
      await createMensagem(selectedLancamentoId, mensagemFormData);
    }
    
    handleCloseMensagemModal();
  };

  const handleDeleteMensagemClick = (mensagem: MensagemLancamento) => {
    setMensagemToDelete(mensagem);
    setShowConfirmMensagemModal(true);
  };

  const handleConfirmDeleteMensagem = async () => {
    if (mensagemToDelete) {
      await deleteMensagem(mensagemToDelete.id);
      setShowConfirmMensagemModal(false);
      setMensagemToDelete(null);
    }
  };

  const handleCancelDeleteMensagem = () => {
    setShowConfirmMensagemModal(false);
    setMensagemToDelete(null);
  };

  if (isLoading && lancamentos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lançamentos</h2>
          <p className="text-gray-600 mt-1">Gerencie lançamentos e suas sequências de mensagens</p>
        </div>
        <button
          onClick={() => handleOpenLancamentoModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Lista de Lançamentos */}
      <div className="space-y-4">
        {lancamentos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            Nenhum lançamento cadastrado. Clique em "Novo Lançamento" para começar.
          </div>
        ) : (
          lancamentos.map((lancamento) => {
            const isExpanded = expandedLancamentos.has(lancamento.id);
            const mensagens = lancamento.mensagens || [];
            
            return (
              <div key={lancamento.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Cabeçalho do Lançamento */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => toggleLancamento(lancamento.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{lancamento.titulo}</h3>
                        <p className="text-sm text-gray-600">ID: {lancamento.identificacaoAnuncio}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {mensagens.length} {mensagens.length === 1 ? 'mensagem' : 'mensagens'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenMensagemModal(lancamento.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        title="Adicionar mensagem"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Nova Mensagem</span>
                      </button>
                      <button
                        onClick={() => handleOpenLancamentoModal(lancamento)}
                        className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded"
                        title="Editar lançamento"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLancamentoClick(lancamento)}
                        className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded"
                        title="Excluir lançamento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mensagens do Lançamento */}
                {isExpanded && (
                  <div className="p-4 bg-gray-50">
                    {mensagens.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        Nenhuma mensagem cadastrada. Clique em "Nova Mensagem" para adicionar.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {mensagens
                          .sort((a, b) => a.ordem - b.ordem)
                          .map((mensagem) => (
                            <div
                              key={mensagem.id}
                              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm flex-shrink-0">
                                    {mensagem.ordem}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 mb-1">
                                      {mensagem.pergunta}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {mensagem.resposta}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 ml-4">
                                  <button
                                    onClick={() => handleOpenMensagemModal(lancamento.id, mensagem)}
                                    className="text-gray-600 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-100 rounded"
                                    title="Editar mensagem"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMensagemClick(mensagem)}
                                    className="text-red-600 hover:text-red-900 transition-colors p-1.5 hover:bg-red-50 rounded"
                                    title="Excluir mensagem"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Lançamento */}
      <Modal
        isOpen={showLancamentoModal}
        onClose={handleCloseLancamentoModal}
        title={editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
      >
        <form onSubmit={handleSubmitLancamento} className="space-y-2 p-4">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              value={lancamentoFormData.titulo}
              onChange={(e) => setLancamentoFormData({ ...lancamentoFormData, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: Residencial São Paulo"
              required
            />
          </div>

          <div>
            <label htmlFor="identificacaoAnuncio" className="block text-sm font-medium text-gray-700 mb-1">
              Identificação do Anúncio *
            </label>
            <input
              type="text"
              id="identificacaoAnuncio"
              value={lancamentoFormData.identificacaoAnuncio}
              onChange={(e) => setLancamentoFormData({ ...lancamentoFormData, identificacaoAnuncio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: RES-SP-2024-001"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseLancamentoModal}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{editingLancamento ? 'Atualizar' : 'Criar'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Mensagem */}
      <Modal
        isOpen={showMensagemModal}
        onClose={handleCloseMensagemModal}
        title={editingMensagem ? 'Editar Mensagem' : 'Nova Mensagem'}
      >
        <form onSubmit={handleSubmitMensagem} className="space-y-2 p-4">
          <div>
            <label htmlFor="pergunta" className="block text-sm font-medium text-gray-700 mb-1">
              Pergunta *
            </label>
            <textarea
              id="pergunta"
              value={mensagemFormData.pergunta}
              onChange={(e) => setMensagemFormData({ ...mensagemFormData, pergunta: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: Onde fica o imóvel?"
              required
            />
          </div>

          <div>
            <label htmlFor="resposta" className="block text-sm font-medium text-gray-700 mb-1">
              Resposta *
            </label>
            <textarea
              id="resposta"
              value={mensagemFormData.resposta}
              onChange={(e) => setMensagemFormData({ ...mensagemFormData, resposta: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: Na Zona Sul de São Paulo"
              required
            />
          </div>

          {editingMensagem && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Ordem atual:</span> {editingMensagem.ordem}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseMensagemModal}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{editingMensagem ? 'Atualizar' : 'Criar'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmação - Lançamento */}
      <ConfirmationModal
        isOpen={showConfirmLancamentoModal}
        onClose={handleCancelDeleteLancamento}
        onConfirm={handleConfirmDeleteLancamento}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o lançamento "${lancamentoToDelete?.titulo}"? Todas as mensagens vinculadas também serão excluídas.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de Confirmação - Mensagem */}
      <ConfirmationModal
        isOpen={showConfirmMensagemModal}
        onClose={handleCancelDeleteMensagem}
        onConfirm={handleConfirmDeleteMensagem}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta mensagem?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Lancamentos;
