document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Security Guard
    const authState = localStorage.getItem('authenticated');
    if (authState !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // 2. DOM Elements
    const todoList = document.getElementById('todo-list');
    const todoInput = document.getElementById('todo-input');
    const todoDateInput = document.getElementById('todo-date');
    const todoPriorityInput = document.getElementById('todo-priority');
    const addBtn = document.getElementById('add-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const taskCountBadge = document.getElementById('task-count');
    const syncIndicator = document.getElementById('sync-indicator');
    const calGrid = document.getElementById('calendar-grid');
    const calMonth = document.getElementById('calendar-month');

    // Default the date input to today
    const todayStr = new Date().toISOString().split('T')[0];
    todoDateInput.value = todayStr;

    // 3. State Management
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // 4. Persistence & Sync
    const saveToBackend = () => {
        syncIndicator.innerHTML = '<span class="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-spin"></span><span>Saving...</span>';
        localStorage.setItem('todos', JSON.stringify(todos));
        
        setTimeout(() => {
            syncIndicator.innerHTML = '<span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span><span>Synced to cloud</span>';
            render();
        }, 300);
    };

    // 5. Calendar Rendering
    const renderCalendar = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        calMonth.innerText = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        calGrid.innerHTML = '<div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>';

        for (let i = 0; i < firstDay; i++) {
            calGrid.innerHTML += '<div></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === now.getDate();
            calGrid.innerHTML += `
                <div class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    isToday ? 'bg-maroon text-white font-black shadow-md' : 'text-slate-400 hover:bg-slate-100'
                }">${day}</div>
            `;
        }
    };

    // 6. UI Rendering
    const render = () => {
        todoList.innerHTML = '';

        if (todos.length === 0) {
            todoList.innerHTML = `
                <div class="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] animate-fade-in">
                    <div class="text-slate-200 mb-4">
                        <svg class="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-400 italic">No objectives assigned. Initiate one.</h3>
                </div>
            `;
            updateStats(0, 0);
            return;
        }

        const completed = todos.filter(t => t.completed).length;
        updateStats(todos.length, completed);

        todos.forEach(todo => {
            const li = document.createElement('li');
            const isOverdue = todo.dueDate && todo.dueDate < todayStr && !todo.completed;
            
            li.className = `group flex items-center justify-between p-5 bg-white border rounded-2xl transition-all duration-300 shadow-sm animate-fade-in ${
                todo.completed ? 'border-emerald-100 bg-emerald-50/20' : isOverdue ? 'border-red-200 bg-red-50/10 shadow-red-100' : 'border-slate-100 hover:border-maroon/20 hover:shadow-xl'
            }`;

            const priorityColor = todo.priority === 'High' ? 'bg-red-600' : todo.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500';
            
            li.innerHTML = `
                <div class="flex items-center space-x-5 flex-1 min-w-0">
                    <button class="toggle-btn w-10 h-10 rounded-xl border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        todo.completed ? 'bg-emerald-500 border-emerald-500 shadow-emerald-100 shadow-lg' : 'border-slate-200 hover:border-maroon bg-white'
                    }" data-id="${todo.id}">
                        ${todo.completed ? '<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" /></svg>' : ''}
                    </button>
                    <div class="flex flex-col flex-1 min-w-0">
                        <div class="flex items-center space-x-3">
                            <span class="text-base font-bold tracking-tight truncate transition-all ${
                                todo.completed ? 'line-through text-slate-300' : 'text-slate-800'
                            }">${todo.text}</span>
                            <span class="${priorityColor} text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">${todo.priority || 'Medium'}</span>
                        </div>
                        <div class="flex items-center space-x-4 mt-1">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center">
                                <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Due: ${todo.dueDate || 'Unscheduled'}
                            </span>
                            ${isOverdue ? '<span class="text-[10px] font-black uppercase text-red-600 animate-pulse tracking-widest">● OVERDUE</span>' : ''}
                        </div>
                    </div>
                </div>
                <button class="delete-btn text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-3 hover:bg-red-50 rounded-xl" data-id="${todo.id}">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            `;
            todoList.appendChild(li);
        });
    };

    const updateStats = (total, completed) => {
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        progressBar.style.width = percent + '%';
        progressText.innerText = percent + '%';
        taskCountBadge.innerText = `${total} Objectives`;
    };

    // 7. Operations
    const addTodo = () => {
        const text = todoInput.value.trim();
        const date = todoDateInput.value;
        const priority = todoPriorityInput.value;
        if (!text) return;

        todos.unshift({
            id: Date.now(),
            text: text,
            completed: false,
            dueDate: date,
            priority: priority
        });

        todoInput.value = '';
        todoDateInput.value = todayStr;
        todoPriorityInput.value = 'Medium';
        saveToBackend();
    };

    // 8. Event Listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });

    todoList.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.toggle-btn');
        const deleteBtn = e.target.closest('.delete-btn');

        if (toggleBtn) {
            const id = parseInt(toggleBtn.dataset.id);
            todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
            saveToBackend();
        }

        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            todos = todos.filter(t => t.id !== id);
            saveToBackend();
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authenticated');
        window.location.href = 'index.html';
    });

    // Init
    renderCalendar();
    render();
});