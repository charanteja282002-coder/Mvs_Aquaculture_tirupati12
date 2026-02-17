
import React from 'react';
import { ArrowRight, ShoppingBag, Leaf, Filter, Waves, Truck } from 'lucide-react';
import { useApp } from '../AppContext';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products } = useApp();
  const featured = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=2000')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-aqua-dark/80 via-aqua-dark/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="font-heading text-5xl md:text-7xl text-white font-bold leading-tight mb-6">
              Breathe Life <br /><span className="text-gold">Into Your Space</span>
            </h1>
            <p className="font-sans text-xl text-blue-50 text-balance mb-10 max-w-lg leading-relaxed">
              Explore our curated collection of vibrant exotic fish, lush aquatic plants, and professional-grade aquascaping supplies.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => onNavigate('shop')}
                className="font-accent bg-gold text-aqua-dark px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-xl flex items-center justify-center"
              >
                Explore Shop <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="font-accent bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Floating Accent */}
        <div className="absolute bottom-10 right-10 hidden lg:block animate-bounce-slow">
           <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <p className="text-white font-heading text-lg flex items-center"><Truck className="mr-2 h-5 w-5 text-gold" /> Monday Dispatch</p>
              <p className="text-gold text-sm">Professional Courier Partner</p>
           </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl text-aqua-dark font-bold mb-4">Everything for Your Tank</h2>
            <div className="h-1.5 w-24 bg-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Exotic Fish', icon: Waves, color: 'bg-blue-500' },
              { name: 'Aquatic Plants', icon: Leaf, color: 'bg-green-500' },
              { name: 'Filters', icon: Filter, color: 'bg-gray-500' },
              { name: 'Essentials', icon: ShoppingBag, color: 'bg-amber-500' },
            ].map((cat, i) => (
              <div 
                key={i} 
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer group text-center"
                onClick={() => onNavigate('shop')}
              >
                <div className={`${cat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="text-white h-8 w-8" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-800">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-4xl text-aqua-dark font-bold mb-2">Editor's Choice</h2>
              <p className="text-gray-500">Premium selection for the enthusiast</p>
            </div>
            <button 
              onClick={() => onNavigate('shop')}
              className="text-aqua-dark font-bold flex items-center hover:text-aqua-light transition-colors"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(product => (
              <div 
                key={product.id} 
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100"
              >
                <div 
                  className="h-72 overflow-hidden cursor-pointer"
                  onClick={() => onNavigate('product-detail', product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-aqua-dark text-white text-[10px] font-accent px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-1 group-hover:text-aqua-dark transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-xs mb-4">SKU: {product.sku} | {product.weight}kg</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-aqua-dark">₹{product.price.toLocaleString()}</span>
                    <button 
                      onClick={() => onNavigate('product-detail', product)}
                      className="bg-gray-100 text-gray-700 p-3 rounded-2xl hover:bg-aqua-dark hover:text-white transition-all"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-aqua-dark py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-heading text-4xl text-white font-bold mb-8">Ready to Build Your Dream Aquarium?</h2>
          <p className="text-blue-100 text-lg mb-12">
            Join the MVS Aqua family. Every Monday dispatch ensured with professional packing.
          </p>
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow bg-white/10 border border-white/20 text-white placeholder:text-blue-200 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button className="bg-gold text-aqua-dark font-accent font-bold uppercase px-8 py-4 rounded-full hover:bg-white transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
