/**
 * Toast Notifications Component
 * Displays toast notifications from the NotificationContext
 */

import { useNotifications, type NotificationType } from '../contexts/NotificationContext';

export function ToastNotifications() {
  const { notifications, dismiss } = useNotifications();

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'error':
        return 'from-red-500 to-rose-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'info':
        return 'from-cyan-500 to-blue-500';
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
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
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getNotificationColor(notification.type)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {getNotificationIcon(notification.type)}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white text-sm">{notification.title}</h4>
                  <button
                    onClick={() => dismiss(notification.id)}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <p className="text-sm text-gray-300">{notification.message}</p>

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
