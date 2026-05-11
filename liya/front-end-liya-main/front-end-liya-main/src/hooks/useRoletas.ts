import { useState, useEffect, useCallback } from "react";
import { roletaService } from "../services/roletas";
import { Roleta, CreateRoleta, UpdateRoleta } from "../types";
import { useToast } from "./useToast";

export const useRoletas = () => {
    const [roletas, setRoletas] = useState<Roleta[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { error: showError, success: showSuccess } = useToast();

    // Buscar todas as roletas
    const fetchRoletas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await roletaService.list();
            setRoletas(data);
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message || "Erro ao carregar roletas";
            setError(errorMessage);
            showError("Erro", errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [showError]);

    // Criar nova roleta
    const createRoleta = async (data: CreateRoleta): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const newRoleta = await roletaService.create(data);
            setRoletas((prev) => [...prev, newRoleta]);
            showSuccess("Sucesso", "Roleta criada com sucesso!");
            return true;
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message || "Erro ao criar roleta";
            setError(errorMessage);
            showError("Erro", errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Atualizar roleta
    const updateRoleta = async (
        id: string,
        data: UpdateRoleta,
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedRoleta = await roletaService.update(id, data);
            setRoletas((prev) =>
                prev.map((roleta) =>
                    roleta.id === id ? updatedRoleta : roleta,
                ),
            );
            showSuccess("Sucesso", "Roleta atualizada com sucesso!");
            return true;
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message || "Erro ao atualizar roleta";
            setError(errorMessage);
            showError("Erro", errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Excluir roleta
    const deleteRoleta = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            await roletaService.delete(id);
            setRoletas((prev) => prev.filter((roleta) => roleta.id !== id));
            showSuccess("Sucesso", "Roleta excluída com sucesso!");
            return true;
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message || "Erro ao excluir roleta";
            setError(errorMessage);
            showError("Erro", errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Carregar roletas ao montar o componente
    useEffect(() => {
        fetchRoletas();
    }, [fetchRoletas]);

    return {
        roletas,
        isLoading,
        error,
        fetchRoletas,
        createRoleta,
        updateRoleta,
        deleteRoleta,
    };
};
