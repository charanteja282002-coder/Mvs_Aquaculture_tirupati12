
import React from 'react';
import { Waves, Heart, Target, Award, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="py-24 bg-aqua-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 translate-x-1/2 -translate-y-1/2">
           <Waves size={600} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-8">Our Deep Sea <span className="text-gold">Passion</span></h1>
          <p className="max-w-2xl mx-auto text-xl text-blue-100 leading-relaxed">
            MVS Aqua is more than just a store—it's a hub for aquascaping excellence based in Tirupati. We specialize in exotic fish and premium planted tank essentials.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-12 bg-gray-50 rounded-3xl">
              <div className="bg-aqua-dark w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Heart className="text-gold h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Monday Dispatch</h3>
              <p className="text-gray-500 text-sm">To ensure the highest health standards, we dispatch all livestock and equipment orders every Monday morning.</p>
            </div>
            <div className="text-center p-12 bg-gray-50 rounded-3xl">
              <div className="bg-aqua-dark w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Target className="text-gold h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Professional Packaging</h3>
              <p className="text-gray-500 text-sm">Every order is packed with care. We use professional logistics partners like TPC and ST Courier.</p>
            </div>
            <div className="text-center p-12 bg-gray-50 rounded-3xl">
              <div className="bg-aqua-dark w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Award className="text-gold h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Transparent Policies</h3>
              <p className="text-gray-500 text-sm">We provide partial refunds for damages with unboxing video proof, maintaining 100% trust with our hobbyist family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl relative">
               <img src="https://images.unsplash.com/photo-1520107449437-6a4a42ddabb7?auto=format&fit=crop&q=80&w=1200" alt="Founder" className="w-full h-full object-cover" />
               <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center text-aqua-dark">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tirupati Headquarters</span>
                  </div>
               </div>
             </div>
             <div className="lg:w-1/2">
                <h2 className="font-heading text-4xl font-bold text-aqua-dark mb-8">Liquid Art, Delivered.</h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Headquartered at 15 Line, Upadhyaya Nagar, Tirupati, MVS Aqua has grown from a local hobbyist project into a premium national supplier.
                </p>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Our specialized Monday-only dispatch system ensures that livestock doesn't spend weekends in transit, maximizing health and safety.
                </p>
                <div className="bg-white p-8 rounded-2xl border-l-4 border-gold shadow-sm">
                   <p className="italic text-gray-900 font-medium text-sm">"Our dispatch system and unboxing video policy are designed to ensure every hobbyist receives exactly what they dream of, in the best condition possible."</p>
                   <p className="mt-4 font-bold text-aqua-dark text-xs uppercase tracking-widest">— MVS Aqua Team</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};
