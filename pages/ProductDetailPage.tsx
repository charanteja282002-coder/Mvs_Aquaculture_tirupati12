
import React, { useState } from 'react';
import { ShoppingCart, Zap, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useApp } from '../AppContext';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product | null;
  onNavigate: (page: string, data?: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailProps> = ({ product, onNavigate }) => {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Product Not Found</h2>
        <button onClick={() => onNavigate('shop')} className="text-aqua-dark underline">Back to Shop</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Basic logic for multi-add
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onNavigate('cart');
  };

  const handleBuyNow = () => {
    addToCart(product);
    onNavigate('checkout');
  };

  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => onNavigate('shop')}
          className="flex items-center text-gray-500 hover:text-aqua-dark transition-colors mb-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="bg-aqua-dark text-white text-xs font-accent px-3 py-1 rounded-full uppercase tracking-widest font-bold mb-4 inline-block">
                {product.category}
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-400 font-sans tracking-wide">SKU: {product.sku}</p>
            </div>

            <div className="mb-10 pb-8 border-b border-gray-100">
              <p className="text-3xl font-bold text-aqua-dark mb-6">₹{product.price.toLocaleString()}</p>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Weight</p>
                <p className="text-gray-900 font-bold">{product.weight} kg</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Stock Status</p>
                <p className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border-2 border-gray-100 rounded-2xl px-4 py-2">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl text-gray-400 hover:text-aqua-dark transition-colors">-</button>
                   <span className="mx-8 font-bold text-lg min-w-[20px] text-center">{quantity}</span>
                   <button onClick={() => setQuantity(Math.min(50, Math.min(product.stock, quantity + 1)))} className="text-2xl text-gray-400 hover:text-aqua-dark transition-colors">+</button>
                </div>
                <p className="text-sm text-gray-400">Total: ₹{(product.price * quantity).toLocaleString()}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-grow bg-aqua-dark text-white font-accent font-bold uppercase tracking-wider py-5 rounded-2xl flex items-center justify-center hover:bg-aqua-light transition-all disabled:opacity-50"
                >
                  <ShoppingCart className="mr-3 h-5 w-5" /> Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-grow bg-gold text-aqua-dark font-accent font-bold uppercase tracking-wider py-5 rounded-2xl flex items-center justify-center hover:bg-white hover:border-aqua-dark border-2 border-transparent transition-all disabled:opacity-50"
                >
                  <Zap className="mr-3 h-5 w-5" /> Buy Now
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
               <div className="text-center">
                 <Truck className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                 <p className="text-[10px] text-gray-500 font-bold uppercase">Fast Shipping</p>
               </div>
               <div className="text-center">
                 <ShieldCheck className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                 <p className="text-[10px] text-gray-500 font-bold uppercase">Safe Payment</p>
               </div>
               <div className="text-center">
                 <RefreshCw className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                 <p className="text-[10px] text-gray-500 font-bold uppercase">Easy Returns</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
