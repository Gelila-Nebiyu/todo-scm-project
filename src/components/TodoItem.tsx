import React from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = todo.dueDate && todo.dueDate < todayStr && !todo.completed;

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return '#880D1E';
      case 'Medium': return '#eb8909';
      case 'Low': return '#246fe0';
      default: return '#808080';
    }
  };

  const priorityStyles = {
    High: "bg-red-50 text-[#880D1E] border-red-100",
    Medium: "bg-yellow-50 text-yellow-700 border-yellow-100",
    Low: "bg-blue-50 text-blue-700 border-blue-100"
  };

  return (
    <div className="group flex items-start py-3.5 border-b border-[#f3f3f3] animate-fade-in hover:bg-gray-50/50 px-2 -mx-2 rounded transition-all">
      <button 
        onClick={() => onToggle(todo.id)}
        style={{ borderColor: getPriorityColor(todo.priority) }}
        className={`mt-1 flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 transition-all hover:bg-gray-100 flex items-center justify-center ${todo.completed ? 'bg-gray-400 border-gray-400' : 'bg-transparent'}`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className={`text-[14px] leading-snug transition-all break-words ${todo.completed ? 'line-through text-gray-400' : 'text-[#202020] font-medium'}`}>
              {todo.text}
            </p>
            <div className="flex items-center space-x-3 mt-1.5 flex-wrap">
               <span className={`text-[11px] font-medium flex items-center ${isOverdue ? 'text-red-600 font-bold' : 'text-[#880D1E]'}`}>
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {todo.dueDate === todayStr ? 'Today' : todo.dueDate}
                {todo.dueTime && <span className="ml-1 opacity-70">at {todo.dueTime}</span>}
                {isOverdue && <span className="ml-2 uppercase text-[9px]">● Overdue</span>}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${priorityStyles[todo.priority]}`}>
                {todo.priority}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-gray-400 transition-all ml-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;