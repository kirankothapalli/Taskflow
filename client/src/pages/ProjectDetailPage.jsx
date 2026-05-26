import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { projectAPI, taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, Calendar, LayoutDashboard, ChevronRight, CheckCircle2, Clock, X } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
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

const COLUMNS = ['todo', 'in-progress', 'completed'];
const COL_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', completed: 'Completed' };
const COL_COLORS = {
  todo: 'border-slate-300 dark:border-slate-700',
  'in-progress': 'border-indigo-400 dark:border-indigo-500',
  completed: 'border-emerald-400 dark:border-emerald-500',
};
const PRIORITY_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

function TaskModal({ task, projectId, members, onClose, onSaved }) {
  const { user } = useAuth();
  const isEdit = !!task?._id;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    deadline: task?.deadline ? task.deadline.split('T')[0] : '',
    assignedTo: task?.assignedTo?._id || '',
    projectId,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await taskAPI.update(task._id, form);
        toast.success('Task updated');
      } else {
        await taskAPI.create(form);
        toast.success('Task created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="card w-full max-w-md p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4.5">
          <div>
            <label className="label">Title</label>
            <input className="input" placeholder="What needs to be done?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none h-24" placeholder="Add more details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {COLUMNS.map((s) => <option key={s} value={s}>{COL_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {['low', 'medium', 'high'].map((p) => <option key={p} value={p}>{p.replace(/\b\w/g, l => l.toUpperCase())}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Deadline</label>
              <input type="date" className="input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="label">Assign To</label>
              <select className="input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {members?.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="card-base p-4 hover:shadow-card-hover dark:hover:shadow-dark-card-hover transition-all cursor-pointer group relative overflow-hidden bg-white dark:bg-slate-850">
      <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }} />
      
      <div className="flex items-start justify-between gap-2 mb-2 pl-3">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{task.title}</p>
      </div>
      
      {task.description && (
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 pl-3">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between pl-3 mt-3">
        <div className="flex items-center gap-2">
          {task.assignedTo && (
            <span className="w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-xs flex items-center justify-center font-bold shadow-sm border border-primary-100 dark:border-primary-800/50" title={task.assignedTo.name}>
              {task.assignedTo.name[0]}
            </span>
          )}
          {task.deadline && (
            <span className={`text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-md ${
              new Date(task.deadline) < new Date() && task.status !== 'completed' 
                ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-gray-400'
            }`}>
              <Calendar size={12} /> {format(new Date(task.deadline), 'MMM d')}
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(task._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    projectAPI.getOne(id)
      .then((res) => setProject(res.data))
      .catch(() => toast.error('Failed to load project'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t._id === draggableId ? { ...t, status: newStatus } : t
      ),
    }));

    try {
      await taskAPI.update(draggableId, { status: newStatus });
    } catch {
      toast.error('Failed to update task');
      load();
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.delete(taskId);
      toast.success('Task deleted');
      load();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  if (loading) return <div className="text-gray-400 text-center py-12 font-medium">Loading project...</div>;
  if (!project) return <div className="text-gray-400 text-center py-12 font-medium">Project not found</div>;

  const members = [project.owner, ...(project.members || [])];
  const tasksByStatus = Object.fromEntries(
    COLUMNS.map((col) => [col, (project.tasks || []).filter((t) => t.status === col)])
  );

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
            <Link to="/projects" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"><LayoutDashboard size={16}/> Projects</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 dark:text-gray-300">{project.title}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
            <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: project.color }} />
            {project.title}
          </h1>
          {project.description && (
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2.5 max-w-2xl">{project.description}</p>
          )}
        </div>
        <button className="btn-primary flex-shrink-0" onClick={() => setModal('create')}>
          <Plus size={18} /> Add Task
        </button>
      </motion.div>

      {/* Progress */}
      <motion.div variants={itemVariants} className="card p-6 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex justify-between text-sm font-bold mb-3">
            <span className="text-gray-700 dark:text-gray-300 tracking-tight">Project Progress</span>
            <span className="text-gray-900 dark:text-white">{project.progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: project.color }}
            />
          </div>
        </div>
        <div className="flex items-center gap-8 md:pl-8 md:border-l border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <p className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-1">
              {project.completedTasks}<span className="text-gray-400 font-semibold text-sm">/{project.totalTasks}</span>
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center justify-center gap-1"><CheckCircle2 size={12}/> tasks done</p>
          </div>
          {project.deadline && (
            <div className="text-center hidden sm:block">
              <p className="text-base font-bold text-gray-900 dark:text-white">{format(new Date(project.deadline), 'MMM d, yyyy')}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center justify-center gap-1"><Clock size={12}/> deadline</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <div key={col} className={`glass-panel rounded-2xl border-t-4 ${COL_COLORS[col]} p-4 flex flex-col bg-gray-50/50 dark:bg-slate-900/50 shadow-none`}>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">{COL_LABELS[col]}</h3>
                <span className="text-xs font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md px-2 py-0.5 shadow-sm">
                  {tasksByStatus[col].length}
                </span>
              </div>
              <Droppable droppableId={col}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[150px] space-y-3 rounded-xl transition-all duration-300 ${snapshot.isDraggingOver ? 'bg-primary-50/50 dark:bg-primary-900/10 ring-1 ring-primary-200 dark:ring-primary-800' : ''}`}
                  >
                    {tasksByStatus[col].map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl opacity-90 z-50' : ''}
                            style={provided.draggableProps.style}
                          >
                            <TaskCard
                              task={task}
                              onEdit={(t) => setModal(t)}
                              onDelete={handleDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <button
                className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white py-2.5 bg-white/60 dark:bg-slate-800/60 border border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl transition-all"
                onClick={() => setModal({ status: col })}
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          ))}
        </motion.div>
      </DragDropContext>

      <AnimatePresence>
        {modal && (
          <TaskModal
            task={modal === 'create' || modal?.status ? (modal?.status ? { status: modal.status } : null) : modal}
            projectId={id}
            members={members}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
