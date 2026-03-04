/**
 * Toast Notification System
 * Provides app-wide toast notifications for user feedback
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { CheckCircle, WarningCircle, Info, X } from '@phosphor-icons/react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  exiting?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_STYLES = {
  success: {
    accent: 'bg-emerald-500',
    icon: 'text-emerald-400',
    bg: 'bg-[#0C1A14]',
    border: 'border-emerald-500/20',
  },
  error: {
    accent: 'bg-red-500',
    icon: 'text-red-400',
    bg: 'bg-[#1A0C0C]',
    border: 'border-red-500/20',
  },
  info: {
    accent: 'bg-gold-500',
    icon: 'text-gold-400',
    bg: 'bg-[#1A1608]',
    border: 'border-gold-500/20',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Start exit animation after 3.5s, remove after 4s
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    }, 3500);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [mounted, setMounted] = useState(false);
  const style = TOAST_STYLES[toast.type];

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const isVisible = mounted && !toast.exiting;

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div
        className={`relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl border shadow-lg shadow-black/40 overflow-hidden ${style.bg} ${style.border}`}
      >
        {/* Colored left accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${style.accent}`} />

        {/* Icon */}
        <div className={`shrink-0 ${style.icon}`}>
          {toast.type === 'success' && <CheckCircle size={20} weight="fill" />}
          {toast.type === 'error' && <WarningCircle size={20} weight="fill" />}
          {toast.type === 'info' && <Info size={20} weight="fill" />}
        </div>

        {/* Message */}
        <span className="flex-1 text-sm font-medium text-gray-100 leading-snug">{toast.message}</span>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 text-gray-500 hover:text-white rounded-md hover:bg-white/5 transition-colors"
        >
          <X size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    // bottom-20 on mobile to clear bottom nav, bottom-6 on desktop
    // centered on mobile, right-aligned on desktop
    <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 sm:max-w-sm sm:min-w-[320px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}
