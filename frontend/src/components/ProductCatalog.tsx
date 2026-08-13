import React, { useEffect, useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useSocket } from '../context/SocketContext';

interface ProductCatalogProps {
  onAskAIAboutProduct?: (p: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAskAIAboutProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [loading, setLoading] = useState(true);

  const { sendMessage } = useSocket();

  const categories = ['All', 'Audio & Wearables', 'Electronics & Display', 'Apparel & Fashion', 'Apparel & Footwear', 'Computer Accessories', 'Outdoor & Travel'];

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    if (maxPrice < 500) params.append('maxPrice', maxPrice.toString());

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data);
          // Set top 2 as AI recommendations
          setRecommendations(data.data.filter((p: Product) => p.rating >= 4.7).slice(0, 2));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, maxPrice]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAISearchPrompt = (promptText: string) => {
    setSearchQuery(promptText);
    sendMessage(promptText);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Banner with AI Natural Language Search */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-10 overflow-hidden border border-slate-700/60 glow-indigo">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-cyan text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED INTELLIGENT SEARCH ENGINE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Discover Tech & Gear with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-cyan via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Natural Language Intent
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Type anything in plain English like <em className="text-cyan-300 font-medium">"noise-canceling headphones under $200"</em> or <em className="text-cyan-300 font-medium">"warm wool sweater for winter"</em>. Our autonomous AI agent matches items instantly.
          </p>

          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ask AI: 'Find high refresh rate gaming monitors under $400'..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-dark-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/30 transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-cyan text-white text-xs font-extrabold shadow-lg shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Products</span>
            </button>
          </form>

          {/* Prompt Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Try AI Prompt:</span>
            <button
              onClick={() => handleAISearchPrompt('Show noise canceling headphones under 200')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700 text-[11px] transition-colors"
            >
              "Headphones under $200"
            </button>
            <button
              onClick={() => handleAISearchPrompt('Recommend gaming monitor with high refresh rate')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700 text-[11px] transition-colors"
            >
              "165Hz Gaming Monitor"
            </button>
            <button
              onClick={() => handleAISearchPrompt('Show waterproof outdoor backpack')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700 text-[11px] transition-colors"
            >
              "Outdoor Hiking Backpack"
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendations Banner */}
      {recommendations.length > 0 && !searchQuery && (
        <div className="glass-card rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/30 to-dark-800">
          <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Featured Recommendations for You</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map(rec => (
              <div key={rec.id} className="flex items-center space-x-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <img src={rec.imageUrl} alt={rec.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-white truncate">{rec.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{rec.category}</p>
                  <span className="text-xs font-bold text-cyan-400 mt-1 block">${rec.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => sendMessage(`Why is ${rec.name} recommended?`)}
                  className="px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800/80 border border-purple-700/50 text-[11px] text-purple-200 font-semibold transition-colors"
                >
                  Ask AI
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Controls & Categories */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-4 rounded-2xl">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Max Price Slider */}
        <div className="flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-300">Max Price: <strong className="text-cyan-400">${maxPrice}</strong></span>
          <input
            type="range"
            min="50"
            max="500"
            step="25"
            value={maxPrice}
            onChange={e => setMaxPrice(parseInt(e.target.value))}
            className="w-24 accent-brand-cyan cursor-pointer"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Executing intelligent query search across product database...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-2xl space-y-3 p-8">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="font-bold text-base text-white">No products found matching your search</h3>
          <p className="text-xs text-slate-400">Try loosening your search filters or ask our AI assistant for help!</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setMaxPrice(500); }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAskAI={onAskAIAboutProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
