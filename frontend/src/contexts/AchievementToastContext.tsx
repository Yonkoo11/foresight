import { createContext, useContext, useState, ReactNode } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward?: number;
}

interface Toast {
  id: string;
  achievement: Achievement;
}

interface AchievementToastContextType {
  showAchievementToast: (achievement: Achievement) => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const AchievementToastContext = createContext<AchievementToastContextType | undefined>(undefined);

export const AchievementToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showAchievementToast = (achievement: Achievement) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, achievement };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <AchievementToastContext.Provider value={{ showAchievementToast, toasts, removeToast }}>
      {children}
    </AchievementToastContext.Provider>
  );
};

export const useAchievementToast = () => {
  const context = useContext(AchievementToastContext);
  if (!context) {
    throw new Error('useAchievementToast must be used within AchievementToastProvider');
  }
  return context;
};
