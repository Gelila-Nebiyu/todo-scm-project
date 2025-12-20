
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthStatus } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const authFlag = localStorage.getItem('taskflow_auth');
    if (authFlag === AuthStatus.AUTHENTICATED) {
      setIsAuthenticated(true);
    }
    // Artificial delay for smoother entrance
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('taskflow_auth', AuthStatus.AUTHENTICATED);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('taskflow_auth');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl animate-bounce shadow-2xl shadow-indigo-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full blur-sm" />
        </div>
        <p className="text-slate-400 font-bold tracking-widest text-xs uppercase animate-pulse">Initializing System...</p>
      </div>
    );
  }

  return (
    <div className="antialiased font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
