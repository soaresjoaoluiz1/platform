import React, { useState } from 'react';
import Modal from './Modal';
import { useDisparoMassa } from '../hooks/useDisparoMassa';
import { useStatus } from '../hooks/useStatus';
import { useMensagens } from '../hooks/useMensagens';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

type Props = { isOpen: boolean; onClose: () => void; tenantId?: string };

const DisparoMassaModal: React.FC<Props> = ({ isOpen, onClose, tenantId }) => {
  const { logout, user } = useAuth();
  const { error } = useToast();
  const { isLoading, createDisparo } = useDisparoMassa();
  const { mensagens } = useMensagens();
  const { status: statusOptions } = useStatus({
    onError: (message, isTokenExpired) => {
      if (isTokenExpired) {
        error('Token Expirado', message);
      } else {
        error('Erro', message);
      }
    },
    onTokenExpired: () => {
      setTimeout(() => logout(), 2000);
    }
  });
  const [formData, setFormData] = useState({
    texto: '',
    imagem: null as File | null,
    video: null as File | null,
    instancia: 'WhatsApp Business',
    filtroStatusIds: [] as string[],
    dataAgendamento: '',
    horaAgendamento: '',
    allLeads: false,
    tipo: 'agendado' as 'agendado' | 'follow_up',
    followUpDays: 7,
    followUpStatusId: ''
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [selectedMensagemId, setSelectedMensagemId] = useState<string>('');

  const handleMensagemProntaSelect = (mensagemId: string) => {
    setSelectedMensagemId(mensagemId);
    if (!mensagemId) return;
    
    const mensagem = mensagens.find(m => m.id === mensagemId);
    if (mensagem) {
      setFormData(prev => ({
        ...prev,
        texto: mensagem.conteudo
      }));
    }
  };

  const truncateText = (text: string, maxLength = 15): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'imagem' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [type]: file }));
      const url = URL.createObjectURL(file);
      if (type === 'imagem' && file.type.startsWith('image/')) {
        setPreviewUrl(url);
      } else if (type === 'video' && file.type.startsWith('video/')) {
        setVideoPreviewUrl(url);
      }
    }
  };

  const handleStatusChange = (statusId: string) => {
    setFormData(prev => ({
      ...prev,
      filtroStatusIds: prev.filtroStatusIds.includes(statusId)
        ? prev.filtroStatusIds.filter(s => s !== statusId)
        : [...prev.filtroStatusIds, statusId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações específicas por tipo
    if (formData.tipo === 'agendado') {
      if (!formData.dataAgendamento || !formData.horaAgendamento) {
        error('Campos obrigatórios', 'Data e hora são obrigatórias para disparo agendado');
        return;
      }
    } else if (formData.tipo === 'follow_up') {
      if (!formData.followUpStatusId || !formData.followUpDays) {
        error('Campos obrigatórios', 'Status e dias são obrigatórios para disparo follow-up');
        return;
      }
    }
    
    const dataHora = formData.tipo === 'agendado' && formData.dataAgendamento && formData.horaAgendamento
      ? new Date(`${formData.dataAgendamento}T${formData.horaAgendamento}`)
      : undefined;
      
    const success = await createDisparo({
      texto: formData.texto,
      instancia: formData.instancia,
      filtroStatus: formData.tipo === 'follow_up' ? [formData.followUpStatusId] : formData.filtroStatusIds,
      dataAgendamento: dataHora,
      // Passar arquivos separadamente
      imagem: formData.imagem,
      video: formData.video,
      allLeads: formData.allLeads,
      tipo: formData.tipo,
      followUpDays: formData.tipo === 'follow_up' ? formData.followUpDays : undefined,
      followUpStatusId: formData.tipo === 'follow_up' ? formData.followUpStatusId : undefined,
    }, { tenantId });
    
    if (success) {
      // Disparar evento customizado para atualizar a lista de disparos
      window.dispatchEvent(new CustomEvent('disparo-created'));
    }
    
    onClose();
    setFormData({ 
      texto: '', 
      imagem: null, 
      video: null, 
      instancia: 'WhatsApp Business', 
      filtroStatusIds: [], 
      dataAgendamento: '', 
      horaAgendamento: '', 
      allLeads: false,
      tipo: 'agendado',
      followUpDays: 7,
      followUpStatusId: ''
    });
    setPreviewUrl('');
    setVideoPreviewUrl('');
    setSelectedMensagemId('');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Disparo em Massa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select de Mensagens Prontas */}
          <div>
            <label htmlFor="mensagem-pronta" className="block text-sm font-medium text-gray-700 mb-1">
              Mensagens Prontas (opcional)
            </label>
            <select
              id="mensagem-pronta"
              value={selectedMensagemId}
              onChange={(e) => handleMensagemProntaSelect(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Selecione uma mensagem pronta...</option>
              {mensagens
                .filter(m => m.isActive)
                .map((mensagem) => {
                  const preview = truncateText(mensagem.conteudo, 15);
                  const statusInfo = mensagem.status ? ` [${mensagem.status.name}]` : '';
                  return (
                    <option key={mensagem.id} value={mensagem.id}>
                      {mensagem.titulo} - {preview}{statusInfo}
                    </option>
                  );
                })}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Selecione uma mensagem pronta para preencher automaticamente o campo de texto
            </p>
            
            {/* Preview da mensagem selecionada */}
            {selectedMensagemId && mensagens.find(m => m.id === selectedMensagemId) && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-xs font-semibold text-blue-900">
                    {mensagens.find(m => m.id === selectedMensagemId)?.titulo}
                  </p>
                  {mensagens.find(m => m.id === selectedMensagemId)?.status && (
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${mensagens.find(m => m.id === selectedMensagemId)?.status?.color}20`,
                        color: mensagens.find(m => m.id === selectedMensagemId)?.status?.color
                      }}
                    >
                      {mensagens.find(m => m.id === selectedMensagemId)?.status?.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {truncateText(mensagens.find(m => m.id === selectedMensagemId)?.conteudo || '', 60)}
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="disparo-mensagem" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
            <textarea id="disparo-mensagem" value={formData.texto} onChange={(e) => setFormData(prev => ({ ...prev, texto: e.target.value }))} required disabled={isLoading} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800" placeholder="Digite a mensagem que será enviada..." />
          </div>

          {/* Seleção do tipo de disparo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Disparo</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipo: 'agendado' }))}
                disabled={isLoading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.tipo === 'agendado'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold text-gray-900">📅 Agendado</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Disparo em data e hora específicas
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipo: 'follow_up' }))}
                disabled={isLoading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.tipo === 'follow_up'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold text-gray-900">🔄 Follow-up</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Baseado no tempo sem contato
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="disparo-imagem" className="block text-sm font-medium text-gray-700 mb-1">Imagem (opcional)</label>
              <input id="disparo-imagem" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imagem')} disabled={isLoading} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800" />
              {previewUrl && (
                <div className="mt-2">
                  <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="disparo-video" className="block text-sm font-medium text-gray-700 mb-1">Vídeo (opcional)</label>
              <input id="disparo-video" type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} disabled={isLoading} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800" />
              {videoPreviewUrl && (
                <div className="mt-2">
                  <video controls className="w-full h-32 object-cover rounded-lg">
                    <source src={videoPreviewUrl} />
                    <track kind="captions" srcLang="pt" label="Português" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              {formData.tipo === 'agendado' ? 'Filtrar por Status' : 'Status para Follow-up'}
            </p>
            {formData.tipo === 'agendado' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {statusOptions.filter(s => s.isActive).map(status => (
                  <label key={status.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={formData.filtroStatusIds.includes(status.id)} 
                      onChange={() => handleStatusChange(status.id)} 
                      disabled={isLoading} 
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-800" 
                    />
                    <span className="text-sm capitalize">{status.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div>
                <select
                  id="follow-up-status"
                  value={formData.followUpStatusId}
                  onChange={(e) => setFormData(prev => ({ ...prev, followUpStatusId: e.target.value }))}
                  required={formData.tipo === 'follow_up'}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 bg-white"
                >
                  <option value="">Selecione o status...</option>
                  {statusOptions.filter(s => s.isActive).map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Leads com este status que não tiveram contato há X dias receberão a mensagem
                </p>
              </div>
            )}
          </div>

          {/* Campo de dias para follow-up */}
          {formData.tipo === 'follow_up' && (
            <div>
              <label htmlFor="follow-up-days" className="block text-sm font-medium text-gray-700 mb-1">
                Dias sem contato
              </label>
              <input
                id="follow-up-days"
                type="number"
                min="1"
                max="365"
                value={formData.followUpDays}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpDays: Number.parseInt(e.target.value) || 7 }))}
                required={formData.tipo === 'follow_up'}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leads que não tiveram contato há {formData.followUpDays} dias ou mais receberão a mensagem
              </p>
            </div>
          )}

          {user?.role === 'IMOBILIARIA' && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label htmlFor="disparo-all-leads" className="flex items-center space-x-3 cursor-pointer">
                <input 
                  id="disparo-all-leads"
                  type="checkbox" 
                  checked={formData.allLeads} 
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    allLeads: e.target.checked,
                    filtroStatusIds: e.target.checked ? [] : prev.filtroStatusIds
                  }))} 
                  disabled={isLoading} 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5" 
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Enviar para todos os leads da imobiliária</span>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {formData.tipo === 'agendado' 
                      ? 'Ao ativar esta opção, o disparo será enviado para todos os leads cadastrados, que corresponderem aos status selecionados'
                      : 'Ao ativar esta opção, o disparo será enviado para todos os leads do status selecionado que não tiveram contato no período especificado'}
                  </p>
                </div>
              </label>
            </div>
          )}
          
          {formData.tipo === 'agendado' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="disparo-data" className="block text-sm font-medium text-gray-700 mb-1">Data do Agendamento</label>
                <input 
                  id="disparo-data" 
                  type="date" 
                  value={formData.dataAgendamento} 
                  onChange={(e) => setFormData(prev => ({ ...prev, dataAgendamento: e.target.value }))} 
                  required={formData.tipo === 'agendado'} 
                  disabled={isLoading} 
                  min={new Date().toISOString().split('T')[0]} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800" 
                />
              </div>
              <div>
                <label htmlFor="disparo-hora" className="block text-sm font-medium text-gray-700 mb-1">Hora do Agendamento</label>
                <input 
                  id="disparo-hora" 
                  type="time" 
                  value={formData.horaAgendamento} 
                  onChange={(e) => setFormData(prev => ({ ...prev, horaAgendamento: e.target.value }))} 
                  required={formData.tipo === 'agendado'} 
                  disabled={isLoading} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800" 
                />
              </div>
            </div>
          )}
          <div className="flex space-x-3 pt-4">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {(() => {
                if (isLoading) {
                  return formData.tipo === 'agendado' ? 'Agendando...' : 'Criando Follow-up...';
                }
                return formData.tipo === 'agendado' ? 'Agendar Disparo' : 'Criar Follow-up';
              })()}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading} 
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DisparoMassaModal;
