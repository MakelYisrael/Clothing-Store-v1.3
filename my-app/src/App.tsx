import React, { useMemo } from 'react';
import './App.css';
import { ThemeProvider, useTheme } from './context/theme-context';
import { UserProvider, useUser } from './context/user-context';
import { SellerProvider, useSeller } from './context/seller-context';
import { Toaster, toast } from 'sonner';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useUser();
  const { products, isSellerMode, setIsSellerMode } = useSeller();

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const availableColors = useMemo(() => {
    const allColors = products.reduce<string[]>((acc, p) => acc.concat(p.availableColors || []), []);
    return Array.from(new Set(allColors));
  }, [products]);

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20 }}>JHF Demo Store</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleTheme}>Theme: {theme}</button>
          <button onClick={() => setIsSellerMode(!isSellerMode)}>Mode: {isSellerMode ? 'Seller' : 'Buyer'}</button>
          {user ? (
            <button onClick={() => { logout(); toast.success('Logged out'); }}>Logout ({user.email})</button>
          ) : (
            <button onClick={async () => {
              const ok = await login('demo@jhf.com', 'demo123');
              toast[ok ? 'success' : 'error'](ok ? 'Logged in' : 'Login failed');
            }}>Login Demo</button>
          )}
        </div>
      </header>

      <section style={{ marginBottom: 16 }}>
        <div>Products: {products.length}</div>
        <div>Categories: {categories.join(', ') || '—'}</div>
        <div>Available colors: {availableColors.join(', ') || '—'}</div>
      </section>

      <section>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Catalog</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {products.map(p => (
            <div key={p.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
              <div style={{ color: '#6b7280', marginBottom: 4 }}>{p.category}</div>
              <div style={{ marginBottom: 8 }}>${p.price.toFixed(2)}{p.originalPrice ? (
                <span style={{ color: '#6b7280', textDecoration: 'line-through', marginLeft: 6 }}>${p.originalPrice.toFixed(2)}</span>
              ) : null}</div>
              <button onClick={() => toast.success(`${p.name} selected`)}>Quick Action</button>
            </div>
          ))}
        </div>
      </section>
      <Toaster richColors />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SellerProvider>
          <AppContent />
        </SellerProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
