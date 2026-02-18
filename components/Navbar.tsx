
import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, X, Waves, Circle } from 'lucide-react';
import { useApp } from '../AppContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, isOnline } = useApp();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Shop', id: 'shop' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center group"
            >
              <div className="bg-aqua-dark p-2 rounded-xl mr-3 group-hover:rotate-12 transition-transform shadow-lg shadow-aqua-dark/20">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-heading text-xl font-bold tracking-tighter text-aqua-dark">MVS AQUA</span>
                <div className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOnline ? 'bg-green-500 animate-pulse-fast' : 'bg-blue-400'}`}></div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {isOnline ? 'Live Sync' : 'Local Mode'}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="text-sm font-accent font-bold text-gray-500 hover:text-aqua-dark uppercase tracking-widest transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => onNavigate('shop')}
              className="p-2 text-gray-400 hover:text-aqua-dark transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onNavigate('admin')}
              className="p-2 text-gray-400 hover:text-aqua-dark transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-400 hover:text-aqua-dark transition-colors group"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-aqua-dark text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-400"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0 -right-0 bg-gold text-aqua-dark text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-aqua-dark"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-4 text-base font-bold text-gray-600 hover:bg-gray-50 hover:text-aqua-dark uppercase tracking-widest"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 flex items-center space-x-8 px-4 border-t border-gray-50">
              <button onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }} className="flex items-center text-gray-500 font-bold uppercase text-xs tracking-widest">
                <User className="h-5 w-5 mr-2" /> Account
              </button>
              <button onClick={() => { onNavigate('shop'); setIsMenuOpen(false); }} className="flex items-center text-gray-500 font-bold uppercase text-xs tracking-widest">
                <Search className="h-5 w-5 mr-2" /> Search
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
