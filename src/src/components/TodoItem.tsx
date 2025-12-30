
import React from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: number;
  dueDate?: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const getPriorityColor = (p: number) => {
    switch(p) {
      case 1: return 'border-[#db4c3f]';
      case 2: return 'border-[#eb8909]';
      case 3: return 'border-[#246fe0]';
      default: return 'border-gray-400';
    }
  };

  const getPriorityFill = (p: number) => {
    switch(p) {
      case 1: return 'bg-[#db4c3f]';
      case 2: return 'bg-[#eb8909]';
      case 3: return 'bg-[#246fe0]';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="group flex items-start py-3 border-b border-[#f0f0f0] animate-fade-in hover:bg-gray-50/30 px-2 -mx-2 rounded-md transition-all">
      <button 
        onClick={() => onToggle(todo.id)}
        className={`mt-1 flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 transition-all hover:bg-gray-100 ${getPriorityColor(todo.priority)} ${todo.completed ? getPriorityFill(todo.priority) : 'bg-transparent'}`}
      >
        {todo.completed && (
          <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`text-[14px] leading-snug transition-all break-words ${todo.completed ? 'line-through text-gray-400' : 'text-[#202020]'}`}>
            {todo.text}
          </p>
          <button 
            onClick={() => onDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-200 rounded text-gray-400 transition-all ml-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-2 mt-0.5">
          <span className="text-[11px] text-[#db4c3f] font-medium flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {todo.dueDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
