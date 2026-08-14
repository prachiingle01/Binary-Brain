import React, { useState } from 'react';
import { SocketProvider } from './context/SocketContext';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { OrderTracker } from './components/OrderTracker';
import { AdminSim } from './components/AdminSim';
import { ChatWidget } from './components/ChatWidget';
import { NotificationToast } from './components/NotificationToast';
import { Product } from './types';
import { Bot, Sparkles, ShieldCheck, Zap, GitBranch } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'admin'>('catalog');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAskAIAboutProduct = (product: Product) => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openChat={() => setIsChatOpen(true)}
      />

      {/* Real-time Order Notification Popups */}
      <NotificationToast />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        
        {activeTab === 'catalog' && (
          <ProductCatalog onAskAIAboutProduct={handleAskAIAboutProduct} />
        )}

        {activeTab === 'orders' && (
          <OrderTracker />
        )}

        {activeTab === 'admin' && (
          <AdminSim />
        )}
      </main>

      {/* Floating Chat Widget */}
      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 glass-panel py-8 px-4 lg:px-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-brand-600/30 text-cyan-400 border border-brand-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200">Binary Brain Autonomous Agentic System</p>
              <p className="text-[11px] text-slate-500">Prachi Ingle • Payal Itankar • Bhagyashri Khanke</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> <span>Tool-Calling AI Engine</span></span>
            <span className="flex items-center space-x-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> <span>WebSocket Live Push</span></span>
            <span className="flex items-center space-x-1"><GitBranch className="w-3.5 h-3.5 text-cyan-400" /> <span>Docker Containerized</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
};

export default App;
