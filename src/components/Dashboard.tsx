
import React, { useState, useEffect } from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';
import { suggestTasks } from '../services/geminiService';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('taskflow_todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('taskflow_todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    const newTodo: Todo = { id: crypto.randomUUID(), text: inputValue.trim(), completed: false, createdAt: Date.now() };
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleAISuggest = async () => {
    setIsAIThinking(true);
    try {
      const suggestions = await suggestTasks(todos.map(t => t.text));
      const newTodos: Todo[] = suggestions.map(text => ({
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
      }));
      setTodos(prev => [...newTodos, ...prev]);
    } finally {
      setIsAIThinking(false);
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <nav className="glass sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">TaskFlow <span className="text-indigo-600">Pro</span></span>
          </div>
          <button onClick={onLogout} className="text-xs font-extrabold text-slate-400 hover:text-red-500 transition-colors tracking-widest uppercase">
            Exit Session
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {/* Modern Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 leading-none">{todos.length}</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">Pending</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-600 leading-none">{completedCount}</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">Completed</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-600 leading-none">{progress}%</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">Efficiency</p>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl shadow-indigo-900/10 mb-10 border border-white/5 flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleAddTodo} className="flex-1 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Deploy a new objective..."
              className="w-full bg-transparent px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none font-medium text-lg"
            />
          </form>
          <div className="flex gap-2 p-1">
            <button
              onClick={() => handleAddTodo()}
              className="bg-white text-slate-900 px-8 py-4 rounded-[1.75rem] font-bold hover:bg-slate-200 transition-all active:scale-95"
            >
              Add
            </button>
            <button
              onClick={handleAISuggest}
              disabled={isAIThinking}
              className={`px-8 py-4 rounded-[1.75rem] font-bold text-white transition-all flex items-center space-x-2 ${
                isAIThinking ? 'bg-indigo-900/50 text-indigo-400' : 'animate-shimmer hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/20'
              }`}
            >
              <svg className={`w-4 h-4 ${isAIThinking ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{isAIThinking ? 'Optimizing' : 'AI Boost'}</span>
            </button>
          </div>
        </div>

        {/* Task Feed */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-20 bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem]">
              <div className="text-slate-300 mb-4">
                 <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-400">Neutral Workspace</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Awaiting your first directive.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/50 backdrop-blur-md py-4 text-center text-slate-400 text-[10px] font-bold tracking-widest uppercase border-t border-slate-100">
        TaskFlow PRO Version 2.0 &bull; Secure AI Node Enabled
      </footer>
    </div>
  );
};

export default Dashboard;
