
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-[#db4c3f] rounded-2xl shadow-xl shadow-red-200 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-[#202020] tracking-tight mb-2">TaskFlow Pro</h1>
          <p className="text-gray-500 font-medium text-sm">Organize your life. Achieve your goals.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="bg-red-50 text-red-500 text-xs font-bold py-3 px-4 rounded-lg border border-red-100 text-center">{error}</p>}
          
          <input
            type="text"
            placeholder="Identity (admin)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#db4c3f] transition-all font-medium text-[14px]"
            required
          />
          
          <input
            type="password"
            placeholder="Authorization (password)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#db4c3f] transition-all font-medium text-[14px]"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#db4c3f] hover:bg-[#c53d2e] text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            Log in
          </button>
        </form>

        <div className="mt-12 text-center text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em]">
          Secured Enterprise Node 01
        </div>
      </div>
    </div>
  );
};

export default Login;
