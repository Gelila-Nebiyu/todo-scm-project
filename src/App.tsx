
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthStatus } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for authenticated state using the key 'authenticated'
    const authFlag = localStorage.getItem('authenticated');
    if (authFlag === 'true') {
      setIsAuthenticated(true);
    }
    
    // Smooth loading transition
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Only remove auth status, todos persist in 'backend'
    localStorage.removeItem('authenticated');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="w-12 h-12 border-4 border-[#db4c3f] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading Workspace</p>
      </div>
    );
  }

  return (
    <div className="antialiased font-sans">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
