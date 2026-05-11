import React, { useState, useEffect } from 'react';
import { X, Save, Image, Video, Trash2 } from 'lucide-react';
import Modal from './Modal';
import { useMensagens } from '../hooks/useMensagens';
import { useStatus } from '../hooks/useStatus';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import type { MensagemPronta, CreateMensagemPronta } from '../types';

interface MensagemProntaModalProps {
  mensagem?: MensagemPronta | null;
  onClose: () => void;
  onSuccess: () => void;
}

const MensagemProntaModal: React.FC<MensagemProntaModalProps> = ({
  mensagem,
  onClose,
  onSuccess
}) => {
  const { logout } = useAuth();
  const toast = useToast();
  const { createMensagem, updateMensagem } = useMensagens();
  const { status } = useStatus({
    onError: (message, isTokenExpired) => {
      if (isTokenExpired) {
        toast.error('Token Expirado', message);
        setTimeout(() => logout(), 2000);
      }
    },
    onSuccess: () => {},
    onTokenExpired: () => {
      setTimeout(() => logout(), 2000);
    }
  });

  const [formData, setFormData] = useState<CreateMensagemPronta>({
    titulo: '',
    conteudo: '',
    statusId: undefined,
    isActive: true
  });

  const [errors, setErrors] = useState<{
    titulo?: string;
    conteudo?: string;
  }>({});

  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [removeImage, setRemoveImage] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);

  useEffect(() => {
    if (mensagem) {
      setFormData({
        titulo: mensagem.titulo,
        conteudo: mensagem.conteudo,
        statusId: mensagem.statusId || undefined,
        isActive: mensagem.isActive
      });
      // Carregar previews de m\u00eddia existente
      if (mensagem.imageUrl) {
        setImagePreviewUrl(mensagem.imageUrl);
      } else {
        setImagePreviewUrl('');
      }
      if (mensagem.videoUrl) {
        setVideoPreviewUrl(mensagem.videoUrl);
      } else {
        setVideoPreviewUrl('');
      }
      // Resetar flags de remoção e arquivos
      setImageFile(null);
      setVideoFile(null);
      setRemoveImage(false);
      setRemoveVideo(false);
    } else {
      // Limpar tudo para novo cadastro
      setFormData({
        titulo: '',
        conteudo: '',
        statusId: undefined,
        isActive: true
      });
      setImagePreviewUrl('');
      setVideoPreviewUrl('');
      setImageFile(null);
      setVideoFile(null);
      setRemoveImage(false);
      setRemoveVideo(false);
      setErrors({});
    }
  }, [mensagem]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    } else if (formData.titulo.length > 255) {
      newErrors.titulo = 'Título deve ter no máximo 255 caracteres';
    }

    if (!formData.conteudo.trim()) {
      newErrors.conteudo = 'Conteúdo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image') {
        setImageFile(file);
        setRemoveImage(false);
        const url = URL.createObjectURL(file);
        setImagePreviewUrl(url);
      } else {
        setVideoFile(file);
        setRemoveVideo(false);
        const url = URL.createObjectURL(file);
        setVideoPreviewUrl(url);
      }
    }
  };

  const handleRemoveMedia = (type: 'image' | 'video') => {
    if (type === 'image') {
      setImageFile(null);
      setImagePreviewUrl('');
      setRemoveImage(true);
    } else {
      setVideoFile(null);
      setVideoPreviewUrl('');
      setRemoveVideo(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Preparar dados para envio
      const dataToSubmit: CreateMensagemPronta = {
        titulo: formData.titulo.trim(),
        conteudo: formData.conteudo.trim(),
        statusId: formData.statusId || undefined,
        isActive: formData.isActive,
        imagem: imageFile || undefined,
        video: videoFile || undefined
      };

      let success = false;

      if (mensagem) {
        // Atualizar mensagem existente
        const updateData: any = {
          titulo: dataToSubmit.titulo,
          conteudo: dataToSubmit.conteudo,
          statusId: dataToSubmit.statusId,
          isActive: dataToSubmit.isActive
        };
        
        if (imageFile) {
          updateData.imagem = imageFile;
        } else if (removeImage) {
          updateData.imagem = null;
        }
        
        if (videoFile) {
          updateData.video = videoFile;
        } else if (removeVideo) {
          updateData.video = null;
        }
        
        const result = await updateMensagem(mensagem.id, updateData);
        success = result !== null;
      } else {
        // Criar nova mensagem
        const result = await createMensagem(dataToSubmit);
        success = result !== null;
      }

      if (success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    field: keyof CreateMensagemPronta,
    value: string | boolean | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo ao editar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
    >
      <div className="px-6 pb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {mensagem ? 'Editar Mensagem Pronta' : 'Nova Mensagem Pronta'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            id="titulo"
            type="text"
            value={formData.titulo}
            onChange={(e) => handleChange('titulo', e.target.value)}
            maxLength={255}
            placeholder="Ex: Mensagem de Boas-vindas"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.titulo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.titulo && (
            <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.titulo.length}/255 caracteres
          </p>
        </div>

        {/* Conteúdo */}
        <div>
          <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-2">
            Conteúdo *
          </label>
          <textarea
            id="conteudo"
            value={formData.conteudo}
            onChange={(e) => handleChange('conteudo', e.target.value)}
            rows={6}
            placeholder="Digite o conteúdo da mensagem pronta..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.conteudo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.conteudo && (
            <p className="mt-1 text-sm text-red-600">{errors.conteudo}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.conteudo.length} caracteres
          </p>
        </div>

        {/* Imagem e Vídeo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Imagem */}
          <div>
            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="inline h-4 w-4 mr-1" />
              Imagem (opcional)
            </label>
            <input
              id="imagem"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'image')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {imagePreviewUrl && (
              <div className="mt-2 relative">
                <img 
                  src={imagePreviewUrl} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia('image')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remover imagem"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Vídeo */}
          <div>
            <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
              <Video className="inline h-4 w-4 mr-1" />
              Vídeo (opcional)
            </label>
            <input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {videoPreviewUrl && (
              <div className="mt-2 relative">
                <video 
                  controls 
                  className="w-full h-32 object-cover rounded-lg"
                >
                  <source src={videoPreviewUrl} />
                  <track kind="captions" srcLang="pt" label="Português" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
                <button
                  type="button"
                  onClick={() => handleRemoveMedia('video')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remover vídeo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status (Opcional) */}
        <div>
          <label htmlFor="statusId" className="block text-sm font-medium text-gray-700 mb-2">
            Vincular a Status (Opcional)
          </label>
          <select
            id="statusId"
            value={formData.statusId || ''}
            onChange={(e) => handleChange('statusId', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sem vínculo com status</option>
            {status
              .filter(s => s.isActive)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Mensagens vinculadas aparecem automaticamente ao selecionar o status
          </p>
        </div>

        {/* Status Ativo/Inativo */}
        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Mensagem ativa
          </label>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {mensagem ? 'Atualizar' : 'Criar'}
              </>
            )}
          </button>
        </div>

        {/* Nota sobre campos obrigatórios */}
        <p className="text-xs text-gray-500 text-center">
          * Campos obrigatórios
        </p>
      </form>
      </div>
    </Modal>
  );
};

export default MensagemProntaModal;
