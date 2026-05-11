import axios from "axios";

// Detecta se a URL da API foi configurada (para ativar/desativar integrações)
export const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
export const isApiEnabled = Boolean(API_BASE_URL);

// Callback para logout quando token expira
let onTokenExpired: (() => void) | null = null;

export const setTokenExpiredCallback = (callback: () => void) => {
    onTokenExpired = callback;
};

export const api = axios.create({
    baseURL: API_BASE_URL || "",
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Garantir JSON por padrão
    config.headers = config.headers || {};
    if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401) {
            // Token inválido/expirado
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Chama callback se definido
            if (onTokenExpired) {
                onTokenExpired();
            }
        }
        return Promise.reject(error);
    },
);

export type ApiError = { message: string; status?: number };

export const getErrorMessage = (err: unknown): ApiError => {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        let message = err.response?.data?.error || err.message || "Erro de comunicação com o servidor";
        const data = err.response?.data as unknown;
        if (typeof data === "object" && data !== null && "message" in data) {
            const m = (data as Record<string, unknown>).message;
            if (typeof m === "string") message = m;
        }
        return { message, status };
    }
    return { message: "Erro inesperado" };
};
