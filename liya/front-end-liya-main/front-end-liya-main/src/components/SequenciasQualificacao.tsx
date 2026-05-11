import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { useSequencias } from '../hooks/useSequencias';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { SequenciaQualificacao } from '../types';

const SequenciasQualificacao: React.FC = () => {
  const { logout } = useAuth();
  const { error, success } = useToast();
  const { sequencias, isLoading, createSequencia, updateSequencia, deleteSequencia } = useSequencias({
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

  const [showModal, setShowModal] = useState(false);
  const [editingSequencia, setEditingSequencia] = useState<SequenciaQualificacao | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sequenciaToDelete, setSequenciaToDelete] = useState<SequenciaQualificacao | null>(null);
  const [formData, setFormData] = useState<{
    pergunta: string;
    resposta: string;
  }>({
    pergunta: '',
    resposta: ''
  });

  const handleOpenModal = (sequencia?: SequenciaQualificacao) => {
    if (sequencia) {
      setEditingSequencia(sequencia);
      setFormData({
        pergunta: sequencia.pergunta,
        resposta: sequencia.resposta || ''
      });
    } else {
      setEditingSequencia(null);
      setFormData({
        pergunta: '',
        resposta: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSequencia(null);
    setFormData({
      pergunta: '',
      resposta: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSequencia) {
      await updateSequencia(editingSequencia.id, formData);
    } else {
      await createSequencia(formData);
    }
    
    handleCloseModal();
  };

  const handleDeleteClick = (sequencia: SequenciaQualificacao) => {
    setSequenciaToDelete(sequencia);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (sequenciaToDelete) {
      await deleteSequencia(sequenciaToDelete.id);
      setShowConfirmModal(false);
      setSequenciaToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSequenciaToDelete(null);
  };

  if (isLoading && sequencias.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Sequência de Qualificação de Leads</h2>
          <p className="text-gray-600 mt-1">Gerencie as perguntas e respostas para qualificação de leads</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Pergunta</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Ordem
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pergunta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resposta
                </th>
                <th scope="col" className="relative px-6 py-3 w-32">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sequencias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma sequência cadastrada. Clique em "Nova Pergunta" para começar.
                  </td>
                </tr>
              ) : (
                sequencias.map((sequencia) => (
                  <tr key={sequencia.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                        {sequencia.ordem}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {sequencia.pergunta}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {sequencia.resposta || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(sequencia)}
                          className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(sequencia)}
                          className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação/Edição */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingSequencia ? 'Editar Sequência' : 'Nova Sequência'}
      >
        <form onSubmit={handleSubmit} className="space-y-2 p-4">
          <div>
            <label htmlFor="pergunta" className="block text-sm font-medium text-gray-700 mb-1">
              Pergunta *
            </label>
            <textarea
              id="pergunta"
              value={formData.pergunta}
              onChange={(e) => setFormData({ ...formData, pergunta: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Digite a pergunta para qualificação do lead"
              required
            />
          </div>

          <div>
            <label htmlFor="resposta" className="block text-sm font-medium text-gray-700 mb-1">
              Resposta (opcional)
            </label>
            <textarea
              id="resposta"
              value={formData.resposta}
              onChange={(e) => setFormData({ ...formData, resposta: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Digite uma resposta sugerida (opcional)"
            />
          </div>

          {editingSequencia && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Ordem atual:</span> {editingSequencia.ordem}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseModal}
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
              <span>{editingSequencia ? 'Atualizar' : 'Criar'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a pergunta "${sequenciaToDelete?.pergunta}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default SequenciasQualificacao;
