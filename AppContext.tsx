
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
  deleteDoc,
  query, 
  orderBy,
  QuerySnapshot,
  DocumentData,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AppContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
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
  const [products, setProductsState] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mvs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Core Sync Effect - Products
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (isFirebaseConfigured && db) {
      const productsRef = collection(db, 'products');
      
      // Real-time listener: This triggers for ALL browsers when anyone updates data
      unsubscribe = onSnapshot(productsRef, (snapshot: QuerySnapshot<DocumentData>) => {
        const prods = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
        
        if (prods.length > 0) {
          setProductsState(prods);
        } else {
          // One-time seed for empty cloud databases
          console.log("MVS Aqua: Seeding initial catalog to cloud...");
          INITIAL_PRODUCTS.forEach(p => setDoc(doc(db!, 'products', p.id), p));
        }
        setLoading(false);
      }, (err) => {
        console.warn("Firestore sync error:", err);
        setLoading(false);
      });
    } else {
      const savedProds = localStorage.getItem('mvs_products');
      if (savedProds) {
        try { setProductsState(JSON.parse(savedProds)); } catch (e) {}
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Core Sync Effect - Orders
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (isFirebaseConfigured && db) {
      const ordersRef = query(collection(db, 'orders'), orderBy('date', 'desc'));
      unsubscribe = onSnapshot(ordersRef, (snapshot: QuerySnapshot<DocumentData>) => {
        const ords = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
        setOrders(ords);
      }, (err) => console.warn("Order sync error:", err));
    } else {
      const savedOrders = localStorage.getItem('mvs_orders');
      if (savedOrders) {
        try { setOrders(JSON.parse(savedOrders)); } catch (e) {}
      }
    }

    return () => unsubscribe();
  }, []);

  // Auth Listener
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

  // Local Persist for fallback
  useEffect(() => {
    localStorage.setItem('mvs_cart', JSON.stringify(cart));
    if (!isFirebaseConfigured) {
      localStorage.setItem('mvs_products', JSON.stringify(products));
      localStorage.setItem('mvs_orders', JSON.stringify(orders));
    }
  }, [cart, products, orders]);

  // Persistent Actions
  const addProduct = async (product: Product) => {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'products', product.id), product);
    } else {
      setProductsState(prev => [...prev, product]);
    }
  };

  const updateProduct = async (product: Product) => {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'products', product.id), { ...product });
    } else {
      setProductsState(prev => prev.map(p => p.id === product.id ? product : p));
    }
  };

  const removeProduct = async (productId: string) => {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'products', productId));
    } else {
      setProductsState(prev => prev.filter(p => p.id !== productId));
    }
  };

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
      try {
        await setDoc(doc(db, 'orders', order.id), order);
        // Deduct stock globally when order is placed
        for (const item of order.items) {
          const product = products.find(p => p.id === item.id);
          if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            await updateDoc(doc(db, 'products', product.id), { stock: newStock });
          }
        }
      } catch (e) {
        console.error("Order sync failed:", e);
        setOrders(prev => [order, ...prev]);
      }
    } else {
      setOrders(prev => [order, ...prev]);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { status });
      } catch (e) {}
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const localLogin = (userData: AppUser) => {
    setUser(userData);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try { await signOut(auth); } catch (e) {}
    }
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      products, addProduct, updateProduct, removeProduct, setProducts, cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
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
