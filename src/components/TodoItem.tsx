
import React from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={`group flex items-center justify-between p-6 bg-white border rounded-[2rem] transition-all duration-500 ${
      todo.completed 
        ? 'border-emerald-100 bg-emerald-50/20' 
        : 'border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5'
    }`}>
      <div className="flex items-center space-x-6 flex-1">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
            todo.completed 
              ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200' 
              : 'border-slate-200 hover:border-indigo-500 bg-white'
          }`}
        >
          {todo.completed && (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <span className={`text-lg font-bold tracking-tight transition-all duration-500 ${
          todo.completed ? 'line-through text-slate-300 font-semibold' : 'text-slate-800'
        }`}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-3 hover:bg-red-50 rounded-2xl"
        title="Archive Objective"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;
