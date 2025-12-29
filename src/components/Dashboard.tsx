import React, { useState, useEffect, useMemo } from 'react';
import { Todo, ViewType, Priority, Board } from '../types';
import TodoItem from './TodoItem';
import { suggestTasks } from '../services/geminiService';

interface DashboardProps {
  onLogout: () => void;
}

const DEFAULT_BOARDS: Board[] = [
  { id: 'personal', name: 'Personal', color: '#880D1E', icon: '👤' },
  { id: 'work', name: 'Work', color: '#246fe0', icon: '💼' },
  { id: 'school', name: 'School', color: '#7c3aed', icon: '🎓' },
  { id: 'goals', name: 'Goals', color: '#eb8909', icon: '🎯' },
];

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [boards] = useState<Board[]>(DEFAULT_BOARDS);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.TODAY);
  const [activeBoardId, setActiveBoardId] = useState<string>('personal');
  
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('Medium');
  const [targetBoardId, setTargetBoardId] = useState<string>('personal');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
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
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error(e);
        initializeSeedTasks();
      }
    } else {
      initializeSeedTasks();
    }
  }, []);

  const initializeSeedTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    const getFutureDate = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const seeds: Todo[] = [
      // TODAY - 5 Tasks
      { id: 1, text: "Finalize Work Presentation", completed: false, createdAt: Date.now(), dueDate: today, dueTime: "10:00", priority: "High", boardId: "work", description: "Review slides for the Q4 projection meeting." },
      { id: 2, text: "Submit School Lab Report", completed: false, createdAt: Date.now(), dueDate: today, dueTime: "23:59", priority: "High", boardId: "school", description: "Make sure to attach the data graphs." },
      { id: 3, text: "Personal: Gym Session", completed: false, createdAt: Date.now(), dueDate: today, dueTime: "18:00", priority: "Medium", boardId: "personal" },
      { id: 4, text: "Personal: Grocery Restock", completed: true, createdAt: Date.now(), dueDate: today, priority: "Low", boardId: "personal" },
      { id: 5, text: "Goals: 15-min Meditation", completed: false, createdAt: Date.now(), dueDate: today, priority: "Medium", boardId: "goals" },
      
      // UPCOMING - 12 Tasks
      { id: 6, text: "2025 Annual Master Goal: Complete Full-Stack Portfolio", completed: false, createdAt: Date.now(), dueDate: "2025-12-31", priority: "High", boardId: "goals", description: "The primary objective for this year. Must include 5 major projects." },
      { id: 7, text: "School: Midterm Exam Study", completed: false, createdAt: Date.now(), dueDate: getFutureDate(2), priority: "High", boardId: "school" },
      { id: 8, text: "Work: Team Performance Review", completed: false, createdAt: Date.now(), dueDate: getFutureDate(3), dueTime: "14:00", priority: "Medium", boardId: "work" },
      { id: 9, text: "Personal: Car Maintenance", completed: false, createdAt: Date.now(), dueDate: getFutureDate(5), priority: "Low", boardId: "personal" },
      { id: 10, text: "Goals: Finish reading 'Atomic Habits'", completed: false, createdAt: Date.now(), dueDate: getFutureDate(7), priority: "Medium", boardId: "goals" },
      { id: 11, text: "School: Group Project Meeting", completed: false, createdAt: Date.now(), dueDate: getFutureDate(1), dueTime: "16:30", priority: "Medium", boardId: "school" },
      { id: 12, text: "Work: Update Documentation", completed: false, createdAt: Date.now(), dueDate: getFutureDate(4), priority: "Low", boardId: "work" },
      { id: 13, text: "Personal: Visit Parents", completed: false, createdAt: Date.now(), dueDate: getFutureDate(10), priority: "Medium", boardId: "personal" },
      { id: 14, text: "School: Thesis Proposal Draft", completed: false, createdAt: Date.now(), dueDate: getFutureDate(14), priority: "High", boardId: "school" },
      { id: 15, text: "Goals: 5k Run Preparation", completed: false, createdAt: Date.now(), dueDate: getFutureDate(2), priority: "Medium", boardId: "goals" },
      { id: 16, text: "Work: Budget Planning", completed: false, createdAt: Date.now(), dueDate: getFutureDate(20), priority: "High", boardId: "work" },
      { id: 17, text: "School: History Quiz", completed: false, createdAt: Date.now(), dueDate: getFutureDate(4), priority: "Medium", boardId: "school" },
    ];
    setTodos(seeds);
    localStorage.setItem('todos', JSON.stringify(seeds));
  };

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      description: description.trim() || undefined,
      completed: false,
      createdAt: Date.now(),
      dueDate: selectedDate,
      dueTime: selectedTime || undefined,
      priority: selectedPriority,
      boardId: targetBoardId,
    };

    setTodos([newTodo, ...todos]);
    resetForm();
  };

  const resetForm = () => {
    setInputValue('');
    setDescription('');
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

  const filteredTodos = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let list = [...todos];

    if (searchQuery.trim()) {
      list = list.filter(t => 
        t.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (currentView === ViewType.TODAY) {
      list = list.filter(t => t.dueDate === todayStr);
    } else if (currentView === ViewType.UPCOMING) {
      list = list.filter(t => t.dueDate >= todayStr);
    } else if (currentView === ViewType.BOARD) {
      list = list.filter(t => t.boardId === activeBoardId);
    }

    list.sort((a, b) => {
      if (sortBy === 'date') {
        const dateCompare = a.dueDate.localeCompare(b.dueDate);
        if (dateCompare !== 0) return dateCompare;
        return (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59');
      } else {
        const pMap = { High: 0, Medium: 1, Low: 2 };
        return pMap[a.priority] - pMap[b.priority];
      }
    });

    return list;
  }, [todos, currentView, activeBoardId, searchQuery, sortBy]);

  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const handleSuggest = async () => {
    setIsAIThinking(true);
    try {
      const activeBoard = boards.find(b => b.id === activeBoardId);
      const res = await suggestTasks(todos.filter(t => t.boardId === activeBoardId).map(t => t.text));
      const news: Todo[] = res.map((txt, i) => ({
        id: Date.now() + i,
        text: txt,
        completed: false,
        createdAt: Date.now(),
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'Medium',
        boardId: activeBoardId
      }));
      setTodos(prev => [...news, ...prev]);
    } finally {
      setIsAIThinking(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-[#202020]">
      {/* Sidebar Overlay for Mobile */}
      {!isSidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black/10 z-40" onClick={() => setIsSidebarOpen(true)} />
      )}

      {/* Sidebar */}
      <aside 
        className={`h-full bg-[#fafafa] border-r border-[#f0f0f0] flex flex-col pt-6 transition-all duration-300 ease-in-out z-50
          ${isSidebarOpen ? 'w-[280px] opacity-100 px-4' : 'w-0 opacity-0 px-0 overflow-hidden pointer-events-none'}`}
      >
        <div className="flex items-center justify-between mb-8 px-2 min-w-[240px]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#880D1E] rounded flex items-center justify-center shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-[15px] whitespace-nowrap">TaskFlow Pro</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 p-1 hover:text-gray-900 transition-colors">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
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
            <svg className="w-4 h-4 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Upcoming
          </button>
        </nav>

        <div className="mt-8 min-w-[240px]">
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Boards</h3>
          </div>
          <div className="space-y-0.5">
            {boards.map(board => (
              <button 
                key={board.id}
                onClick={() => { setCurrentView(ViewType.BOARD); setActiveBoardId(board.id); setTargetBoardId(board.id); }}
                className={`w-full flex items-center px-3 py-2 text-[14px] rounded transition-colors ${currentView === ViewType.BOARD && activeBoardId === board.id ? 'bg-[#eeeeee] font-semibold text-black' : 'text-[#444] hover:bg-[#eeeeee]'}`}
              >
                <span className="mr-3 text-[12px]">{board.icon}</span>
                <span className="flex-1 text-left truncate">{board.name}</span>
                <span className="text-[10px] text-gray-400">{todos.filter(t => t.boardId === board.id && !t.completed).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pb-6 min-w-[240px]">
          <div className="px-3 mb-4">
             <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                   <span className="text-[10px] font-bold text-gray-400 uppercase">Mission Status</span>
                   <span className="text-[10px] font-bold text-[#880D1E]">{progressPercent}%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#880D1E] transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                </div>
             </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center px-3 py-2 text-[13px] text-gray-500 hover:text-[#880D1E] hover:bg-red-50 rounded transition-all">
            <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Revoke Access
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-[#f0f0f0] flex items-center px-4 md:px-8 bg-white/80 backdrop-blur-md z-30 sticky top-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors mr-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1 max-w-md relative hidden sm:block">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search active objectives..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-md text-sm transition-all focus:ring-0 text-[#202020]"
            />
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-[12px] bg-transparent border-none focus:ring-0 text-gray-500 font-bold cursor-pointer hover:text-black transition-colors"
            >
              <option value="date">Due Date</option>
              <option value="priority">Priority Rank</option>
            </select>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-12 lg:px-24 pt-10 pb-20 bg-white">
          <div className="max-w-3xl mx-auto">
            <header className="mb-6">
              <h1 className="text-[24px] font-extrabold text-[#202020] tracking-tight">
                {currentView === ViewType.BOARD 
                  ? boards.find(b => b.id === activeBoardId)?.name 
                  : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                <span className="ml-3 text-[12px] font-normal text-gray-400">
                  {filteredTodos.length} Objectives
                </span>
              </h1>
            </header>

            {(currentView === ViewType.BOARD || currentView === ViewType.TODAY) && (
              <div className="mb-8 p-4 bg-[#880D1E]/5 rounded-2xl border border-[#880D1E]/10 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[#880D1E]">Intelligent Assistance</h4>
                  <p className="text-[11px] text-[#880D1E]/70 font-medium">Gemini AI can optimize your workflow for this board.</p>
                </div>
                <button 
                  onClick={handleSuggest}
                  disabled={isAIThinking}
                  className="bg-[#880D1E] text-white px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-[#6e0a18] transition-all disabled:opacity-50 shadow-sm"
                >
                  {isAIThinking ? 'Analyzing...' : 'Suggest Optimizations'}
                </button>
              </div>
            )}

            <div className="space-y-px mb-8">
              {filteredTodos.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center animate-fade-in">
                  <div className="w-16 h-16 mb-4 text-gray-100">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M17.99 9l-1.41-1.42-6.59 6.59-3.58-3.57-1.41 1.41 4.99 5z"/></svg>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">All clear! No current tasks meet your criteria.</p>
                </div>
              ) : (
                filteredTodos.map(todo => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onToggle={toggleTodo} 
                    onDelete={deleteTodo} 
                  />
                ))
              )}
            </div>

            {!isAdding ? (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center text-gray-400 hover:text-[#880D1E] transition-colors py-3 group w-full text-left border-t border-gray-50"
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center mr-3 text-[#880D1E] group-hover:bg-[#880D1E] group-hover:text-white transition-all border border-[#880D1E]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <span className="text-[14px] font-bold">Initiate New Objective</span>
              </button>
            ) : (
              <div className="border border-gray-200 rounded-2xl p-6 shadow-xl animate-slide-in bg-white mb-10 ring-1 ring-black/5">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Task Name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full text-[16px] font-bold focus:outline-none mb-3 text-[#202020] bg-white border-b border-gray-100 pb-2 placeholder-gray-300"
                />
                <textarea 
                  placeholder="Contextual notes or sub-tasks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-[13px] text-[#202020] focus:outline-none bg-white mb-5 min-h-[60px] resize-none placeholder-gray-300"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5">Deadline</label>
                    <input 
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)} 
                      className="text-[12px] border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#202020] focus:ring-1 focus:ring-[#880D1E] outline-none" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5">Time Frame</label>
                    <input 
                      type="time" 
                      value={selectedTime} 
                      onChange={(e) => setSelectedTime(e.target.value)} 
                      className="text-[12px] border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#202020] focus:ring-1 focus:ring-[#880D1E] outline-none" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5">Priority</label>
                    <select 
                      value={selectedPriority} 
                      onChange={(e) => setSelectedPriority(e.target.value as Priority)} 
                      className="text-[12px] border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#202020] focus:ring-1 focus:ring-[#880D1E] outline-none"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5">Board</label>
                    <select 
                      value={targetBoardId} 
                      onChange={(e) => setTargetBoardId(e.target.value)} 
                      className="text-[12px] border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#202020] focus:ring-1 focus:ring-[#880D1E] outline-none"
                    >
                      {boards.map(b => <option key={b.id} value={b.id}>{b.icon} {b.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-50">
                  <button 
                    onClick={resetForm}
                    className="px-5 py-2 text-[13px] font-bold bg-[#f3f3f3] hover:bg-[#e5e5e5] rounded-xl text-[#444] transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleAddTodo}
                    disabled={!inputValue.trim()}
                    className={`px-6 py-2 text-[13px] font-bold rounded-xl text-white transition-all shadow-md ${!inputValue.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#880D1E] hover:bg-[#6e0a18]'}`}
                  >
                    Execute Objective
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;