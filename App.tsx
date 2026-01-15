import React, { useState, useEffect } from 'react';
import { Task, Priority, Category, ViewFilter } from './types';
import { TaskItem } from './components/TaskItem';
import { ChatBot } from './components/ChatBot';
import { Plus, Calendar, BookOpen, CheckCircle, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zenScholarTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<ViewFilter>('today');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('zenScholarDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>(Category.STUDY);
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(Priority.MEDIUM);
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('zenScholarTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('zenScholarDarkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- Handlers ---
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDate,
      isCompleted: false,
      createdAt: Date.now()
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // --- Computed ---
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.isCompleted;
    if (task.isCompleted) return false; // Hide completed from other views

    if (filter === 'today') {
      return task.dueDate === todayStr;
    }
    if (filter === 'upcoming') {
      return task.dueDate > todayStr;
    }
    return false;
  });

  // Sort: Priority High first, then date
  filteredTasks.sort((a, b) => {
    const priorityOrder = { [Priority.HIGH]: 0, [Priority.MEDIUM]: 1, [Priority.LOW]: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.dueDate.localeCompare(b.dueDate);
  });

  const progress = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) 
    : 0;

  // --- Components ---
  const TabButton = ({ view, label, icon: Icon }: { view: ViewFilter, label: string, icon: any }) => (
    <button
      onClick={() => setFilter(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        filter === view 
          ? 'bg-blue-gradient text-white shadow-md shadow-blue-200 dark:shadow-none' 
          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen pb-20 font-sans bg-[#f7f9fc] dark:bg-slate-900 transition-colors duration-300 text-slate-800 dark:text-slate-100">
      {/* Header Section */}
      <header className="bg-white dark:bg-slate-800 pt-8 pb-6 px-4 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Hello, Student</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Let's make today productive.</p>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="text-right">
                <span className="text-3xl font-bold text-blue-gradient">{progress}%</span>
                <p className="text-xs text-slate-400 font-medium">Completed</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-blue-gradient rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <TabButton view="today" label="Today" icon={Calendar} />
            <TabButton view="upcoming" label="Upcoming" icon={BookOpen} />
            <TabButton view="completed" label="Done" icon={CheckCircle} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <div className="mb-3 inline-block p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm">
              <CheckCircle size={32} className="text-blue-500" />
            </div>
            <p>No tasks found for {filter}.</p>
            {filter !== 'completed' && <p className="text-sm">Enjoy your free time!</p>}
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={toggleTask} 
              onDelete={deleteTask} 
            />
          ))
        )}
      </main>

      {/* Add Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-gradient text-white px-6 py-3 rounded-full shadow-lg shadow-blue-900/20 dark:shadow-none transition-transform active:scale-95 hover:brightness-110"
        >
          <Plus size={20} />
          <span className="font-medium">New Task</span>
        </button>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-fade-in transition-colors duration-300">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Add New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Task Title</label>
                <input
                  autoFocus
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Finish Calculus Chapter 3"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as Category)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none"
                  >
                    {Object.values(Category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none"
                  >
                    {Object.values(Priority).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="flex-1 py-3 bg-blue-gradient text-white font-medium rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 dark:shadow-none"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
};

export default App;