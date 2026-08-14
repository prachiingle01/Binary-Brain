import React, { useState } from 'react';
import { Bot, Bell, Activity, Sparkles, Package, ShoppingBag, Sliders, CheckCircle2 } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

interface HeaderProps {
  activeTab: 'catalog' | 'orders' | 'admin';
  setActiveTab: (tab: 'catalog' | 'orders' | 'admin') => void;
  openChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, openChat }) => {
  const { isConnected, notifications, markNotificationRead, clearNotifications } = useSocket();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-cyan shadow-lg shadow-brand-500/25">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                BINARY<span className="text-brand-cyan">BRAIN</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-700/50 rounded-full uppercase">
                AI AGENTIC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Autonomous E-Commerce Assistant & Live Order Hub
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 p-1 bg-dark-800/90 border border-slate-700/50 rounded-xl">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'catalog'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Product Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Status Simulator</span>
          </button>
        </nav>

        {/* Right Section: Connection Status, Notifications, Chat Launch */}
        <div className="flex items-center space-x-3">
          
          {/* Socket Indicator */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs font-medium">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300 hidden sm:inline">
              {isConnected ? 'WebSocket Connected' : 'Connecting...'}
            </span>
          </div>

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-dark-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700/60">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-brand-cyan" />
                    <span className="font-semibold text-xs text-white">Live Event Alerts</span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications yet. Change an order status in the simulator to see live push alerts!
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3.5 transition-colors cursor-pointer ${
                          notif.read ? 'bg-transparent text-slate-400' : 'bg-brand-500/10 text-white font-medium'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-white">{notif.title}</p>
                            <p className="text-xs text-slate-300 mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">{notif.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Trigger Chat Drawer Button */}
          <button
            onClick={openChat}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-500/25 hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI Assistant</span>
          </button>
        </div>
      </div>
    </header>
  );
};
