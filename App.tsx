
import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { Product } from './types';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'about' | 'contact' | 'cart' | 'checkout' | 'admin' | 'product-detail'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user } = useApp();

  const handleNavigate = (page: any, data?: any) => {
    if (page === 'product-detail' && data) {
      setSelectedProduct(data);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={handleNavigate} />;
      case 'shop': return <ShopPage onNavigate={handleNavigate} />;
      case 'product-detail': return <ProductDetailPage product={selectedProduct} onNavigate={handleNavigate} />;
      case 'cart': return <CartPage onNavigate={handleNavigate} />;
      case 'checkout': return <CheckoutPage onNavigate={handleNavigate} />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage onNavigate={handleNavigate} />;
      case 'admin': 
        return user ? <AdminLayout onLogout={() => handleNavigate('home')} /> : <AdminLogin onLogin={() => handleNavigate('admin')} />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {currentPage !== 'admin' && <Navbar onNavigate={handleNavigate} />}
      <main className="flex-grow">
        {renderPage()}
      </main>
      {currentPage !== 'admin' && <Footer onNavigate={handleNavigate} />}
      {currentPage !== 'admin' && <ChatBot />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
