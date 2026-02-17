
import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, X, Waves } from 'lucide-react';
import { useApp } from '../AppContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useApp();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Shop', id: 'shop' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-aqua-dark p-2 rounded-lg mr-2 group-hover:bg-aqua-light transition-colors">
              <Waves className="h-6 w-6 text-gold" />
            </div>
            <span className="font-heading text-2xl tracking-tighter text-aqua-dark font-bold">
              MVS <span className="text-aqua-light">AQUA</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="font-sans text-gray-600 hover:text-aqua-dark font-medium transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <button className="text-gray-500 hover:text-aqua-dark transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onNavigate('cart')}
              className="relative text-gray-500 hover:text-aqua-dark transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-aqua-dark text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => onNavigate('admin')}
              className="text-gray-500 hover:text-aqua-dark transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             <button 
              onClick={() => onNavigate('cart')}
              className="relative text-gray-500"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-aqua-dark text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg animate-fade-in">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-2 font-medium text-gray-700"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4 border-t border-gray-100 flex space-x-6">
            <button onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }} className="flex items-center text-gray-600">
              <User className="h-5 w-5 mr-2" /> Admin Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
