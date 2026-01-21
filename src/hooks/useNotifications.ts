import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  content_brief_id: string;
  title: string;
  message: string;
  scheduled_for: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications from localStorage (until we set up database table)
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem(`notifications_${user.id}`);
        if (stored) {
          const parsedNotifications = JSON.parse(stored);
          setNotifications(parsedNotifications);
          const unread = parsedNotifications.filter((n: Notification) => !n.is_read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();

    // Check for due notifications every minute
    const interval = setInterval(() => {
      checkDueNotifications();
    }, 60000);

    // Check immediately
    checkDueNotifications();

    return () => clearInterval(interval);
  }, [user?.id]);

  const checkDueNotifications = async () => {
    if (!user?.id) return;

    try {
      const stored = localStorage.getItem(`notifications_${user.id}`);
      if (!stored) return;

      const notifications: Notification[] = JSON.parse(stored);
      const now = new Date();

      notifications.forEach((notification) => {
        const scheduledDate = new Date(notification.scheduled_for);
        if (scheduledDate <= now && !notification.is_read) {
          // Show toast notification
          toast.info(notification.title, {
            description: notification.message,
            duration: 5000,
          });
        }
      });
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const createNotification = (
    contentBriefId: string,
    title: string,
    message: string,
    scheduledFor: Date
  ) => {
    if (!user?.id) return;

    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      user_id: user.id,
      content_brief_id: contentBriefId,
      title,
      message,
      scheduled_for: scheduledFor.toISOString(),
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const updated = [...notifications, newNotification];
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.is_read).length);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));

    toast.success('Notification scheduled!');
  };

  const markAsRead = (notificationId: string) => {
    if (!user?.id) return;

    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, is_read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.is_read).length);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    if (!user?.id) return;

    const updated = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
  };

  const deleteNotification = (notificationId: string) => {
    if (!user?.id) return;

    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.is_read).length);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
