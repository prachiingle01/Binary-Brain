import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, Cpu, CheckCircle2, ChevronRight, Package, ShoppingBag, ExternalLink } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { ChatMessage, Product, Order } from '../types';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder?: (orderId: string) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, onSelectOrder }) => {
  const { messages, sendMessage, isTyping, toolExecutionStep } = useSocket();
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, toolExecutionStep]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isMinimized
          ? 'w-72 h-14'
          : 'w-full sm:w-[440px] h-[640px] max-h-[85vh]'
      } glass-panel rounded-3xl shadow-2xl border border-slate-700/80 flex flex-col overflow-hidden glow-indigo`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-dark-800 via-dark-800 to-slate-900 border-b border-slate-700/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-cyan flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white">Binary Brain AI</h3>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-400">Autonomous Assistant Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-500/20'
                      : 'glass-card border border-slate-700/60 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {/* Text Content */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Executed Tools Badge (if any) */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/50 space-y-1">
                      <span className="text-[10px] text-cyan-300 font-semibold uppercase tracking-wider flex items-center space-x-1">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        <span>Backend Tool Invocations</span>
                      </span>
                      {msg.toolCalls.map((tool, idx) => (
                        <div key={idx} className="p-1.5 rounded bg-dark-900/80 text-[10px] font-mono text-slate-300 border border-slate-800 flex items-center justify-between">
                          <span>⚡ {tool.toolName}()</span>
                          <span className="text-emerald-400">SUCCESS</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Embedded Payload Cards (e.g. Products or Order) */}
                  {msg.payload && (
                    <div className="pt-2 space-y-2">
                      
                      {/* Products Payload */}
                      {msg.payload.products && msg.payload.products.length > 0 && (
                        <div className="space-y-2 pt-1">
                          {msg.payload.products.slice(0, 2).map((p: Product) => (
                            <div key={p.id} className="p-2.5 rounded-xl bg-dark-900/90 border border-slate-800 flex items-center space-x-3">
                              <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white text-[11px] truncate">{p.name}</p>
                                <span className="text-cyan-400 font-bold text-[11px]">${p.price.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommendations Payload */}
                      {msg.payload.recommendations && msg.payload.recommendations.length > 0 && (
                        <div className="space-y-2 pt-1">
                          {msg.payload.recommendations.slice(0, 2).map((rec: Product) => (
                            <div key={rec.id} className="p-2.5 rounded-xl bg-dark-900/90 border border-slate-800 flex items-center space-x-3">
                              <img src={rec.imageUrl} alt={rec.name} className="w-12 h-12 object-cover rounded-lg" />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white text-[11px] truncate">{rec.name}</p>
                                <span className="text-amber-400 text-[10px]">★ {rec.rating} • ${rec.price.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Single Order Payload */}
                      {msg.payload.order && (
                        <div className="p-3 rounded-xl bg-dark-900/90 border border-cyan-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-cyan-300 text-xs">{msg.payload.order.orderId}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                              {msg.payload.order.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300">Carrier: {msg.payload.order.carrier}</p>
                          <p className="text-[11px] text-slate-400">Tracking: {msg.payload.order.trackingNumber}</p>
                          {onSelectOrder && (
                            <button
                              onClick={() => onSelectOrder(msg.payload!.order!.orderId)}
                              className="w-full py-1 text-[11px] bg-brand-600/80 hover:bg-brand-600 rounded-lg text-white font-semibold text-center block transition-colors"
                            >
                              View Full Timeline Tracker →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-[9px] opacity-60 block text-right mt-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Live Typing & Tool Execution Indicator */}
            {(isTyping || toolExecutionStep) && (
              <div className="flex items-center space-x-2 p-3 rounded-2xl glass-card border border-slate-700/60 w-fit text-slate-300 text-xs">
                <Cpu className="w-4 h-4 text-brand-cyan animate-spin" />
                <span>{toolExecutionStep || 'Binary Brain AI is thinking...'}</span>
                <div className="flex space-x-1 ml-2">
                  <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full typing-dot"></div>
                  <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full typing-dot"></div>
                  <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full typing-dot"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Prompt Chips */}
          <div className="px-4 py-2 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto scrollbar-none bg-dark-900/60">
            <button
              onClick={() => handleQuickPrompt('Where is my order ORD-1001?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700"
            >
              📦 Order #ORD-1001
            </button>
            <button
              onClick={() => handleQuickPrompt('Find wireless headphones under 200')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700"
            >
              🎧 Headphones &lt;$200
            </button>
            <button
              onClick={() => handleQuickPrompt('Recommend top rated electronics')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700"
            >
              ✨ Top Recommendations
            </button>
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-dark-900/90 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (e.g. 'Where is order 1002?')..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-cyan text-white shadow-md shadow-brand-500/20 disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
