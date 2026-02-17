
import React from 'react';
import { Waves, Facebook, Instagram, Youtube, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-aqua-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-lg mr-2">
                <Waves className="h-6 w-6 text-aqua-dark" />
              </div>
              <a 
                href="https://instagram.com/mvs_aqua" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-heading text-2xl font-bold tracking-tighter hover:text-gold transition-colors"
              >
                MVS AQUA
              </a>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Breathe life into your space with the finest selection of aquatic wonders, plants, and premium equipment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-gold hover:text-aqua-dark transition-all"><Facebook className="h-4 w-4" /></a>
              <a href="https://instagram.com/mvs_aqua" target="_blank" rel="noopener noreferrer" className="bg-blue-800 p-2 rounded-full hover:bg-gold hover:text-aqua-dark transition-all"><Instagram className="h-4 w-4" /></a>
              <a href="https://youtube.com/@mvs_aqua" target="_blank" rel="noopener noreferrer" className="bg-blue-800 p-2 rounded-full hover:bg-gold hover:text-aqua-dark transition-all"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-gold transition-colors">All Products</button></li>
              <li><a href="https://www.tpcindia.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center">Track Parcel <ExternalLink className="h-3 w-3 ml-2" /></a></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-gold transition-colors">Aquatic Plants</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-gold transition-colors">Our Story</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li><button onClick={() => onNavigate('contact')} className="hover:text-gold transition-colors">Contact Us</button></li>
              <li><button onClick={() => onNavigate('admin')} className="hover:text-gold transition-colors">Admin Dashboard</button></li>
              <li><a href="#" className="hover:text-gold transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Return Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Store Info</h3>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-gold shrink-0" />
                <span>15 Line, Upadhyaya Nagar, Tirupati, Andhra Pradesh 517507</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-gold shrink-0" />
                <span>+91 94902 55775</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gold shrink-0" />
                <span>mvs_aqua@support.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-blue-800 text-center text-blue-200 text-xs">
          <p>© {new Date().getFullYear()} MVS Aqua Premium Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
