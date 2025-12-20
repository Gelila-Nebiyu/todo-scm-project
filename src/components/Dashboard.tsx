
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
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskflow_todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

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
    const suggestions = await suggestTasks(todos.map(t => t.text));
    
    const newTodos: Todo[] = suggestions.map(text => ({
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    }));

    setTodos(prev => [...newTodos, ...prev]);
    setIsAIThinking(false);
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow <span className="text-indigo-600">Pro</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">AI Workspace</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">Administrator</span>
              <span className="text-xs text-green-500 font-medium flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                Active Now
              </span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory</span>
              <div className="bg-slate-50 p-1.5 rounded-lg text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-black text-slate-900">{todos.length}</p>
              <p className="text-sm font-medium text-slate-500">Tasks</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-green-100 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Success</span>
              <div className="bg-green-50 p-1.5 rounded-lg text-green-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-black text-green-600">{completedCount}</p>
              <p className="text-sm font-medium text-slate-500">Done</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Productivity</span>
              <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-black text-indigo-600">
                {todos.length ? Math.round((completedCount / todos.length) * 100) : 0}%
              </p>
              <p className="text-sm font-medium text-slate-500">Score</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xl shadow-slate-200/50 mb-10">
          <form onSubmit={handleAddTodo} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-transparent px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition-all flex items-center justify-center min-w-[140px]"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Today's Focus</h2>
            <p className="text-sm text-slate-500 font-medium">Manage your goals and optimize with AI</p>
          </div>
          <button
            onClick={handleAISuggest}
            disabled={isAIThinking}
            className={`group relative overflow-hidden flex items-center space-x-2 font-bold py-3.5 px-6 rounded-2xl transition-all ${
              isAIThinking 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${!isAIThinking && 'group-hover:animate-[shimmer_2s_infinite]'}`}></div>
            <svg className={`w-5 h-5 ${isAIThinking ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{isAIThinking ? 'Analyzing Context...' : 'AI Optimization'}</span>
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-24 bg-white border border-dashed border-slate-300 rounded-3xl">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Workspace Empty</h3>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">Your productivity board is currently empty. Add a task to begin your day.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {todos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={toggleTodo} 
                  onDelete={deleteTodo} 
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} TaskFlow Systems Inc.
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default Dashboard;
