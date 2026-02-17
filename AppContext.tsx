
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User as AppUser } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { db, auth, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AppContextType {
  products: Product[];
  setProducts: (products: Product[]) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  user: AppUser | null;
  localLogin: (user: AppUser) => void;
  logout: () => Promise<void>;
  loading: boolean;
  isOnline: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProductsState] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mvs_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Products
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProductsState(prods.length > 0 ? prods : INITIAL_PRODUCTS);
        setLoading(false);
      }, (err) => {
        console.error("Firestore sync error:", err);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const savedProds = localStorage.getItem('mvs_products');
      setProductsState(savedProds ? JSON.parse(savedProds) : INITIAL_PRODUCTS);
      setLoading(false);
    }
  }, []);

  // Sync Orders
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(ords);
      }, (err) => console.error("Order sync error:", err));
      return () => unsubscribe();
    } else {
      const savedOrders = localStorage.getItem('mvs_orders');
      setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    }
  }, []);

  // Sync Auth State - Only if auth is validly initialized
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setUser({ id: fbUser.uid, email: fbUser.email || '', isAdmin: true });
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('mvs_cart', JSON.stringify(cart));
    if (!isFirebaseConfigured) {
      localStorage.setItem('mvs_products', JSON.stringify(products));
      localStorage.setItem('mvs_orders', JSON.stringify(orders));
    }
  }, [cart, products, orders]);

  const setProducts = async (newProducts: Product[]) => {
    setProductsState(newProducts);
    if (isFirebaseConfigured && db) {
      for (const prod of newProducts) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const addOrder = async (order: Order) => {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'orders', order.id), order);
    } else {
      setOrders(prev => [order, ...prev]);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const localLogin = (userData: AppUser) => {
    setUser(userData);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      products, setProducts, cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      orders, addOrder, updateOrderStatus, user, logout, loading, localLogin,
      isOnline: isFirebaseConfigured
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
