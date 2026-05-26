import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Trash2, Calendar, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 }
  }
};

const PRIORITY_COLORS = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50',
  high: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50',
};

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const load = () => {
    taskAPI.getAll({ assignedTo: user._id, ...filters })
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted');
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          My Tasks
        </h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5">Tasks assigned to you across all projects</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center p-4 card-base bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm border-gray-100 dark:border-gray-800">
        <div className="flex w-full sm:w-auto gap-4 flex-1">
          <select
            className="input w-full sm:w-48 bg-white dark:bg-slate-800"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="input w-full sm:w-48 bg-white dark:bg-slate-800"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 w-full sm:w-auto text-center sm:text-left">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </motion.div>

      {/* Task list */}
      {loading ? (
        <p className="text-gray-400 text-center py-12 font-medium">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <motion.div variants={itemVariants} className="card p-12 text-center border-dashed border-2 border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50 shadow-none">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks found matching your criteria.</p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div 
                key={task._id} 
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 p-4.5 card-base hover:shadow-card-hover dark:hover:shadow-dark-card-hover transition-all group relative overflow-hidden bg-white dark:bg-slate-850"
              >
                {/* Background highlight line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${task.status === 'completed' ? 'bg-emerald-400' : 'bg-primary-500'}`} />

                {/* Checkbox Replacement (Icon) */}
                <button
                  onClick={() => handleStatusChange(task._id, task.status === 'completed' ? 'todo' : 'completed')}
                  className={`flex-shrink-0 transition-colors ml-1 ${task.status === 'completed' ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-300 dark:text-gray-600 hover:text-primary-500 dark:hover:text-primary-400'}`}
                >
                  {task.status === 'completed' ? <CheckCircle2 size={24} className="fill-emerald-50 dark:fill-emerald-900/20" /> : <Circle size={24} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-bold transition-all truncate ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}>
                    {task.title}
                  </p>
                  {task.project && (
                    <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1.5"><AlertCircle size={12} className="text-gray-400"/> {task.project.title}</p>
                  )}
                </div>

                {/* Badges & Actions */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`badge ${PRIORITY_COLORS[task.priority]} hidden sm:inline-flex`}>{task.priority.replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <select
                    className="text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {task.deadline && (
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 hidden lg:flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                      <Calendar size={14} className="text-gray-400" /> {format(new Date(task.deadline), 'MMM d')}
                    </span>
                  )}
                  <button onClick={() => handleDelete(task._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors sm:opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
