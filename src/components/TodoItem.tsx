
import React, { useState } from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div className={`group flex flex-col py-4 border-b border-[#f3f3f3] animate-fade-in hover:bg-gray-50/50 px-3 -mx-3 rounded-xl transition-all ${isExpanded ? 'bg-white shadow-sm ring-1 ring-black/5 my-2' : ''}`}>
      <div className="flex items-start">
        <button 
          onClick={() => onToggle(todo.id)}
          style={{ borderColor: getPriorityColor(todo.priority) }}
          className={`mt-1 flex-shrink-0 w-[20px] h-[20px] rounded-full border-2 transition-all hover:bg-gray-100 flex items-center justify-center ${todo.completed ? 'bg-gray-400 border-gray-400' : 'bg-transparent'}`}
        >
          {todo.completed && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <div className="ml-4 flex-1 min-w-0" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className={`text-[15px] leading-snug cursor-pointer transition-all break-words ${todo.completed ? 'line-through text-gray-400 font-normal' : 'text-[#202020] font-semibold'}`}>
                {todo.text}
              </p>
              
              <div className="flex items-center space-x-3 mt-2 flex-wrap">
                <span className={`text-[11px] font-bold flex items-center ${isOverdue ? 'text-red-600' : 'text-[#880D1E]'}`}>
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {todo.dueDate === todayStr ? 'Today' : todo.dueDate}
                  {todo.dueTime && <span className="ml-1 opacity-70">at {todo.dueTime}</span>}
                  {isOverdue && <span className="ml-2 uppercase text-[9px] animate-pulse">● Overdue</span>}
                </span>
                
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${priorityStyles[todo.priority]}`}>
                  {todo.priority}
                </span>

                {todo.description && (
                  <span className="text-[10px] text-gray-400 font-bold flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                    Notes
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl text-gray-300 transition-all"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && todo.description && (
        <div className="mt-4 ml-[36px] p-4 bg-gray-50 rounded-xl animate-slide-in">
           <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description / Instructions</h4>
           <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap">{todo.description}</p>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
