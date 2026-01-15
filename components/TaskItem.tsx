import React from 'react';
import { Task, Priority, Category } from '../types';
import { Trash2, Check, Clock, Tag } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// Helper for Priority Badge Styling
const getPriorityBadgeStyle = (priority: Priority) => {
  switch (priority) {
    case Priority.HIGH:
      return 'text-red-600 bg-red-50 dark:text-red-200 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50';
    case Priority.MEDIUM:
      return 'text-amber-600 bg-amber-50 dark:text-amber-200 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-900/50';
    case Priority.LOW:
      return 'text-emerald-600 bg-emerald-50 dark:text-emerald-200 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/50';
    default:
      return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-700';
  }
};

const getCategoryBadgeStyle = (category: Category) => {
  return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium';
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const isOverdue = !task.isCompleted && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
  
  // Standardized Card Style matching the "Done" aesthetic
  // Removing side borders and specific background colors for a cleaner look
  const containerClasses = task.isCompleted
    ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md';

  return (
    <div className={`group relative p-5 rounded-2xl border transition-all duration-300 ${containerClasses} animate-fade-in`}>
      <div className="flex items-start gap-4">
        
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            task.isCompleted 
              ? 'bg-emerald-500 border-emerald-500' 
              : 'border-slate-300 dark:border-slate-500 hover:border-blue-500 dark:hover:border-blue-400 bg-transparent'
          }`}
          aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.isCompleted && <Check size={14} className="text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md ${getCategoryBadgeStyle(task.category)}`}>
              {task.category}
            </span>
            <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'}`}>
              <Clock size={12} />
              {isOverdue ? 'Overdue' : new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h3 className={`text-lg font-semibold break-words mb-3 ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
            {task.title}
          </h3>

          <div className="flex items-center justify-between">
            {/* Priority as a Badge */}
            <span className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${getPriorityBadgeStyle(task.priority)}`}>
              <Tag size={12} />
              {task.priority} Priority
            </span>
            
            <button 
              onClick={() => onDelete(task.id)}
              className="text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Delete task"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};