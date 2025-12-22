document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Guard
    const authState = localStorage.getItem('authenticated');
    if (authState !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // 2. State Initialization
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoList = document.getElementById('todo-list');
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // 3. Render Function
    const render = () => {
        todoList.innerHTML = '';

        if (todos.length === 0) {
            todoList.innerHTML = `
                <div class="text-center py-20 bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                    <div class="text-slate-300 mb-4">
                        <svg class="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-400">No tasks yet. Add one!</h3>
                </div>
            `;
            return;
        }

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `group flex items-center justify-between p-6 bg-white border rounded-[2rem] transition-all duration-500 ${
                todo.completed ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100 hover:border-indigo-200 hover:shadow-xl'
            }`;
            
            li.innerHTML = `
                <div class="flex items-center space-x-6 flex-1">
                    <button class="toggle-btn w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                        todo.completed ? 'bg-emerald-500 border-emerald-500 shadow-lg' : 'border-slate-200 hover:border-indigo-500 bg-white'
                    }" data-id="${todo.id}">
                        ${todo.completed ? '<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7" /></svg>' : ''}
                    </button>
                    <span class="text-lg font-bold tracking-tight transition-all duration-500 ${
                        todo.completed ? 'line-through text-slate-300 font-semibold' : 'text-slate-800'
                    }">${todo.text}</span>
                </div>
                <button class="delete-btn text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-3 hover:bg-red-50 rounded-2xl" data-id="${todo.id}">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            `;
            todoList.appendChild(li);
        });
    };

    // 4. Persistence
    const save = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
        render();
    };

    // 5. Action Handlers
    const addTodo = () => {
        const text = todoInput.value.trim();
        if (!text) return;
        todos.unshift({ id: Date.now(), text, completed: false });
        todoInput.value = '';
        save();
    };

    // 6. Event Listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });

    todoList.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.toggle-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        

        if (toggleBtn) {
            const id = parseInt(toggleBtn.dataset.id);
            todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
            save();
        }

        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            todos = todos.filter(t => t.id !== id);
            save();
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authenticated');
        window.location.href = 'index.html';
    });

    // Initial load
    render();
});

