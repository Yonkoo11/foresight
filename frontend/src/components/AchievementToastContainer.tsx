import { useAchievementToast } from '../contexts/AchievementToastContext';
import AchievementToast from './AchievementToast';

const AchievementToastContainer = () => {
  const { toasts, removeToast } = useAchievementToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map((toast) => (
          <AchievementToast
            key={toast.id}
            achievement={toast.achievement}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementToastContainer;
