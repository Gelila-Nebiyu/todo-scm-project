
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      setError('Invalid credentials (admin / password)');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 md:p-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-[#880D1E] rounded-lg mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">TaskFlow</h1>
          <p className="text-gray-500 text-sm mt-1">Please login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold py-2 px-3 rounded border border-red-100 text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-0.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#880D1E] focus:border-[#880D1E] transition-all text-gray-900 placeholder-gray-400"
              placeholder="e.g. admin"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-0.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#880D1E] focus:border-[#880D1E] transition-all text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#880D1E] hover:bg-[#6e0a18] text-white font-bold py-3 rounded transition-colors shadow-sm"
          >
            Log in
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">© 2025 TaskFlow Management</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
