import { useEffect, useRef, useState } from "react";
import { Lead } from "../types";
import { leadsService } from "../services/leads";
import { isApiEnabled, getErrorMessage } from "../services/api";

type ListParams = Partial<{
    statusId: string;
    assignedTo: string;
    source: string;
    page: number;
    limit: number;
    tenantId: string;
    viewType: "kanban" | "list";
}>;

export const useLeads = (callbacks?: {
    onError?: (message: string, isTokenExpired?: boolean) => void;
    onSuccess?: (message: string) => void;
    onTokenExpired?: () => void;
}) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [counters, setCounters] = useState<Record<string, number>>({});
    const [pages, setPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const lastParamsRef = useRef<ListParams>({});

    useEffect(() => {
        const load = async () => {
            if (!isApiEnabled) {
                setLeads([]);
                return;
            }
            setIsLoading(true);
            try {
                const res = await leadsService.list(lastParamsRef.current);
                setLeads(res.items);
                setCounters(res.counters || {});
                setTotal(res.total);
                setPages(res.pages);
                setCurrentPage(res.currentPage);
            } catch (err) {
                const apiError = getErrorMessage(err);
                if (apiError.status === 401) {
                    callbacks?.onError?.(
                        "Sua sessão expirou. Redirecionando para o login...",
                        true,
                    );
                    callbacks?.onTokenExpired?.();
                } else {
                    callbacks?.onError?.(
                        `Erro ao carregar leads: ${apiError.message}`,
                    );
                }
                setLeads([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const loadLeads = async (params?: ListParams) => {
        if (!isApiEnabled) {
            setLeads([]);
            return;
        }
        setIsLoading(true);
        try {
            if (params) lastParamsRef.current = params;
            const res = await leadsService.list(lastParamsRef.current);
            setLeads(res.items);
            setCounters(res.counters || {});
            setTotal(res.total);
            setPages(res.pages);
            setCurrentPage(res.currentPage);
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                callbacks?.onError?.(
                    "Sua sessão expirou. Redirecionando para o login...",
                    true,
                );
                callbacks?.onTokenExpired?.();
            } else {
                callbacks?.onError?.(
                    `Erro ao carregar leads: ${apiError.message}`,
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const reload = async () => loadLeads();

    const createLead = async (
        leadData: Omit<Lead, "id" | "dataContato">,
    ): Promise<Lead | null> => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return null;
            const createdLead = await leadsService.create(leadData);
            await reload();
            callbacks?.onSuccess?.("Lead criado com sucesso");
            return createdLead;
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                callbacks?.onError?.(
                    "Sua sessão expirou. Redirecionando para o login...",
                    true,
                );
                callbacks?.onTokenExpired?.();
            } else {
                callbacks?.onError?.(`Erro ao criar lead: ${apiError.message}`);
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateLead = async (
        id: string,
        leadData: Partial<Lead>,
    ): Promise<Lead | null> => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return null;
            const updatedLead = await leadsService.update(id, leadData);
            await reload();
            callbacks?.onSuccess?.("Lead atualizado com sucesso");
            return updatedLead;
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                callbacks?.onError?.(
                    "Sua sessão expirou. Redirecionando para o login...",
                    true,
                );
                callbacks?.onTokenExpired?.();
            } else {
                callbacks?.onError?.(
                    `Erro ao atualizar lead: ${apiError.message}`,
                );
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const getLeadDetails = async (id: string): Promise<Lead | null> => {
        try {
            if (!isApiEnabled) return null;
            return await leadsService.getDetails(id);
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                callbacks?.onError?.(
                    "Sua sessão expirou. Redirecionando para o login...",
                    true,
                );
                callbacks?.onTokenExpired?.();
            } else {
                callbacks?.onError?.(
                    `Erro ao carregar detalhes do lead: ${apiError.message}`,
                );
            }
            return null;
        }
    };

    const assignCadenciaToLead = async (
        id: string,
        cadenciaId: string,
    ): Promise<Lead | null> => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return null;
            const updatedLead = await leadsService.assignCadencia(
                id,
                cadenciaId,
            );
            await reload();
            callbacks?.onSuccess?.("Cadência atribuída com sucesso");
            return updatedLead;
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                callbacks?.onError?.(
                    "Sua sessão expirou. Redirecionando para o login...",
                    true,
                );
                callbacks?.onTokenExpired?.();
            } else {
                callbacks?.onError?.(
                    `Erro ao atribuir cadência: ${apiError.message}`,
                );
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateLeadTentativa = async (
        id: string,
        tentativaId: string,
    ): Promise<Lead | null> => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return null;
            const updatedLead = await leadsService.updateTentativa(
                id,
                tentativaId,
            );
            await reload();
            callbacks?.onSuccess?.("Tentativa do lead atualizada com sucesso");
            return updatedLead;
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                callbacks?.onError?.(
                    "Sua sessão expirou. Redirecionando para o login...",
                    true,
                );
                callbacks?.onTokenExpired?.();
            } else {
                callbacks?.onError?.(
                    `Erro ao atualizar tentativa do lead: ${apiError.message}`,
                );
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteLead = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return false;
            await leadsService.remove(id);
            await reload();
            callbacks?.onSuccess?.("Lead excluído com sucesso");
            return true;
        } catch (err) {
            const apiError = getErrorMessage(err);
            if (apiError.status === 401) {
                callbacks?.onError?.(
                    "Sua sessão expirou. Redirecionando para o login...",
                    true,
                );
                callbacks?.onTokenExpired?.();
            } else {
                callbacks?.onError?.(
                    `Erro ao excluir lead: ${apiError.message}`,
                );
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const sendWhatsApp = (
        telefone: string,
        nome: string,
        primeiraMensagem?: string,
    ) => {
        const defaultMessage = `Olá ${nome}, tudo bem? Sou da equipe de vendas e gostaria de conversar sobre seu interesse em imóveis.`;
        const messageTemplate = primeiraMensagem || defaultMessage;
        // Substitui {nome} pelo nome do lead se existir no template
        const personalizedMessage = messageTemplate.replaceAll("{nome}", nome);
        // Garante que quebras de linha sejam tratadas corretamente
        const formattedMessage = personalizedMessage.replaceAll(
            String.raw`\n`,
            "\n",
        );
        const message = encodeURIComponent(formattedMessage);
        const whatsappUrl = `https://wa.me/55${telefone.replaceAll(/\D/g, "")}?text=${message}`;
        window.open(whatsappUrl, "_blank");
    };

    return {
        leads,
        isLoading,
        counters,
        total,
        pages,
        currentPage,
        loadLeads,
        reload,
        createLead,
        updateLead,
        deleteLead,
        sendWhatsApp,
        getLeadDetails,
        assignCadenciaToLead,
        updateLeadTentativa,
    };
};
