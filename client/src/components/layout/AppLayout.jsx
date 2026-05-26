import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, FolderKanban, CheckSquare, Sun, Moon, LogOut, Menu } from 'lucide-react';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'My Tasks', icon: CheckSquare },
];

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-gray-800 w-64 p-5 z-40 relative">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-1 mt-2">
        <img src="/logo.png" alt="TaskFlow Logo" className="w-10 h-10 object-contain drop-shadow-md rounded-xl" />
        <span className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight drop-shadow-sm">TaskFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1.5">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 translate-x-1'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-3">
        <button onClick={toggle} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 w-full transition-colors hover:text-gray-900 dark:hover:text-gray-200">
          {dark ? <Sun size={18} strokeWidth={2}/> : <Moon size={18} strokeWidth={2}/>}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 text-sm font-bold shadow-inner">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Log out">
            <LogOut size={16} strokeWidth={2}/>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none z-40">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <motion.div initial={{x: -250}} animate={{x: 0}} exit={{x: -250}} className="relative z-10 w-64 h-full">
            <Sidebar />
          </motion.div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-auto relative z-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Menu size={20} />
          </button>
          <span className="font-extrabold text-gray-900 dark:text-white">TaskFlow</span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
