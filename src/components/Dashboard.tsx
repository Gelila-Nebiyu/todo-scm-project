
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
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('Medium');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
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
      dueTime: selectedTime || undefined,
      priority: selectedPriority,
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
    setSelectedPriority('Medium');
    setSelectedTime('');
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
      filtered = filtered.filter(t => t.dueDate >= todayStr).sort((a, b) => {
        const dateCompare = a.dueDate.localeCompare(b.dueDate);
        if (dateCompare !== 0) return dateCompare;
        return (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59');
      });
    }

    return filtered;
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar - Side by side behavior */}
      <aside 
        className={`h-full bg-[#fafafa] border-r border-[#f0f0f0] flex flex-col pt-8 transition-all duration-300 ease-in-out z-40
          ${isSidebarOpen ? 'w-[280px] opacity-100 px-4' : 'w-0 opacity-0 px-0 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between mb-8 px-2 min-w-[240px]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#880D1E] rounded flex items-center justify-center shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-[15px] whitespace-nowrap">TaskFlow</span>
          </div>
        </div>

        <nav className="space-y-0.5 min-w-[240px]">
          <button 
            onClick={() => setCurrentView(ViewType.INBOX)}
            className={`w-full flex items-center px-3 py-2 text-[14px] rounded transition-colors ${currentView === ViewType.INBOX ? 'bg-[#eeeeee] font-semibold text-black' : 'text-[#444] hover:bg-[#eeeeee]'}`}
          >
            <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            Inbox
          </button>
          <button 
            onClick={() => setCurrentView(ViewType.TODAY)}
            className={`w-full flex items-center px-3 py-2 text-[14px] rounded transition-colors ${currentView === ViewType.TODAY ? 'bg-[#eeeeee] font-semibold text-black' : 'text-[#444] hover:bg-[#eeeeee]'}`}
          >
            <svg className="w-4 h-4 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Today
          </button>
          <button 
            onClick={() => setCurrentView(ViewType.UPCOMING)}
            className={`w-full flex items-center px-3 py-2 text-[14px] rounded transition-colors ${currentView === ViewType.UPCOMING ? 'bg-[#eeeeee] font-semibold text-black' : 'text-[#444] hover:bg-[#eeeeee]'}`}
          >
            <svg className="w-4 h-4 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Upcoming
          </button>
        </nav>

        <div className="mt-auto pb-6 px-2 min-w-[240px]">
          <button onClick={onLogout} className="w-full flex items-center px-3 py-2 text-[13px] text-gray-500 hover:text-[#880D1E] hover:bg-red-50 rounded transition-all">
            <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-[#f0f0f0] flex items-center px-4 md:px-6 bg-white z-30 sticky top-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded hover:bg-gray-100 text-gray-500 transition-colors mr-3"
            aria-label="Toggle Sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-[14px] font-bold text-gray-800">TaskFlow Workspace</div>
        </header>

        <main className="flex-1 overflow-y-auto main-content">
          <div className="max-w-3xl mx-auto">
            <header className="mb-6">
              <h1 className="flex items-baseline">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                {currentView === ViewType.TODAY && (
                  <span className="ml-2 text-[12px] font-normal text-gray-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                )}
              </h1>
            </header>

            <div className="space-y-px mb-8">
              {getFilteredTodos().length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center animate-fade-in">
                  <div className="w-32 h-32 mb-4 opacity-5 text-gray-900">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M17.99 9l-1.41-1.42-6.59 6.59-3.58-3.57-1.41 1.41 4.99 5z"/></svg>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Keep it up! Your task list is empty.</p>
                </div>
              ) : (
                getFilteredTodos().map(todo => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onToggle={toggleTodo} 
                    onDelete={deleteTodo} 
                  />
                ))
              )}
            </div>

            {/* Inline Task Add Button */}
            {!isAdding ? (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center text-gray-400 hover:text-[#880D1E] transition-colors py-2 group w-full text-left"
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[#880D1E] group-hover:bg-[#880D1E] group-hover:text-white transition-all border border-[#880D1E]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <span className="text-[14px] font-medium">Add task</span>
              </button>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm animate-slide-in bg-white mb-10">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Task name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                  className="w-full text-[14px] font-semibold focus:outline-none mb-4 text-[#202020] bg-white border-b border-gray-100 pb-2"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Due Date</label>
                    <input 
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="text-[12px] border border-gray-200 rounded px-2 py-1.5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Due Time</label>
                    <input 
                      type="time" 
                      value={selectedTime} 
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="text-[12px] border border-gray-200 rounded px-2 py-1.5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Priority</label>
                    <select 
                      value={selectedPriority} 
                      onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                      className="text-[12px] border border-gray-200 rounded px-2 py-1.5 bg-white"
                    >
                      <option value="Low">Low (P3)</option>
                      <option value="Medium">Medium (P2)</option>
                      <option value="High">High (P1)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-gray-50">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-1.5 text-[12px] font-bold bg-[#f3f3f3] hover:bg-[#e5e5e5] rounded text-[#444]"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddTodo}
                    disabled={!inputValue.trim()}
                    className={`px-4 py-1.5 text-[12px] font-bold rounded text-white transition-all ${!inputValue.trim() ? 'bg-red-200 cursor-not-allowed' : 'bg-[#880D1E] hover:bg-[#6e0a18]'}`}
                  >
                    Add task
                  </button>
                </div>
              </div>
            )}

            {/* AI Suggestion */}
            <div className="mt-12 pt-8 border-t border-gray-100 pb-10">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Productivity Engine</h3>
                    <p className="text-[11px] text-gray-400 mt-1">Simulated intelligence powered by Gemini</p>
                  </div>
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
                          priority: 'Medium'
                        }));
                        setTodos(prev => [...news, ...prev]);
                      } finally {
                        setIsAIThinking(false);
                      }
                    }}
                    disabled={isAIThinking}
                    className="w-full sm:w-auto px-4 py-2 border border-[#880D1E] text-[#880D1E] rounded-md text-[11px] font-bold hover:bg-red-50 transition-all flex items-center justify-center"
                  >
                    {isAIThinking ? (
                      <><svg className="w-3 h-3 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>Thinking...</>
                    ) : (
                      <><svg className="w-3.5 h-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Suggest Optimizations</>
                    )}
                  </button>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
