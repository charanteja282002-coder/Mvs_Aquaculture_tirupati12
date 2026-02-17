
import React, { useState, useMemo } from 'react';
import { Filter, ShoppingCart, Eye, Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../AppContext';
import { Category, Product } from '../types';

interface ShopPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate }) => {
  const { products, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('name');

  // Dynamically calculate categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return a.name.localeCompare(b.name);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="font-heading text-4xl text-aqua-dark font-bold">Store Collection</h1>
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Search products or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-aqua-dark"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-10 sticky top-28">
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Categories
                </h3>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left py-2 px-3 rounded-xl transition-all ${
                        selectedCategory === cat 
                        ? 'bg-aqua-dark text-white font-bold translate-x-1' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-aqua-dark'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-6">Sort By</h3>
                <select 
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-3 text-sm focus:ring-2 focus:ring-aqua-dark"
                >
                  <option value="name">Alphabetical</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} onAddToCart={() => addToCart(product)} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center shadow-sm">
                <Search className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product, onNavigate: any, onAddToCart: any }> = ({ product, onNavigate, onAddToCart }) => (
  <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col h-full">
    <div className="h-64 overflow-hidden relative">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-aqua-dark/0 group-hover:bg-aqua-dark/20 transition-colors duration-300"></div>
      
      {/* Quick Actions */}
      <div className="absolute top-4 right-4 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 space-y-2">
        <button 
          onClick={onAddToCart}
          className="bg-white text-aqua-dark p-3 rounded-2xl shadow-lg hover:bg-gold hover:scale-110 transition-all flex items-center justify-center"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
        <button 
          onClick={() => onNavigate('product-detail', product)}
          className="bg-white text-aqua-dark p-3 rounded-2xl shadow-lg hover:bg-gold hover:scale-110 transition-all flex items-center justify-center"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>
      
      <div className="absolute bottom-4 left-4">
        <span className="bg-white/90 backdrop-blur-sm text-aqua-dark text-[10px] font-accent px-3 py-1 rounded-full uppercase tracking-widest font-bold">
          {product.category}
        </span>
      </div>
    </div>
    
    <div className="p-6 flex-grow flex flex-col justify-between">
      <div>
        <h3 className="font-heading text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-aqua-dark transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs mb-3">SKU: {product.sku}</p>
        <div className="flex items-center text-xs text-gray-500 mb-4 space-x-3">
          <span className="bg-gray-100 px-2 py-1 rounded-md">{product.weight}kg</span>
          <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-500'} font-semibold`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <span className="text-2xl font-bold text-aqua-dark">₹{product.price.toLocaleString()}</span>
        <button 
          onClick={() => onNavigate('product-detail', product)}
          className="text-aqua-dark font-accent uppercase text-xs font-bold tracking-widest hover:underline"
        >
          Details
        </button>
      </div>
    </div>
  </div>
);
