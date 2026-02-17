
import React, { useState, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Trash2,
  X,
  Printer,
  Download,
  AlertCircle,
  Upload,
  PlusCircle,
  Calculator,
  Info,
  Users,
  CloudOff,
  Cloud,
  TrendingUp,
  DollarSign,
  Box,
  ShoppingBag,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../AppContext';
import { Product, Order, CartItem } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { generateInvoicePDF } from '../../pdfService';

interface AdminLayoutProps {
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'inventory' | 'invoices'>('stats');
  const { logout, products, setProducts, orders, isOnline } = useApp();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const menuItems = [
    { id: 'stats', label: 'Business Analytics', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory Manager', icon: Package },
    { id: 'invoices', label: 'Billing Engine', icon: FileText },
  ];

  const renderModule = () => {
    switch (activeTab) {
      case 'stats': return <StatsModule orders={orders} products={products} isOnline={isOnline} />;
      case 'inventory': return <InventoryModule products={products} setProducts={setProducts} />;
      case 'invoices': return <InvoiceModule orders={orders} products={products} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans border-t-4 border-aqua-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col shrink-0 border-r border-gray-800">
        <div className="mb-10 flex items-center border-b border-gray-800 pb-6">
          <div className="bg-aqua-dark p-1 rounded-lg mr-3 shadow-lg shadow-aqua-dark/20">
             <Box className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-heading text-xl font-bold tracking-tight">MVS <span className="text-aqua-light">PRO</span></h1>
        </div>

        <nav className="flex-grow space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center px-4 py-4 text-sm transition-all rounded-xl border-l-4 mb-2 ${
                activeTab === item.id 
                ? 'bg-gray-800 border-aqua-dark text-white font-bold' 
                : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Connection Status */}
        <div className="mb-4 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-800">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Cloud className="h-4 w-4 text-green-400" />
            ) : (
              <Zap className="h-4 w-4 text-aqua-light" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
              {isOnline ? 'Cloud Node: Online' : 'Local Instance Engine'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center px-4 py-3 text-xs text-gray-500 hover:text-red-400 transition-all border-t border-gray-800 pt-6"
        >
          <LogOut className="h-4 w-4 mr-3" />
          End Session
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-grow overflow-y-auto bg-[#F8FAFC]">
        {renderModule()}
      </main>
    </div>
  );
};

// --- STATS MODULE ---

const COLORS = ['#003366', '#00B4D8', '#FFD700', '#2D3748', '#4A5568'];

const StatsModule: React.FC<{ orders: Order[], products: Product[], isOnline: boolean }> = ({ orders, products, isOnline }) => {
  const totalRevenue = useMemo(() => orders.reduce((acc, o) => acc + o.total, 0), [orders]);
  const totalOrdersCount = orders.length;
  const totalStockValuation = useMemo(() => products.reduce((acc, p) => acc + (p.price * p.stock), 0), [products]);

  // Category Breakdown Data
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        data[item.category] = (data[item.category] || 0) + (item.price * item.quantity);
      });
    });
    const result = Object.entries(data).map(([name, value]) => ({ name, value }));
    return result.length > 0 ? result : [{ name: 'No Data', value: 1 }];
  }, [orders]);

  // Top Selling Products
  const topProducts = useMemo(() => {
    const data: Record<string, { name: string, quantity: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!data[item.id]) data[item.id] = { name: item.name, quantity: 0 };
        data[item.id].quantity += item.quantity;
      });
    });
    return Object.values(data)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  // Revenue Over Time (Daily)
  const revenueHistory = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTotal = orders
        .filter(o => o.date.startsWith(date))
        .reduce((sum, o) => sum + o.total, 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayTotal
      };
    });
  }, [orders]);

  return (
    <div className="p-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1 text-aqua-dark">Store Dashboard</h2>
          <p className="text-sm text-gray-500 font-medium">Real-time performance metrics for MVS Aqua</p>
        </div>
        <div className={`flex items-center text-[10px] font-black px-4 py-2 border uppercase tracking-[0.2em] rounded-full shadow-sm bg-white ${isOnline ? 'text-green-600 border-green-100' : 'text-blue-600 border-blue-100'}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div> 
          {isOnline ? 'Cloud Node: Online' : 'Local Persistence Engine'}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard icon={DollarSign} label="Gross Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="bg-blue-50 text-aqua-dark" />
        <KpiCard icon={ShoppingBag} label="Total Orders" value={totalOrdersCount.toString()} color="bg-gold/10 text-gold" />
        <KpiCard icon={TrendingUp} label="Avg Order Value" value={`₹${(totalOrdersCount ? totalRevenue / totalOrdersCount : 0).toFixed(0)}`} color="bg-green-50 text-green-600" />
        <KpiCard icon={Package} label="Inventory Value" value={`₹${totalStockValuation.toLocaleString()}`} color="bg-gray-50 text-gray-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sales Trend - Added min-w-0 for Recharts stability */}
        <div className="lg:col-span-2 bg-white p-8 border border-gray-100 rounded-3xl shadow-sm min-w-0">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Revenue Performance (Last 7 Days)</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#94A3B8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#94A3B8' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#003366" 
                  strokeWidth={4} 
                  dot={{ fill: '#003366', strokeWidth: 2, r: 6, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share - Added min-w-0 for Recharts stability */}
        <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm min-w-0">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Revenue by Category</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {categoryData.filter(i => i.name !== 'No Data').slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500">
                <span>{item.name}</span>
                <span className="text-gray-900">₹{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Top Selling Units</h3>
          <div className="space-y-6">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400 mr-4">
                    {i + 1}
                  </div>
                  <span className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-black text-aqua-dark bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    {p.quantity} Units
                  </span>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-gray-400 italic">No sales data available yet.</p>}
          </div>
        </div>

        {/* Recent Orders Log */}
        <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Recent Store Activity</h3>
          <div className="space-y-6">
            {orders.slice(0, 5).map((order, i) => (
              <div key={order.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className="bg-aqua-dark/10 p-2 rounded-xl mr-4">
                    <FileText className="h-4 w-4 text-aqua-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-gray-900">₹{order.total.toLocaleString()}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-gray-400 italic">No recent activity logged.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm transition-transform hover:-translate-y-1">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
  </div>
);

// --- INVENTORY MODULE ---

const InventoryModule: React.FC<{ products: Product[], setProducts: any }> = ({ products, setProducts }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialFormState: Partial<Product> = {
    name: '', sku: '', category: '', price: 0, weight: 0, stock: 0, description: '', featured: false, image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=800'
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } as Product : p));
    } else {
      const newProduct = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Product;
      setProducts([...products, newProduct]);
    }
    closeForm();
  };

  const startEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsAdding(true);
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const deleteProduct = (id: string) => {
    if (confirm('Permanently remove this product from inventory?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-10 space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-aqua-dark uppercase tracking-tighter mb-1">Stock Management</h2>
          <p className="text-sm text-gray-500 font-medium">Control your catalog and availability</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-aqua-dark text-white px-8 py-4 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center shadow-lg shadow-aqua-dark/20"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Item
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-10 border border-gray-100 rounded-3xl shadow-xl animate-fade-in">
          <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              {editingId ? 'Modify Specifications' : 'Register New Asset'}
            </h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-black transition-colors"><X className="h-6 w-6" /></button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SKU ID</label>
                <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category Tag</label>
                <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Media Asset (Image)</label>
                <div className="flex gap-4">
                  <input required type="text" className="flex-grow bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" placeholder="Image URL..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                  <button 
                    type="button" 
                    onClick={triggerFileUpload}
                    className="bg-aqua-dark p-4 rounded-2xl text-white hover:bg-black transition-colors shadow-md"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price (INR)</label>
                  <input required type="number" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mass (KG)</label>
                  <input required type="number" step="0.01" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Units in Stock</label>
                <input required type="number" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Product Description</label>
                <textarea rows={4} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl">
                 <input type="checkbox" id="feat" className="h-5 w-5 rounded-lg border-gray-200 text-aqua-dark focus:ring-aqua-dark" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                 <label htmlFor="feat" className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] cursor-pointer">Promote to Featured</label>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-6">
              <button type="button" onClick={closeForm} className="px-10 py-4 bg-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200">Cancel</button>
              <button type="submit" className="px-10 py-4 bg-aqua-dark text-white font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-black shadow-lg shadow-aqua-dark/20">Commit Changes</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-96">
            <input type="text" placeholder="Search by name, SKU or tag..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 text-sm rounded-2xl outline-none focus:ring-2 focus:ring-aqua-dark shadow-sm" />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Managed Assets: {products.length}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/30 text-[10px] uppercase font-black text-gray-400 border-b border-gray-50">
              <tr>
                <th className="px-8 py-5">Product Identity</th>
                <th className="px-8 py-5 text-center">Price Points</th>
                <th className="px-8 py-5 text-center">Availability</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {products.filter(p => 
                p.name.toLowerCase().includes(search.toLowerCase()) || 
                p.sku.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
              ).map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="relative">
                        <img src={p.image} className="w-12 h-12 rounded-xl object-cover mr-5 border border-gray-100 bg-gray-50 shadow-sm" />
                        {p.featured && <div className="absolute -top-2 -right-1 bg-gold w-4 h-4 rounded-full border-2 border-white shadow-sm"></div>}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-aqua-dark transition-colors">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{p.sku} • {p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{p.weight}kg</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${p.stock < 10 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => startEdit(p)} className="p-3 text-gray-400 hover:text-aqua-dark hover:bg-blue-50 rounded-xl transition-all"><Edit3 className="h-5 w-5" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- INVOICE MODULE ---

const InvoiceModule: React.FC<{ orders: Order[], products: Product[] }> = ({ orders, products }) => {
  const [isManual, setIsManual] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [manualForm, setManualForm] = useState({
    customerName: '',
    address: '',
    email: '',
    phone: '',
    notes: '',
    items: [{ name: '', quantity: 1, price: 0 }]
  });

  const filteredInventory = useMemo(() => {
    if (!inventorySearch) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
      p.sku.toLowerCase().includes(inventorySearch.toLowerCase())
    ).slice(0, 5);
  }, [inventorySearch, products]);

  const addFromInventory = (product: Product) => {
    const existing = manualForm.items.find(i => i.name === product.name);
    if (existing) {
      setManualForm({
        ...manualForm,
        items: manualForm.items.map(i => i.name === product.name ? { ...i, quantity: i.quantity + 1 } : i)
      });
    } else {
      if (manualForm.items.length === 1 && !manualForm.items[0].name) {
        setManualForm({
          ...manualForm,
          items: [{ name: product.name, quantity: 1, price: product.price }]
        });
      } else {
        setManualForm({
          ...manualForm,
          items: [...manualForm.items, { name: product.name, quantity: 1, price: product.price }]
        });
      }
    }
    setInventorySearch('');
  };

  const addItem = () => {
    setManualForm({
      ...manualForm,
      items: [...manualForm.items, { name: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (manualForm.items.length === 1) {
      setManualForm({...manualForm, items: [{name: '', quantity: 1, price: 0}]});
      return;
    }
    setManualForm({
      ...manualForm,
      items: manualForm.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...manualForm.items];
    (newItems[index] as any)[field] = value;
    setManualForm({ ...manualForm, items: newItems });
  };

  const subtotal = manualForm.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  const handleAction = (action: 'download' | 'print') => {
    if (!manualForm.customerName) {
      alert("Please enter customer name.");
      return;
    }
    
    const orderId = 'INV-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    const orderObj: Order = {
      id: orderId,
      customerName: manualForm.customerName,
      address: manualForm.address,
      email: manualForm.email,
      phone: manualForm.phone,
      items: manualForm.items.map(i => ({ 
        ...i, 
        id: i.name || 'manual-item', 
        sku: 'MANUAL', 
        category: 'Manual', 
        weight: 0, 
        stock: 0,
        description: '', 
        featured: false, 
        image: '' 
      } as any as CartItem)),
      subtotal: subtotal,
      tax: tax,
      shipping: 0,
      total: grandTotal,
      status: 'Delivered',
      date: new Date().toISOString()
    };
    
    const doc = generateInvoicePDF(orderObj);
    if (action === 'download') {
      doc.save(`MVS_Invoice_${orderId}.pdf`);
    } else {
      const blob = doc.output('bloburl');
      const win = window.open(blob.toString(), '_blank');
      if (win) win.print();
    }
  };

  return (
    <div className="p-10 space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-aqua-dark uppercase tracking-tighter mb-1">Billing Hub</h2>
          <p className="text-sm text-gray-500 font-medium">Compose, print and track customer invoices</p>
        </div>
        <button 
          onClick={() => setIsManual(!isManual)}
          className="bg-white text-gray-900 border border-gray-200 px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
        >
          {isManual ? 'View Logs' : 'Draft New Invoice'}
        </button>
      </div>

      {isManual ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10 bg-white p-10 border border-gray-100 rounded-3xl shadow-sm">
            <div>
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Client Identity</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Full Billing Name</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={manualForm.customerName} onChange={e => setManualForm({...manualForm, customerName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Primary Contact</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={manualForm.phone} onChange={e => setManualForm({...manualForm, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Email Address</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={manualForm.email} onChange={e => setManualForm({...manualForm, email: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Shipping/Billing Address</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-aqua-dark outline-none" value={manualForm.address} onChange={e => setManualForm({...manualForm, address: e.target.value})} />
                  </div>
               </div>
            </div>

            <div>
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Catalog Sync</h3>
               <div className="relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                 <input 
                  type="text" 
                  placeholder="Quick add from store inventory..." 
                  className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none text-xs font-bold rounded-2xl focus:ring-2 focus:ring-aqua-dark outline-none shadow-sm"
                  value={inventorySearch}
                  onChange={e => setInventorySearch(e.target.value)}
                 />
                 {filteredInventory.length > 0 && (
                   <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-100 shadow-2xl z-20 rounded-2xl overflow-hidden animate-fade-in">
                     {filteredInventory.map(p => (
                       <button 
                        key={p.id} 
                        onClick={() => addFromInventory(p)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-aqua-dark hover:text-white transition-all text-left border-b border-gray-50 last:border-0"
                       >
                         <div className="flex items-center">
                            <img src={p.image} className="w-10 h-10 object-cover rounded-lg mr-4 bg-gray-100 shadow-sm" />
                            <div>
                               <p className="text-xs font-bold">{p.name}</p>
                               <p className="text-[9px] opacity-70 uppercase font-black">{p.sku}</p>
                            </div>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-bold">₹{p.price}</p>
                           <p className="text-[9px] opacity-70">Stock: {p.stock}</p>
                         </div>
                       </button>
                     ))}
                   </div>
                 )}
               </div>
            </div>

            <div>
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Line Item Breakdown</h3>
                 <button onClick={addItem} className="text-[9px] font-black text-aqua-dark bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest flex items-center hover:bg-aqua-dark hover:text-white transition-all">
                   <PlusCircle className="h-3 w-3 mr-2" /> Custom Item
                 </button>
               </div>
               
               <div className="space-y-3">
                 {manualForm.items.map((item, idx) => (
                   <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-gray-50/50 p-2 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group">
                      <div className="col-span-6">
                        <input type="text" placeholder="Description" className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-aqua-dark shadow-sm" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <input type="number" className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-aqua-dark shadow-sm" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} />
                      </div>
                      <div className="col-span-2">
                        <input type="number" className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-aqua-dark shadow-sm" value={item.price} onChange={e => updateItem(idx, 'price', Number(e.target.value))} />
                      </div>
                      <div className="col-span-2 flex items-center justify-between pl-2">
                        <span className="text-[10px] font-black text-gray-400">₹{item.price * item.quantity}</span>
                        <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="h-4 w-4" /></button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-gray-900 text-white p-10 border border-gray-800 rounded-3xl shadow-2xl sticky top-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-10 text-aqua-light">Financial Summary</h3>
                <div className="space-y-6 mb-12">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                     <span>Subtotal</span>
                     <span className="text-white">₹{subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                     <span>GST (18%)</span>
                     <span className="text-white">₹{tax.toLocaleString()}</span>
                   </div>
                   <div className="pt-6 border-t border-gray-800">
                     <p className="text-[10px] font-black text-aqua-light uppercase tracking-widest mb-1">Total Payable</p>
                     <h3 className="text-4xl font-black text-white">₹{grandTotal.toLocaleString()}</h3>
                   </div>
                </div>

                <div className="space-y-4">
                   <button 
                    onClick={() => handleAction('print')}
                    className="w-full flex items-center justify-center bg-gray-800 text-white py-5 rounded-2xl hover:bg-gray-700 transition-all font-bold uppercase tracking-widest text-[10px] shadow-sm"
                   >
                      <Printer className="h-4 w-4 mr-3 text-gold" /> Preview & Print
                   </button>
                   <button 
                    onClick={() => handleAction('download')}
                    className="w-full flex items-center justify-center bg-aqua-dark text-white py-5 rounded-2xl hover:bg-black transition-all font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-aqua-dark/30"
                   >
                      <Download className="h-4 w-4 mr-3" /> Save Official PDF
                   </button>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center shadow-sm">
           <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <FileText className="h-10 w-10 text-gray-200" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">Billing Vault Empty</h3>
           <p className="text-gray-500 text-sm max-w-sm mx-auto mb-10 font-medium">Draft custom invoices for walk-in customers or direct WhatsApp orders.</p>
           <button 
            onClick={() => setIsManual(true)}
            className="bg-aqua-dark text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl shadow-aqua-dark/20"
           >
              Compose First Invoice
           </button>
        </div>
      )}
    </div>
  );
};
