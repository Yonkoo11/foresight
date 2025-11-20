/**
 * Notification System Component
 * Real-time toasts for earnings, achievements, and events
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRealtime, type RealtimeEvent } from '../contexts/RealtimeContext';

type NotificationType = 'earnings' | 'achievement' | 'referral' | 'streak' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  amount?: string;
  icon?: string;
  timestamp: Date;
}

// Convert RealtimeEvent to Notification (only for user's own events)
function convertToNotification(event: RealtimeEvent, _userAddress?: string): Notification | null {
  // For now, show all notifications (in production, filter by user)
  // Randomly decide if this event triggers a notification (50% chance for demo)
  if (Math.random() > 0.5) return null;

  let notification: Notification = {
    id: event.id,
    type: 'info',
    title: '',
    message: '',
    icon: '',
    timestamp: event.timestamp,
  };

  switch (event.type) {
    case 'win':
      notification.type = 'earnings';
      notification.title = 'Payment Received';
      notification.message = event.data.description || 'You won!';
      notification.amount = event.data.amount ? `${event.data.amount} ETH` : undefined;
      notification.icon = '💰';
      break;
    case 'achievement':
      notification.type = 'achievement';
      notification.title = 'Achievement Unlocked';
      notification.message = event.data.description || event.data.achievement || 'New achievement!';
      notification.icon = '🏆';
      break;
    case 'streak':
      notification.type = 'streak';
      notification.title = 'Streak Bonus';
      notification.message = event.data.description || 'Streak milestone reached!';
      notification.icon = '🔥';
      break;
    case 'referral':
      notification.type = 'referral';
      notification.title = 'Referral Earnings';
      notification.message = event.data.description || 'Your referral earned you commission!';
      notification.amount = event.data.amount ? `${event.data.amount} ETH` : undefined;
      notification.icon = '📢';
      break;
    case 'quest_completed':
      notification.type = 'achievement';
      notification.title = 'Quest Complete!';
      notification.message = event.data.description || 'You completed a quest!';
      notification.amount = event.data.amount ? event.data.amount.toString() : undefined;
      notification.icon = '🎯';
      break;
    default:
      return null;
  }

  return notification;
}

export function NotificationSystem() {
  const { address } = useAccount();
  const { subscribe, isConnected } = useRealtime();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Subscribe to real-time events
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe((event) => {
      const notification = convertToNotification(event, address);
      if (!notification) return;

      // Add notification
      setNotifications((prev) => [notification, ...prev].slice(0, 3)); // Keep max 3

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 5000);
    });

    return unsubscribe;
  }, [subscribe, isConnected, address]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'earnings':
        return 'from-green-500 to-emerald-500';
      case 'achievement':
        return 'from-purple-500 to-pink-500';
      case 'referral':
        return 'from-yellow-500 to-orange-500';
      case 'streak':
        return 'from-orange-500 to-red-500';
      case 'info':
        return 'from-cyan-500 to-blue-500';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="animate-slide-in-right bg-gray-900/95 border border-gray-700 rounded-xl shadow-2xl backdrop-blur-sm max-w-sm"
        >
          {/* Colored Top Border */}
          <div className={`h-1 w-full bg-gradient-to-r ${getNotificationColor(notification.type)} rounded-t-xl`} />

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              {notification.icon && (
                <div className="text-3xl flex-shrink-0">{notification.icon}</div>
              )}

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white text-sm">{notification.title}</h4>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <p className="text-sm text-gray-300 mb-2">{notification.message}</p>

                {/* Amount (for earnings) */}
                {notification.amount && (
                  <div className={`text-lg font-bold bg-gradient-to-r ${getNotificationColor(notification.type)} bg-clip-text text-transparent`}>
                    + {notification.amount}
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-xs text-gray-500 mt-1">
                  Just now
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Notification Hook
 * Use this hook to trigger notifications from anywhere in the app
 */
export function useNotifications() {
  const showEarningsNotification = (amount: string, source: string) => {
    // In production, this would dispatch to a global notification state/context
    console.log('Earnings notification:', amount, source);
  };

  const showAchievementNotification = (title: string, reward: string) => {
    console.log('Achievement unlocked:', title, reward);
  };

  const showReferralNotification = (referralName: string, amount: string) => {
    console.log('Referral earnings:', referralName, amount);
  };

  const showStreakNotification = (days: number, bonus: string) => {
    console.log('Streak bonus:', days, bonus);
  };

  return {
    showEarningsNotification,
    showAchievementNotification,
    showReferralNotification,
    showStreakNotification,
  };
}
