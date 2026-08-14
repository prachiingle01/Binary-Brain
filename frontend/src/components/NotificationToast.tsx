import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { NotificationItem } from '../types';

export const NotificationToast: React.FC = () => {
  const { notifications } = useSocket();
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      setActiveToast(latest);
      const timer = setTimeout(() => setActiveToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!activeToast) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="glass-panel p-4 rounded-2xl shadow-2xl border border-emerald-500/40 bg-slate-900/95 max-w-sm flex items-start space-x-3 glow-cyan">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-bold text-xs text-white">{activeToast.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5">{activeToast.message}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">{activeToast.timestamp}</span>
        </div>
        <button
          onClick={() => setActiveToast(null)}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
