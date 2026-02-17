
import React, { useState } from 'react';
import { Send, ArrowLeft, ShieldCheck, MapPin, Smartphone, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../AppContext';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, clearCart, addOrder } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const totalWeight = cart.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
  const shipping = Math.ceil(totalWeight) * 80;
  const total = subtotal + tax + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = 'MVS' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const orderItemsText = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    
    // Professional Order Flow Text
    const whatsappMessage = `Hi 👋 MVS Aqua! 🌊%0A%0AI'd like to place an order.%0A%0A*Order REF:* ${orderId}%0A*Items:* ${orderItemsText}%0A%0A*Order Summary:*%0A- Subtotal: ₹${subtotal.toLocaleString()}%0A- Tax (18%): ₹${tax.toLocaleString()}%0A- Shipping (${totalWeight.toFixed(2)}kg): ₹${shipping.toLocaleString()}%0A*Grand Total:* ₹${total.toLocaleString()}%0A%0A*Customer Details:*%0A- Name: ${formData.name}%0A- Phone: ${formData.phone}%0A- Address: ${formData.address}%0A%0A⚠️ *Note:* I understand this is a prepaid order and dispatch happens every Monday. Please share GPay/PhonePe details for ₹${total.toLocaleString()}.`;
    
    // Save order locally
    addOrder({
      id: orderId,
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      items: [...cart],
      subtotal,
      tax,
      shipping,
      total,
      status: 'Pending',
      date: new Date().toISOString(),
    });

    // Official WhatsApp Business Number
    const whatsappUrl = `https://wa.me/919490255775?text=${whatsappMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    clearCart();
    alert('Order Confirmed! 👍 Check your WhatsApp to finalize the prepaid payment.');
    onNavigate('home');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => onNavigate('cart')}
          className="flex items-center text-gray-500 hover:text-aqua-dark transition-colors mb-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="font-heading text-3xl text-aqua-dark font-bold mb-10">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-accent uppercase tracking-widest text-gray-400 font-bold mb-2">Recipient Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-aqua-dark outline-none"
                  placeholder="Full Name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-accent uppercase tracking-widest text-gray-400 font-bold mb-2">Email Identity (Optional)</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-aqua-dark outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-accent uppercase tracking-widest text-gray-400 font-bold mb-2">WhatsApp Number</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-aqua-dark outline-none"
                    placeholder="+91"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-accent uppercase tracking-widest text-gray-400 font-bold mb-2">Full Delivery Address</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-aqua-dark outline-none"
                  placeholder="Flat/House No, Area, Landmark, City, State"
                ></textarea>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 p-6 rounded-2xl flex items-start space-x-4 border border-amber-100">
                   <AlertCircle className="text-amber-600 shrink-0" />
                   <div>
                      <h4 className="font-bold text-amber-900 text-sm">Prepaid Orders Only</h4>
                      <p className="text-xs text-amber-800/70 mt-1 uppercase font-bold tracking-tight">No Cash on Delivery. GPay/PhonePe details will be shared on WhatsApp.</p>
                   </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl flex items-start space-x-4 border border-blue-100">
                   <Info className="text-blue-600 shrink-0" />
                   <div>
                      <h4 className="font-bold text-blue-900 text-sm">Dispatch Schedule</h4>
                      <p className="text-xs text-blue-800/70 mt-1 uppercase font-bold tracking-tight">Parcels are dispatched every MONDAY morning.</p>
                   </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-aqua-dark text-white font-accent font-bold uppercase tracking-wider py-5 rounded-2xl flex items-center justify-center hover:bg-aqua-light transition-all shadow-xl"
              >
                Confirm Order via WhatsApp <Send className="ml-3 h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            <div className="bg-aqua-dark p-8 rounded-3xl shadow-xl text-white">
              <h3 className="font-heading text-xl font-bold mb-8 flex items-center">
                <Smartphone className="mr-2 h-5 w-5 text-gold" /> Order Summary
              </h3>
              <div className="space-y-4 mb-8">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-blue-100">
                    <span className="text-sm">{item.name} x{item.quantity}</span>
                    <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-blue-800 space-y-2">
                <div className="flex justify-between text-xs text-blue-200">
                  <span>Shipping ({totalWeight.toFixed(2)}kg)</span>
                  <span>₹{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-3xl font-bold text-gold">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center">
                 <div className="bg-green-100 p-3 rounded-2xl mr-4"><ShieldCheck className="text-green-600" /></div>
                 <div>
                    <h4 className="font-bold text-gray-900 text-sm">Verified Dispatch</h4>
                    <p className="text-xs text-gray-500">Every parcel gets a tracking ID on Monday</p>
                 </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center">
                 <div className="bg-blue-100 p-3 rounded-2xl mr-4"><MapPin className="text-blue-600" /></div>
                 <div>
                    <h4 className="font-bold text-gray-900 text-sm">Professional Delivery</h4>
                    <p className="text-xs text-gray-500">Tracking via tpcindia.com</p>
                 </div>
               </div>
            </div>
            
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-3xl text-center">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
                 No replacement without unboxing video 💯 <br />
                 In case of damages, 45% of amount will be refunded.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
