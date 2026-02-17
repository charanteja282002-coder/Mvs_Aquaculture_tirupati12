
import React from 'react';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Truck } from 'lucide-react';
import { useApp } from '../AppContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateCartQuantity } = useApp();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST
  
  // New Shipping Logic: 80 INR per kg
  const totalWeight = cart.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
  const shipping = Math.ceil(totalWeight) * 80;
  
  const total = subtotal + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center bg-gray-50 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-white p-12 rounded-full shadow-sm mb-8">
          <ShoppingBag className="h-16 w-16 text-gray-200" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any aquatic treasures yet. Explore our shop to find the perfect additions!</p>
        <button 
          onClick={() => onNavigate('shop')}
          className="bg-aqua-dark text-white font-accent font-bold uppercase px-12 py-4 rounded-full hover:bg-aqua-light transition-all shadow-lg"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl text-aqua-dark font-bold mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                <img src={item.image} alt={item.name} className="w-32 h-32 rounded-2xl object-cover shadow-inner" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">SKU: {item.sku} | Weight: {item.weight}kg</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-4">
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-2 py-1">
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-aqua-dark">-</button>
                      <span className="mx-4 font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-aqua-dark">+</button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-aqua-dark">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-xs text-gray-400 font-medium">₹{item.price.toLocaleString()} / unit</p>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => onNavigate('shop')}
              className="flex items-center text-gray-500 hover:text-aqua-dark font-medium transition-colors pt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-28">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-50">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-gray-900">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center">Shipping <span className="ml-1 text-[10px] text-gray-400">({totalWeight.toFixed(2)}kg)</span></span>
                  <span className="font-semibold text-gray-900">₹{shipping.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-end mb-10 pt-4 border-t border-gray-50">
                <span className="font-heading text-lg font-bold text-aqua-dark">Total</span>
                <span className="text-3xl font-bold text-aqua-dark">₹{total.toLocaleString()}</span>
              </div>
              
              <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start">
                <Truck className="h-5 w-5 text-aqua-dark mr-3 shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed font-bold uppercase">Dispatch every Monday only!</p>
              </div>

              <button 
                onClick={() => onNavigate('checkout')}
                className="w-full bg-aqua-dark text-white font-accent font-bold uppercase tracking-wider py-5 rounded-2xl flex items-center justify-center hover:bg-aqua-light transition-all shadow-xl"
              >
                Checkout <ArrowRight className="ml-3 h-5 w-5" />
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">Standard Professional Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
