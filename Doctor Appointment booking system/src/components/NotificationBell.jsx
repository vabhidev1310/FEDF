import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, Clock } from "lucide-react";
import { getNotifications, markAsRead, clearAllNotifications } from "../services/notificationService";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Get current logged-in user id
  const getUserId = () => {
    const patientStr = localStorage.getItem("medbook_current_patient");
    if (patientStr) return JSON.parse(patientStr).id;
    
    const doctorStr = localStorage.getItem("medbook_current_doctor");
    if (doctorStr) return JSON.parse(doctorStr).id;
    
    return null;
  };

  const userId = getUserId();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const loadNotifications = () => {
    const activeUserId = getUserId();
    if (activeUserId) {
      setNotifications(getNotifications(activeUserId));
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Listen to custom notification updates
    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("medbook_notifications_updated", handleUpdate);
    
    // Also poll/listen to storage changes or periodic checks
    const interval = setInterval(loadNotifications, 3000);

    return () => {
      window.removeEventListener("medbook_notifications_updated", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!userId) return null;

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    clearAllNotifications(userId);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " - " + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef} id="navbar-notification-bell">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-indigo-100 hover:text-white hover:bg-teal-600 focus:outline-none rounded-full transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700 hover:text-indigo-600 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-rose-500 rounded-full min-w-4 h-4 transform translate-x-1 -translate-y-1 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all duration-200">
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white flex justify-between items-center">
            <h3 className="font-semibold text-sm tracking-wide">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-indigo-150 hover:text-white flex items-center gap-1 cursor-pointer font-medium hover:underline transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="py-8 px-4 text-center text-gray-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-500" />
                No notification alerts yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={(e) => handleMarkAsRead(notif.id, e)}
                  className={`p-4 transition-all hover:bg-slate-50 relative flex gap-3 cursor-pointer ${
                    !notif.isRead ? "bg-indigo-50/40 border-l-4 border-indigo-500" : ""
                  }`}
                >
                  <div className="flex-1">
                    <p className={`text-xs text-gray-700 leading-relaxed ${!notif.isRead ? "font-medium text-gray-900" : ""}`}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{formatTime(notif.timestamp)}</span>
                    </div>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      title="Mark as read"
                      className="text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100/50 p-1 rounded transition-colors self-start"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="px-4 py-2 bg-slate-50 border-t border-gray-100 text-center text-[11px] text-gray-400">
            MedBook Real-time Care Alerts
          </div>
        </div>
      )}
    </div>
  );
}
