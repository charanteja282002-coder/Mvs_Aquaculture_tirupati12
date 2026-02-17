
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  weight: number;
  stock: number;
  description: string;
  image: string;
  featured: boolean;
}

export type Category = string;

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}
