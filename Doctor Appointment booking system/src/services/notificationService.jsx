const NOTIFICATIONS_KEY = "medbook_notifications";

export const getNotifications = (userId) => {
  const localNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
  const notifications = localNotifications ? JSON.parse(localNotifications) : [];
  if (!userId) return notifications;
  return notifications.filter((notif) => notif.userId === userId);
};

export const addNotification = (userId, message) => {
  if (!userId) return null;
  const localNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
  const notifications = localNotifications ? JSON.parse(localNotifications) : [];
  
  const newNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    message,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  notifications.unshift(newNotification); // put on top
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  
  // Dispatch dynamic event so UI can instantly update its bell status
  window.dispatchEvent(new Event("medbook_notifications_updated"));
  
  return newNotification;
};

export const markAsRead = (notificationId) => {
  const localNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!localNotifications) return false;
  
  const notifications = JSON.parse(localNotifications);
  const updated = notifications.map((notif) => {
    if (notif.id === notificationId) {
      return { ...notif, isRead: true };
    }
    return notif;
  });
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("medbook_notifications_updated"));
  return true;
};

export const clearAllNotifications = (userId) => {
  const localNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!localNotifications) return false;
  
  const notifications = JSON.parse(localNotifications);
  const remaining = notifications.filter((notif) => notif.userId !== userId);
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(remaining));
  window.dispatchEvent(new Event("medbook_notifications_updated"));
  return true;
};
