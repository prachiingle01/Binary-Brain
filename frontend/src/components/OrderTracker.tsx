import React, { useEffect, useState } from 'react';
import { Package, Search, Truck, MapPin, Clock, CheckCircle, Circle, AlertCircle, Sparkles, User, Mail, CreditCard } from 'lucide-react';
import { Order } from '../types';
import { useSocket } from '../context/SocketContext';

export const OrderTracker: React.FC = () => {
  const [searchId, setSearchId] = useState('ORD-1001');
  const [order, setOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { socket, sendMessage } = useSocket();

  const fetchOrder = (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);

    fetch(`/api/orders/${id.trim()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder(data.data);
          // Subscribe to live room via Socket
          if (socket) socket.emit('order:subscribe', data.data.orderId);
        } else {
          setOrder(null);
          setError(data.error || 'Order not found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchAllOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAllOrders(data.data);
      });
  };

  useEffect(() => {
    fetchOrder(searchId);
    fetchAllOrders();
  }, []);

  // Listen to WebSocket status changes for active order
  useEffect(() => {
    if (!socket) return;

    const handleStatusChanged = (data: any) => {
      if (order && data.orderId === order.orderId) {
        setOrder(data.order);
      }
      fetchAllOrders();
    };

    socket.on('order:status_changed', handleStatusChanged);
    return () => {
      socket.off('order:status_changed', handleStatusChanged);
    };
  }, [socket, order]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchId);
  };

  const statusColorMap: Record<string, string> = {
    'Pending': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'Processing': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    'Shipped': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    'Out for Delivery': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse',
    'Delivered': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Cancelled': 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header & Quick Lookup */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-cyan text-xs font-semibold mb-2">
              <Truck className="w-3.5 h-3.5" />
              <span>REAL-TIME SHIPMENT TIMELINE</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Natural Language Order Lookup
            </h2>
            <p className="text-xs text-slate-400">
              Check package status, carrier tracking code, and itemized delivery timeline.
            </p>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-slate-500 text-[11px] font-medium block w-full sm:w-auto">Sample Orders:</span>
            {allOrders.map(o => (
              <button
                key={o.orderId}
                onClick={() => { setSearchId(o.orderId); fetchOrder(o.orderId); }}
                className={`px-3 py-1.5 rounded-xl font-semibold border text-xs transition-all ${
                  searchId === o.orderId
                    ? 'bg-brand-600 border-brand-500 text-white shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {o.orderId} ({o.status})
              </button>
            ))}
          </div>
        </div>

        {/* Order Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. ORD-1001, ORD-1002)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-dark-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/30"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
          >
            Track Order
          </button>
        </form>
      </div>

      {/* Main Order Status Display */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          Loading order details...
        </div>
      ) : error ? (
        <div className="glass-card rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">{error}</h3>
          <p className="text-xs text-slate-400">Please verify the Order ID or ask the AI assistant for assistance.</p>
          <button
            onClick={() => sendMessage(`Where is my order ${searchId}?`)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-cyan-300 font-semibold border border-slate-700"
          >
            Ask AI Assistant
          </button>
        </div>
      ) : order ? (
        <div className="space-y-6">
          
          {/* Order Header Summary Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-white">Order {order.orderId}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColorMap[order.status] || 'bg-slate-800 text-slate-300'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block">Estimated Delivery</span>
                <span className="text-base font-extrabold text-cyan-300">{order.estimatedDelivery}</span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-400 font-medium">
                  <User className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Customer</span>
                </div>
                <p className="font-semibold text-slate-200">{order.customerName}</p>
                <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-400 font-medium">
                  <Truck className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Carrier & Tracking</span>
                </div>
                <p className="font-semibold text-slate-200">{order.carrier}</p>
                <p className="text-[11px] text-cyan-400 font-mono">{order.trackingNumber}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Shipping Address</span>
                </div>
                <p className="font-semibold text-slate-200 line-clamp-2">{order.shippingAddress}</p>
              </div>
            </div>

            {/* Tracking Progress Bar Timeline */}
            <div className="pt-4">
              <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider mb-6">Live Tracking Journey</h4>
              
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {order.trackingHistory.map((step, idx) => (
                  <div key={idx} className="relative flex items-start space-x-4">
                    
                    {/* Timeline Node */}
                    <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      step.completed
                        ? 'bg-brand-500 border-brand-cyan shadow-md shadow-brand-cyan/50'
                        : 'bg-dark-900 border-slate-700'
                    }`}>
                      {step.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>

                    <div className="flex-1 glass-card p-3.5 rounded-xl border border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-xs ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                          {step.status}
                        </span>
                        <span className="text-[10px] text-slate-500">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                      <span className="text-[10px] text-cyan-400/80 mt-1 block">📍 {step.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordered Items Breakdown */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider mb-3">Order Items</h4>
              <div className="divide-y divide-slate-800/60">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{item.quantity}x {item.productName}</span>
                    <span className="text-slate-400 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-3 flex items-center justify-between text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-cyan-300">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
