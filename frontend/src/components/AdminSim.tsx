import React, { useEffect, useState } from 'react';
import { Sliders, RefreshCw, Radio, CheckCircle2, ArrowRight, BellRing, Sparkles } from 'lucide-react';
import { Order } from '../types';
import { useSocket } from '../context/SocketContext';

export const AdminSim: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-1001');
  const [newStatus, setNewStatus] = useState<Order['status']>('Shipped');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { socket } = useSocket();

  const loadOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.data);
        }
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => loadOrders();
    socket.on('order:status_changed', handleUpdate);
    return () => {
      socket.off('order:status_changed', handleUpdate);
    };
  }, [socket]);

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg(null);

    fetch(`/api/orders/${selectedOrderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        setUpdating(false);
        if (data.success) {
          setSuccessMsg(`Order ${selectedOrderId} updated to status '${newStatus}'! Socket notification sent.`);
          loadOrders();
          setTimeout(() => setSuccessMsg(null), 5000);
        }
      })
      .catch(() => setUpdating(false));
  };

  const selectedOrder = orders.find(o => o.orderId === selectedOrderId);

  const statuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>LIVE WEBSOCKET EVENT SIMULATOR</span>
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Real-Time Order State Dispatcher
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed">
          Simulate fulfillment events and backend state updates. Changing an order's status triggers instant 
          WebSocket broadcasting to subscribed clients, updating order tracking timelines and sending push notification toasts.
        </p>
      </div>

      {/* Main Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Interactive Form */}
        <div className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-brand-cyan" />
            <span>Update Order Status</span>
          </h3>

          <form onSubmit={handleStatusUpdate} className="space-y-4">
            
            {/* Select Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Select Target Order</label>
              <select
                value={selectedOrderId}
                onChange={e => setSelectedOrderId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-xs text-white focus:border-brand-cyan focus:outline-none"
              >
                {orders.map(o => (
                  <option key={o.orderId} value={o.orderId}>
                    {o.orderId} — {o.customerName} ({o.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Select New Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">New Fulfillment State</label>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map(st => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setNewStatus(st)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between ${
                      newStatus === st
                        ? 'bg-brand-600 border-brand-cyan text-white shadow-md'
                        : 'bg-dark-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{st}</span>
                    {newStatus === st && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={updating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-cyan text-white text-xs font-extrabold shadow-lg shadow-brand-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              {updating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Broadcasting State Change...</span>
                </>
              ) : (
                <>
                  <BellRing className="w-4 h-4" />
                  <span>Dispatch Real-Time WebSocket Update</span>
                </>
              )}
            </button>
          </form>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center space-x-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Right: Active Order Live Preview */}
        <div className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            <span>Target Order Snapshot</span>
          </h3>

          {selectedOrder ? (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-dark-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{selectedOrder.orderId}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950 border border-cyan-700 text-cyan-300">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-slate-400">Customer: <span className="text-slate-200 font-semibold">{selectedOrder.customerName}</span></p>
                <p className="text-slate-400">Email: <span className="text-slate-200 font-mono">{selectedOrder.customerEmail}</span></p>
                <p className="text-slate-400">Carrier: <span className="text-slate-200">{selectedOrder.carrier}</span> ({selectedOrder.trackingNumber})</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 text-xs mb-2">Tracking Nodes:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.trackingHistory.map((step, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-[11px]">
                      <span className={step.completed ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                        {step.completed ? '✓' : '○'} {step.status}
                      </span>
                      <span className="text-slate-500">{step.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">Select an order to view preview.</div>
          )}
        </div>
      </div>
    </div>
  );
};
