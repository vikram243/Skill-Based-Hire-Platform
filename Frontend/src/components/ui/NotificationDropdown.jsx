import React, { useState, useEffect, useCallback } from "react";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import api from "../../lib/axiosSetup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notifications?limit=8");
      const list = res.data?.data?.notifications || [];
      const unread = res.data?.data?.unreadCount || 0;
      setNotifications(list);
      setUnreadCount(unread);
    } catch (err) {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/api/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to update notifications");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification removed");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative h-10 w-10 rounded-full hover:bg-secondary transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-foreground/80" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-foreground">Notifications</h4>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
              {loading && notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-10 px-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                    <Bell className="w-5 h-5 opacity-60" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No notifications</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    We'll let you know when bookings, messages, or updates arrive.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => {
                      if (!n.isRead) handleMarkAsRead(n._id, { stopPropagation: () => {} });
                      if (n.type === "order" || n.meta?.orderId) navigate("/orders");
                      else if (n.type === "chat") navigate("/chat");
                      setIsOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3.5 hover:bg-muted/40 transition-colors cursor-pointer ${
                      !n.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      !n.isRead ? "bg-primary" : "bg-transparent"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {new Date(n.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(n._id, e)}
                          title="Mark read"
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(n._id, e)}
                        title="Delete"
                        className="p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2 border-t border-border bg-secondary/10 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/orders");
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground justify-center h-8"
              >
                View Activity & Bookings
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
