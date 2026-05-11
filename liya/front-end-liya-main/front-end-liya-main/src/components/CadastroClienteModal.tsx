import React, { useEffect, useState } from "react";
import {
    Building,
    Phone,
    Save,
    MessageCircle,
    User,
    Mail,
    Lock,
    X,
} from "lucide-react";
import { isApiEnabled, getErrorMessage } from "../services/api";
import { TenantDTO, tenantsService } from "../services/tenants";
import { usersService } from "../services/users";
import { useToast } from "../hooks/useToast";

interface CadastroClienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    tenantToEdit?: TenantDTO | null;
}

const getInitialFormData = () => ({
    nomeImobiliaria: "",
    primeiraMensagem: "",
    segmento: "",
    adminNome: "",
    adminEmail: "",
    adminWhatsapp: "",
    adminInstance: "",
    adminSenha: "",
    adminAtivo: true,
    adminParticipaRoleta: false,
});

const CadastroClienteModal: React.FC<CadastroClienteModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    tenantToEdit,
}) => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(getInitialFormData());
    const [showSuccess, setShowSuccess] = useState(false);
    const isEditMode = Boolean(tenantToEdit);

    useEffect(() => {
        if (!isOpen) {
            setFormData(getInitialFormData());
            setShowSuccess(false);
            return;
        }

        if (tenantToEdit) {
            setFormData({
                nomeImobiliaria: tenantToEdit.name || "",
                primeiraMensagem: tenantToEdit.primeiraMensagem || "",
                segmento: tenantToEdit.admin?.segmento || "",
                adminNome: tenantToEdit.admin?.name || "",
                adminEmail: tenantToEdit.admin?.email || "",
                adminWhatsapp: tenantToEdit.admin?.whatsapp || "",
                adminInstance: tenantToEdit.admin?.instance || "",
                adminSenha: "",
                adminAtivo: tenantToEdit.admin?.isActive ?? true,
                adminParticipaRoleta:
                    tenantToEdit.admin?.participateInRoleta ?? false,
            });
            return;
        }

        setFormData(getInitialFormData());
    }, [isOpen, tenantToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isApiEnabled) {
                if (isEditMode && tenantToEdit) {
                    const hasAdminInput = Boolean(
                        formData.adminNome.trim() ||
                        formData.adminEmail.trim() ||
                        formData.adminWhatsapp.trim() ||
                        formData.segmento.trim() ||
                        formData.adminInstance.trim() ||
                        formData.adminSenha.trim() ||
                        tenantToEdit.admin,
                    );

                    const updatePayload = {
                        tenant: {
                            name: formData.nomeImobiliaria,
                            primeiraMensagem: formData.primeiraMensagem,
                        },
                        ...(hasAdminInput
                            ? {
                                  admin: {
                                      name: formData.adminNome,
                                      email: formData.adminEmail,
                                      whatsapp: formData.adminWhatsapp,
                                      segmento: formData.segmento,
                                      instance: formData.adminInstance,
                                      isActive: formData.adminAtivo,
                                      participateInRoleta:
                                          formData.adminParticipaRoleta,
                                      ...(formData.adminSenha.trim()
                                          ? {
                                                password:
                                                    formData.adminSenha.trim(),
                                            }
                                          : {}),
                                  },
                              }
                            : {}),
                    };

                    await tenantsService.update(tenantToEdit.id, updatePayload);
                } else {
                    // 1) Criar tenant
                    const tenant = await tenantsService.create({
                        name: formData.nomeImobiliaria,
                        isActive: true,
                    });
                    // 2) Criar usuário administrador do tipo IMOBILIARIA vinculado ao tenant
                    await usersService.create({
                        name: formData.adminNome,
                        email: formData.adminEmail,
                        whatsapp: formData.adminWhatsapp,
                        segmento: formData.segmento,
                        instance: formData.adminInstance,
                        role: "IMOBILIARIA",
                        isActive: true,
                        participateInRoleta: false,
                        tenantId: tenant.id,
                        password: formData.adminSenha,
                    });
                }
            } else {
                // fallback local
                await new Promise((resolve) => setTimeout(resolve, 1200));
            }
            setShowSuccess(true);
            toast.success(
                isEditMode
                    ? "Cliente atualizado com sucesso!"
                    : "Cliente cadastrado com sucesso!",
            );
            // Reset do formulário
            setFormData(getInitialFormData());
            setTimeout(() => {
                setShowSuccess(false);
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            const errorData = getErrorMessage(err);
            toast.error("Erro ao cadastrar cliente", errorData.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWhatsAppContact = () => {
        const message = encodeURIComponent(
            `Olá! Gostaria de saber mais sobre como integrar meu cliente ao sistema da Lyia. 
      
Dados da empresa:
- Cliente: ${formData.nomeImobiliaria}
- Segmento: ${formData.segmento}

Administrador:
- Nome: ${formData.adminNome}
- Email: ${formData.adminEmail}
- WhatsApp: ${formData.adminWhatsapp}`,
        );

        // Número fictício para demonstração
        const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
        window.open(whatsappUrl, "_blank");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditMode
                            ? "Editar Cliente"
                            : "Cadastrar Novo Cliente"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    {showSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Save className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-green-800 mb-2">
                                {isEditMode
                                    ? "Atualização Realizada!"
                                    : "Cadastro Realizado!"}
                            </h2>
                            <p className="text-green-600 mb-4">
                                {isEditMode
                                    ? "Os dados do cliente foram atualizados com sucesso."
                                    : "Seu novo cliente foi cadastrado com sucesso."}
                            </p>
                            <p className="text-sm text-gray-600">
                                Em breve entraremos em contato para ativar sua
                                conta.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="nome-imobiliaria"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Nome do Cliente
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        id="nome-imobiliaria"
                                        type="text"
                                        value={formData.nomeImobiliaria}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                nomeImobiliaria: e.target.value,
                                            }))
                                        }
                                        required
                                        disabled={isLoading}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                        placeholder="Digite o nome do cliente"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="primeira-mensagem"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Primeira Mensagem
                                </label>
                                <textarea
                                    id="primeira-mensagem"
                                    value={formData.primeiraMensagem}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            primeiraMensagem: e.target.value,
                                        }))
                                    }
                                    disabled={isLoading}
                                    rows={3}
                                    placeholder="Mensagem inicial de contato"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="segmento"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Segmento
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        id="segmento"
                                        type="text"
                                        value={formData.segmento}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                segmento: e.target.value,
                                            }))
                                        }
                                        required
                                        disabled={isLoading}
                                        placeholder="Digite o segmento"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                    <User className="h-4 w-4 mr-2" /> Dados do
                                    Administrador
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="admin-nome"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Nome
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                id="admin-nome"
                                                type="text"
                                                value={formData.adminNome}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        adminNome:
                                                            e.target.value,
                                                    }))
                                                }
                                                required
                                                disabled={isLoading}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                                placeholder="Nome do administrador"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="admin-email"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                id="admin-email"
                                                type="email"
                                                value={formData.adminEmail}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        adminEmail:
                                                            e.target.value,
                                                    }))
                                                }
                                                required
                                                disabled={isLoading}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                                placeholder="email@exemplo.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="admin-whatsapp"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            WhatsApp
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                id="admin-whatsapp"
                                                type="tel"
                                                value={formData.adminWhatsapp}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        adminWhatsapp:
                                                            e.target.value,
                                                    }))
                                                }
                                                required
                                                disabled={isLoading}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                                placeholder="(11) 99999-9999"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="admin-senha"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Senha
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                id="admin-senha"
                                                type="password"
                                                value={formData.adminSenha}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        adminSenha:
                                                            e.target.value,
                                                    }))
                                                }
                                                required={!isEditMode}
                                                disabled={isLoading}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                                                placeholder={
                                                    isEditMode
                                                        ? "Preencha somente para trocar a senha"
                                                        : "Defina uma senha"
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-black focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Cadastrando...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Save className="h-5 w-5" />
                                            <span>
                                                {isEditMode
                                                    ? "Salvar Alterações"
                                                    : "Cadastrar Cliente"}
                                            </span>
                                        </div>
                                    )}
                                </button>

                                {!isEditMode &&
                                    formData.nomeImobiliaria &&
                                    formData.adminWhatsapp &&
                                    formData.segmento && (
                                        <button
                                            type="button"
                                            onClick={handleWhatsAppContact}
                                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
                                        >
                                            <MessageCircle className="h-5 w-5 mr-2" />
                                            Entrar em Contato via WhatsApp
                                        </button>
                                    )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CadastroClienteModal;
