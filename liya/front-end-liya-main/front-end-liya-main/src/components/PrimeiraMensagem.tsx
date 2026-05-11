import React, { useState, useEffect } from "react";
import { Save, MessageCircle, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { tenantsService } from "../services/tenants";

const PrimeiraMensagem: React.FC = () => {
    const { user } = useAuth();
    const { success, error } = useToast();
    const [mensagem, setMensagem] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        if (!user?.tenantId) return;

        setIsLoading(true);
        try {
            const config = await tenantsService.getConfig(user.tenantId);
            setMensagem(config.primeiraMensagem || "");
        } catch (err) {
            console.error("Erro ao carregar configuração:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user?.tenantId) {
            error("Erro", "Tenant não identificado");
            return;
        }

        setIsSaving(true);
        try {
            await tenantsService.updateConfig(user.tenantId, {
                primeiraMensagem: mensagem,
            });
            success("Sucesso", "Primeira mensagem salva com sucesso!");
        } catch (err) {
            error("Erro", "Não foi possível salvar a configuração");
            console.error("Erro ao salvar:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                    <MessageCircle className="h-6 w-6 text-gray-700" />
                    <h2 className="text-xl font-semibold text-gray-900">
                        Primeira Mensagem para Lead
                    </h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mensagem de Boas-vindas
                        </label>
                        <p className="text-sm text-gray-500 mb-3">
                            Esta mensagem será enviada automaticamente ao
                            primeiro contato com o lead. Você pode usar emojis,
                            quebras de linha e acentos.
                        </p>
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            placeholder="Olá! 👋&#10;&#10;Bem-vindo à nossa empresa! 🎉&#10;&#10;Estamos aqui para ajudá-lo."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-none font-sans"
                            rows={10}
                            style={{ whiteSpace: "pre-wrap" }}
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            {mensagem.length} caracteres
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Prévia da Mensagem:
                        </h3>
                        <div className="bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap text-sm">
                            {mensagem || (
                                <span className="text-gray-400">
                                    Nenhuma mensagem configurada
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center space-x-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Salvando...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Salvar Configuração</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrimeiraMensagem;
