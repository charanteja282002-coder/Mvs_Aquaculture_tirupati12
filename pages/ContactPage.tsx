
import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, ArrowLeft } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulating save to firestore
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="bg-white p-12 rounded-full shadow-lg mb-8">
          <Send className="h-16 w-16 text-aqua-dark animate-pulse" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Message Received!</h2>
        <p className="text-gray-500 mb-12 max-w-sm">We've received your inquiry. Our team will dive into it and get back to you within 24 hours.</p>
        <button 
          onClick={() => onNavigate('home')}
          className="bg-aqua-dark text-white font-accent font-bold uppercase px-12 py-4 rounded-full hover:bg-aqua-light transition-all shadow-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center text-gray-500 hover:text-aqua-dark transition-colors mb-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <h1 className="font-heading text-5xl font-bold text-aqua-dark mb-8">Get in <span className="text-gold">Touch</span></h1>
            <p className="text-gray-600 text-lg mb-12 leading-relaxed">
              Have a question about a specific species? Need advice on your first aquascape? Or maybe you just want to talk fish? We're here for you.
            </p>

            <div className="space-y-10">
              <div className="flex items-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm mr-6"><MapPin className="text-aqua-dark h-6 w-6" /></div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-1">Our Flagship Store</h4>
                  <p className="text-gray-500">123 Aqua Lane, Deep Sea Complex, Mumbai - 400001</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm mr-6"><Phone className="text-aqua-dark h-6 w-6" /></div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-1">Phone & WhatsApp</h4>
                  <p className="text-gray-500">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm mr-6"><Mail className="text-aqua-dark h-6 w-6" /></div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-1">Email Inquiries</h4>
                  <p className="text-gray-500">hello@mvsaqua.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm mr-6"><Clock className="text-aqua-dark h-6 w-6" /></div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-1">Store Hours</h4>
                  <p className="text-gray-500">Mon - Sat: 10:00 AM - 9:00 PM<br />Sun: 11:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
             <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div>
                   <label className="block text-xs font-accent uppercase tracking-widest text-gray-400 font-bold mb-3">Your Name</label>
                   <input required type="text" className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-aqua-dark" placeholder="John Doe" />
                 </div>
                 <div>
                   <label className="block text-xs font-accent uppercase tracking-widest text-gray-400 font-bold mb-3">Email Address</label>
                   <input required type="email" className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-aqua-dark" placeholder="john@example.com" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-accent uppercase tracking-widest text-gray-400 font-bold mb-3">Subject</label>
                 <select className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-aqua-dark">
                   <option>General Inquiry</option>
                   <option>Order Status</option>
                   <option>Product Information</option>
                   <option>Wholesale/Bulk Orders</option>
                   <option>Other</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-accent uppercase tracking-widest text-gray-400 font-bold mb-3">Your Message</label>
                 <textarea required rows={6} className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-aqua-dark" placeholder="How can we help you today?"></textarea>
               </div>
               <button type="submit" className="w-full bg-aqua-dark text-white font-accent font-bold uppercase tracking-wider py-5 rounded-2xl flex items-center justify-center hover:bg-aqua-light transition-all shadow-xl">
                 Send Message <Send className="ml-3 h-5 w-5" />
               </button>
             </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-24 rounded-3xl overflow-hidden shadow-xl h-96 bg-gray-200 border border-gray-100 relative group">
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center">
                <MapPin className="h-12 w-12 text-aqua-dark mx-auto mb-4" />
                <p className="font-heading text-xl font-bold text-gray-900">Map Interface Ready</p>
                <p className="text-gray-500">Visit us at Mumbai's prime aquatic location</p>
             </div>
           </div>
           <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
            alt="Storefront" 
            className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity"
           />
        </div>
      </div>
    </div>
  );
};
