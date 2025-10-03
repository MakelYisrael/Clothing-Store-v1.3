import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinedDate: string;
  isSeller?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  shippingAddress: {
    name?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

interface UserContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  updateUserProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'demo@jhf.com',
    password: 'demo123',
    name: 'Demo User',
    joinedDate: '2024-01-15',
    isSeller: false
  },
  {
    id: '2',
    email: 'seller@jhf.com',
    password: 'seller123',
    name: 'Seller Account',
    joinedDate: '2024-01-10',
    isSeller: true
  }
];

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-12-15',
    status: 'delivered',
    items: [
      {
        id: '1',
        name: 'Classic White T-Shirt',
        price: 29.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1603252110971-b8a57087be18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXN1YWwlMjBzaGlydHxlbnwxfHx8fDE3NTkwOTA0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ],
    total: 59.98,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    trackingNumber: 'TRK123456789US',
    carrier: 'FedEx',
    estimatedDelivery: 'December 18, 2024'
  },
  {
    id: 'ORD-002',
    date: '2024-12-20',
    status: 'shipped',
    items: [
      {
        id: '3',
        name: 'Premium Denim Jeans',
        price: 79.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5MTUxNDE1fDA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ],
    total: 79.99,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    trackingNumber: 'TRK987654321US',
    carrier: 'UPS',
    estimatedDelivery: 'January 5, 2025'
  }
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    if (mockUser) {
      const { password: _, ...userWithoutPassword } = mockUser as any;
      setUser(userWithoutPassword);
      setOrders(mockOrders);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock signup
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    setOrders([]);
    return true;
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateUserProfile = (updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      orders,
      login,
      signup,
      logout,
      addOrder,
      updateUserProfile
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
