import { useEffect, useState } from "react";
import {
    type CadenciaAtendimento,
    type CreateCadenciaAtendimento,
    type CreateTentativaAtendimento,
    type UpdateCadenciaAtendimento,
    type UpdateTentativaAtendimento,
} from "../types";
import { cadenciasService } from "../services/cadencias";
import { getErrorMessage, isApiEnabled } from "../services/api";

export const useCadencias = (callbacks?: {
    onError?: (message: string, isTokenExpired?: boolean) => void;
    onSuccess?: (message: string) => void;
    onTokenExpired?: () => void;
}) => {
    const [cadencias, setCadencias] = useState<CadenciaAtendimento[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadCadencias = async (params?: { ativo?: boolean }) => {
        if (!isApiEnabled) {
            setCadencias([]);
            return [];
        }

        setIsLoading(true);
        try {
            const data = await cadenciasService.list(params);
            setCadencias(data);
            return data;
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
                    `Erro ao carregar cadências: ${apiError.message}`,
                );
            }
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadCadencias();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshCadencias = async () => {
        return loadCadencias();
    };

    const createCadencia = async (
        payload: CreateCadenciaAtendimento,
    ): Promise<CadenciaAtendimento | null> => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return null;
            const cadencia = await cadenciasService.create(payload);
            await refreshCadencias();
            callbacks?.onSuccess?.("Cadência criada com sucesso");
            return cadencia;
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
                    `Erro ao criar cadência: ${apiError.message}`,
                );
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateCadencia = async (
        id: string,
        payload: UpdateCadenciaAtendimento,
    ): Promise<CadenciaAtendimento | null> => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return null;
            const cadencia = await cadenciasService.update(id, payload);
            await refreshCadencias();
            callbacks?.onSuccess?.("Cadência atualizada com sucesso");
            return cadencia;
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
                    `Erro ao atualizar cadência: ${apiError.message}`,
                );
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCadencia = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return false;
            await cadenciasService.remove(id);
            await refreshCadencias();
            callbacks?.onSuccess?.("Cadência excluída com sucesso");
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
                    `Erro ao excluir cadência: ${apiError.message}`,
                );
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const createTentativa = async (
        cadenciaId: string,
        payload: CreateTentativaAtendimento,
    ) => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return null;
            const tentativa = await cadenciasService.createTentativa(
                cadenciaId,
                payload,
            );
            await refreshCadencias();
            callbacks?.onSuccess?.("Tentativa criada com sucesso");
            return tentativa;
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
                    `Erro ao criar tentativa: ${apiError.message}`,
                );
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateTentativa = async (
        cadenciaId: string,
        tentativaId: string,
        payload: UpdateTentativaAtendimento,
    ) => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return null;
            const tentativa = await cadenciasService.updateTentativa(
                cadenciaId,
                tentativaId,
                payload,
            );
            await refreshCadencias();
            callbacks?.onSuccess?.("Tentativa atualizada com sucesso");
            return tentativa;
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
                    `Erro ao atualizar tentativa: ${apiError.message}`,
                );
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTentativa = async (
        cadenciaId: string,
        tentativaId: string,
    ): Promise<boolean> => {
        setIsLoading(true);
        try {
            if (!isApiEnabled) return false;
            await cadenciasService.removeTentativa(cadenciaId, tentativaId);
            await refreshCadencias();
            callbacks?.onSuccess?.("Tentativa excluída com sucesso");
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
                    `Erro ao excluir tentativa: ${apiError.message}`,
                );
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        cadencias,
        isLoading,
        loadCadencias,
        createCadencia,
        updateCadencia,
        deleteCadencia,
        createTentativa,
        updateTentativa,
        deleteTentativa,
    };
};
