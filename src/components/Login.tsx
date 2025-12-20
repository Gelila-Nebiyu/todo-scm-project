
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
    setError('');
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      setError('Access Denied. Try admin / password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative background blurs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/30 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">TaskFlow <span className="text-indigo-400">Pro</span></h1>
            <p className="text-slate-400 font-medium mt-2 text-sm uppercase tracking-widest">Enterprise Command Center</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-semibold text-center animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Identity</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-600 font-medium"
                placeholder="Username"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Authorization</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-600 font-medium"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
            >
              Sign In to Workspace
            </button>
          </form>
        </div>
        <p className="text-center mt-8 text-slate-500 text-xs font-medium uppercase tracking-widest">
          Secured by Quantum-Ready Encryption
        </p>
      </div>
    </div>
  );
};

export default Login;
