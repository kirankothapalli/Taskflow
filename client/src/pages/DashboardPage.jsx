import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format, isPast } from 'date-fns';

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

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981'];
const PRIORITY_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

function StatCard({ label, value, sub, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    green: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    yellow: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    red: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  };
  return (
    <motion.div variants={itemVariants} className="card p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">{label}</p>
        <div className={`inline-flex px-2 py-1 rounded-lg shadow-subtle ${colors[color]}`}>
          <span className="text-xs font-bold leading-none mt-[2px]">{value}</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</p>
        {sub && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 py-12 text-center font-medium">Loading dashboard...</div>;
  if (!data) return null;

  const { stats, weeklyData, myTasks, upcoming } = data;

  const pieData = [
    { name: 'Todo', value: stats.todoTasks },
    { name: 'In Progress', value: stats.inProgressTasks },
    { name: 'Completed', value: stats.completedTasks },
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5">
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name?.split(' ')[0]}. Here's your overview for {format(new Date(), 'MMMM d')}.
          </p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Projects" value={stats.totalProjects} color="indigo" />
        <StatCard label="Active Projects" value={stats.activeProjects} color="green" />
        <StatCard label="Completed Tasks" value={stats.completedTasks} color="green" />
        <StatCard label="Pending Tasks" value={stats.todoTasks + stats.inProgressTasks} color="yellow" />
      </motion.div>

      {/* Charts row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly bar chart */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Tasks Completed (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--tw-colors-white)', color: 'var(--tw-colors-gray-900)' }}
              />
              <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task status pie */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#111827', fontWeight: '600' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">My Recent Tasks</h2>
            <Link to="/tasks" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">View all</Link>
          </div>
          {myTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No tasks assigned to you right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.slice(0, 5).map((task) => (
                <div key={task._id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-900/50 transition-colors group">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{task.title}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">{task.project?.title}</p>
                  </div>
                  <span className={`badge ${
                    task.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' :
                    task.status === 'in-progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50' :
                    'bg-white text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-gray-700'
                  }`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Upcoming Deadlines</h2>
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No upcoming deadlines this week</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 5).map((task) => (
                <div key={task._id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{task.title}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">{task.project?.title}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${isPast(new Date(task.deadline)) ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                    {format(new Date(task.deadline), 'MMM d')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
