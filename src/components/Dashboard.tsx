
import React, { useState, useEffect } from 'react';
import { Todo, ViewType, Priority } from '../types';
import TodoItem from './TodoItem';
import { suggestTasks } from '../services/geminiService';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.TODAY);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAIThinking, setIsAIThinking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse todos", e);
        setTodos([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
      dueDate: selectedDate,
      priority: 4,
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
    setIsAdding(false);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const getFilteredTodos = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    let filtered = [...todos];

    if (currentView === ViewType.TODAY) {
      filtered = filtered.filter(t => t.dueDate === todayStr);
    } else if (currentView === ViewType.UPCOMING) {
      filtered = filtered.filter(t => t.dueDate >= todayStr).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    }

    return filtered;
  };

  const renderCalendar = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`blank-${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <button 
          key={d} 
          onClick={() => { setSelectedDate(dateStr); setCurrentView(ViewType.UPCOMING); }}
          className={`w-7 h-7 flex items-center justify-center rounded-full text-[10px] transition-all hover:bg-gray-200 
            ${isSelected ? 'bg-[#db4c3f] text-white font-bold' : isToday ? 'text-[#db4c3f] font-bold underline' : 'text-gray-600'}`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Todoist Sidebar */}
      <aside className="w-[280px] bg-[#fafafa] border-r border-[#f0f0f0] flex flex-col pt-8 px-3 flex-shrink-0">
        <div className="px-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#db4c3f] rounded flex items-center justify-center shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-tight">TaskFlow Pro</span>
          </div>
          <button onClick={onLogout} className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-gray-200 rounded-md transition-all">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>

        <nav className="space-y-0.5">
          {[
            { id: ViewType.INBOX, label: 'Inbox', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4', color: 'text-blue-500' },
            { id: ViewType.TODAY, label: 'Today', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-green-600' },
            { id: ViewType.UPCOMING, label: 'Upcoming', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-purple-600' }
          ].map(view => (
            <button 
              key={view.id}
              onClick={() => setCurrentView(view.id)}
              className={`w-full flex items-center px-3 py-1.5 text-[14px] rounded-md transition-all ${currentView === view.id ? 'bg-[#eeeeee] font-semibold text-black' : 'text-[#444] hover:bg-[#eeeeee]'}`}
            >
              <svg className={`w-4 h-4 mr-3 ${view.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={view.icon} /></svg>
              {view.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 px-3 border-t border-gray-100 pt-6">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Calendar</h3>
          <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-gray-300 mb-2 text-center uppercase">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto pt-16 px-6 sm:px-12 md:px-24">
        <div className="max-w-3xl mx-auto">
          <header className="mb-6 flex items-baseline justify-between">
            <h1 className="text-[20px] font-bold text-[#202020]">
              {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
              {currentView === ViewType.TODAY && (
                <span className="ml-2 text-[12px] font-normal text-gray-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              )}
            </h1>
          </header>

          <div className="space-y-px">
            {getFilteredTodos().map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
            ))}
          </div>

          {!isAdding ? (
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-2 w-full flex items-center text-gray-400 hover:text-[#db4c3f] group transition-all py-2 text-left"
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[#db4c3f] group-hover:bg-[#db4c3f] group-hover:text-white transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              </span>
              <span className="text-[14px]">Add task</span>
            </button>
          ) : (
            <div className="mt-4 border border-gray-200 rounded-lg p-3 shadow-sm animate-slide-in">
              <input 
                autoFocus
                type="text"
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                className="w-full text-[14px] font-medium focus:outline-none mb-3 bg-transparent"
              />
              <div className="flex items-center justify-between">
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-[11px] border border-gray-100 rounded px-2 py-1 text-gray-500 focus:outline-none focus:border-gray-300"
                />
                <div className="flex space-x-2">
                  <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-[12px] font-bold bg-[#f3f3f3] hover:bg-[#e5e5e5] rounded text-[#444] transition-all">Cancel</button>
                  <button onClick={handleAddTodo} disabled={!inputValue.trim()} className={`px-3 py-1.5 text-[12px] font-bold rounded text-white transition-all shadow-sm ${!inputValue.trim() ? 'bg-[#eda59e]' : 'bg-[#db4c3f] hover:bg-[#c53d2e]'}`}>Add task</button>
                </div>
              </div>
            </div>
          )}

          {/* AI Helper - Gemini Integration */}
          <div className="fixed bottom-10 right-10">
            <button 
              onClick={async () => {
                setIsAIThinking(true);
                try {
                  const res = await suggestTasks(todos.map(t => t.text));
                  const news: Todo[] = res.map((txt, i) => ({
                    id: Date.now() + i,
                    text: txt,
                    completed: false,
                    createdAt: Date.now(),
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: 3
                  }));
                  setTodos(prev => [...news, ...prev]);
                } finally {
                  setIsAIThinking(false);
                }
              }}
              title="AI Task Suggestion"
              className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-2xl flex items-center justify-center text-[#db4c3f] hover:bg-gray-50 active:scale-90 transition-all"
            >
              <svg className={`w-5 h-5 ${isAIThinking ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
