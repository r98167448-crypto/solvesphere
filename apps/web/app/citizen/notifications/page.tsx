'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch, getCurrentUser } from '@/lib/api';
import { Bell, Check } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
        <span className="text-xs text-slate-500 font-medium">{notifications.length} alerts</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-sm">
          No notifications yet. You'll be alerted when your challenges get verified or projects advance!
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition ${
                n.read_status ? 'bg-white border-slate-200' : 'bg-emerald-50/60 border-emerald-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${
                  n.read_status ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{n.message}</p>
                  <span className="text-[11px] text-slate-400">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.read_status && (
                <button
                  onClick={() => markAsRead(n.id)}
                  title="Mark as read"
                  className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
