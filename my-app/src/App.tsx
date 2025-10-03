import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from './context/theme-context';
import { UserProvider } from './context/user-context';
import { SellerProvider } from './context/seller-context';

function AppInner() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SellerProvider>
          <AppInner />
        </SellerProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
