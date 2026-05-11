import React, { createContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export { ToastContext };

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  const iconProps = { className: "h-5 w-5" };
  
  switch (type) {
    case 'success':
      return <CheckCircle {...iconProps} className="h-5 w-5 text-green-400" />;
    case 'error':
      return <XCircle {...iconProps} className="h-5 w-5 text-red-400" />;
    case 'warning':
      return <AlertCircle {...iconProps} className="h-5 w-5 text-yellow-400" />;
    case 'info':
      return <Info {...iconProps} className="h-5 w-5 text-blue-400" />;
    default:
      return <Info {...iconProps} className="h-5 w-5 text-gray-400" />;
  }
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  };

  React.useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div className={`w-full ${bgColors[toast.type]} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ToastIcon type={toast.type} />
          </div>
          <div className="ml-3 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${textColors[toast.type]}`}>
              {toast.title}
            </p>
            {toast.message && (
              <p className={`mt-1 text-sm ${textColors[toast.type]} opacity-90`}>
                {toast.message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`${textColors[toast.type]} opacity-70 hover:opacity-100 rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2`}
              onClick={() => onRemove(toast.id)}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const value = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }), [toasts, addToast, removeToast, success, error, warning, info]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="transform transition-all duration-300 ease-in-out animate-slide-in-right"
            >
              <ToastItem toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};
