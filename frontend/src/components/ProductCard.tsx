import React from 'react';
import { Star, ShoppingCart, MessageSquare, Check, Tag } from 'lucide-react';
import { Product } from '../types';
import { useSocket } from '../context/SocketContext';

interface ProductCardProps {
  product: Product;
  onAskAI?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAskAI }) => {
  const { sendMessage } = useSocket();

  const handleAsk = () => {
    if (onAskAI) {
      onAskAI(product);
    } else {
      sendMessage(`Tell me more about ${product.name} and its key features`);
    }
  };

  return (
    <div className="group glass-card rounded-2xl overflow-hidden hover:border-slate-600/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10">
      <div>
        {/* Product Image Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-medium text-cyan-300 border border-cyan-500/30">
            <Tag className="w-3 h-3 text-cyan-400" />
            <span>{product.category}</span>
          </div>

          <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-xs font-bold text-amber-400 border border-amber-500/30">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-[10px] text-slate-400 font-normal">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Info Body */}
        <div className="p-5">
          <h3 className="font-bold text-slate-100 text-base line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Specs Snippet */}
          <div className="mt-3.5 grid grid-cols-2 gap-1.5 text-[11px]">
            {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
              <div key={key} className="px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-300 truncate">
                <span className="text-slate-500 font-medium">{key}: </span>{val}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/40">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="p-5 pt-0 flex items-center justify-between mt-2 border-t border-slate-800/80 pt-4">
        <div>
          <span className="text-xs text-slate-500 block">Price</span>
          <span className="text-xl font-extrabold text-white tracking-tight">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAsk}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-400 transition-all hover:border-cyan-500/50"
            title="Ask AI Assistant about this item"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          <button
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
