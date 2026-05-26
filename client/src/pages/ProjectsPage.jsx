import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, ExternalLink, Calendar, CheckCircle2, X } from 'lucide-react';

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

const STATUS_COLORS = {
  planning: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-gray-700',
  active: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50',
  'on-hold': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
};

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

function ProjectModal({ project, onClose, onSaved }) {
  const isEdit = !!project?._id;
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    deadline: project?.deadline ? project.deadline.split('T')[0] : '',
    status: project?.status || 'planning',
    priority: project?.priority || 'medium',
    color: project?.color || COLORS[0],
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await projectAPI.update(project._id, form);
        toast.success('Project updated');
      } else {
        await projectAPI.create(form);
        toast.success('Project created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
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
            {isEdit ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4.5">
          <div>
            <label className="label">Title</label>
            <input className="input" placeholder="e.g., Marketing Campaign" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none h-24" placeholder="Briefly describe the project goals..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {['planning', 'active', 'on-hold', 'completed'].map((s) => (
                  <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {['low', 'medium', 'high'].map((p) => (
                  <option key={p} value={p}>{p.replace(/\b\w/g, l => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Deadline</label>
              <input type="date" className="input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="label">Color theme</label>
              <div className="flex gap-2.5 mt-2.5">
                {COLORS.map((c) => (
                  <button
                    key={c} type="button"
                    className={`w-6 h-6 rounded-full border-2 transition-all shadow-sm ${form.color === c ? 'border-gray-900 dark:border-white scale-110 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-900 ring-gray-900/20 dark:ring-white/20' : 'border-transparent opacity-80 hover:opacity-100'}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setForm({ ...form, color: c })}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    projectAPI.getAll()
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) return;
    try {
      await projectAPI.delete(id);
      toast.success('Project deleted successfully');
      load();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''} active
          </p>
        </div>
        <button className="btn-primary" onClick={() => setModal('create')}>
          <Plus size={18} /> New Project
        </button>
      </motion.div>

      {loading ? (
        <p className="text-gray-400 text-center py-12 font-medium">Loading projects...</p>
      ) : projects.length === 0 ? (
        <motion.div variants={itemVariants} className="card p-12 text-center border-dashed border-2 border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50 shadow-none">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <Plus size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No projects yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium max-w-sm mx-auto">Get started by creating a new project to organize your tasks and collaborate with your team.</p>
          <button className="btn-primary" onClick={() => setModal('create')}>Create your first project</button>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((p) => (
              <motion.div 
                key={p._id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="card p-6 group flex flex-col relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-[0.08] transition-transform duration-700 group-hover:scale-150"
                  style={{ backgroundColor: p.color }}
                />
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                    <Link to={`/projects/${p._id}`} className="font-bold text-lg text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate">
                      {p.title}
                    </Link>
                  </div>
                  <span className={`badge flex-shrink-0 ${STATUS_COLORS[p.status]}`}>{p.status.replace('-', ' ')}</span>
                </div>

                {p.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 relative z-10 flex-1 font-medium">{p.description}</p>
                )}

                {/* Progress bar */}
                <div className="mb-5 relative z-10 mt-auto pt-5 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-gray-400" /> {p.completedTasks}/{p.totalTasks} tasks</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    {p.deadline ? <><Calendar size={14} /> {format(new Date(p.deadline), 'MMM d, yyyy')}</> : ''}
                  </div>
                  
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors" onClick={() => setModal(p)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" onClick={() => handleDelete(p._id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                    <Link to={`/projects/${p._id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors" title="Open Project">
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {modal && (
          <ProjectModal
            project={modal === 'create' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
