import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ArrowRight, LayoutDashboard, CheckSquare, Users, Zap, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const features = [
    {
      icon: <LayoutDashboard className="text-primary-500" size={24} />,
      title: "Intuitive Boards",
      description: "Organize your workflow with powerful, visually stunning kanban boards that make sense.",
    },
    {
      icon: <Users className="text-blue-500" size={24} />,
      title: "Seamless Collaboration",
      description: "Work together in real-time. Assign tasks, leave comments, and stay on the same page.",
    },
    {
      icon: <Zap className="text-amber-500" size={24} />,
      title: "Lightning Fast",
      description: "Built for speed. Enjoy a snappy, responsive experience that keeps up with your pace.",
    },
    {
      icon: <CheckSquare className="text-emerald-500" size={24} />,
      title: "Task Management",
      description: "Break down complex projects into manageable tasks and track progress effortlessly.",
    },
    {
      icon: <Sparkles className="text-purple-500" size={24} />,
      title: "Beautiful Design",
      description: "A dark-mode ready, glassmorphic interface that you'll actually enjoy looking at all day.",
    },
    {
      icon: <Shield className="text-rose-500" size={24} />,
      title: "Secure & Reliable",
      description: "Your data is protected with industry-standard security and regular backups.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-surface dark:bg-surface-dark transition-colors duration-500">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
      
      {/* Mesh Gradient Background Pattern */}
      <div className="absolute inset-0 bg-mesh-light dark:bg-none z-0 opacity-40"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0H0v20h20V0z\' fill=\'%23a1a1aa\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0H0v20h20V0z\' fill=\'%233f3f46\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] z-0"></div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 glass-panel border-b-0 border-white/20 dark:border-white/5 mx-4 mt-4 rounded-2xl md:mx-10 px-6 py-4 flex items-center justify-between shadow-glass dark:shadow-dark-glass transition-all duration-300">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="TaskFlow Logo" className="w-8 h-8 object-contain drop-shadow-md rounded-lg" />
          <span className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight drop-shadow-sm">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggle} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user ? (
            <Link to="/dashboard" className="btn-primary py-2 text-sm shadow-glow group">
              Go to Dashboard
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors hidden sm:block">
                Log in
              </Link>
              <Link to="/register" className="btn-primary py-2 text-sm shadow-glow">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-10 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mt-10 md:mt-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold tracking-wide mb-6 border border-primary-100 dark:border-primary-800/50 shadow-sm">
            <Sparkles size={16} className="animate-pulse" />
            <span>The future of productivity</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-8">
            Manage your tasks with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
              effortless elegance.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            TaskFlow is the premium project management platform designed to simplify your workflow, boost team collaboration, and turn chaos into clarity.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? "/dashboard" : "/register"} className="btn-primary text-base px-8 py-4 w-full sm:w-auto group shadow-[0_0_40px_rgba(92,100,192,0.4)] hover:shadow-[0_0_60px_rgba(92,100,192,0.6)] rounded-2xl">
              Start Building Free
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <a href="#features" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto rounded-2xl border-2">
              Explore Features
            </a>
          </motion.div>
        </motion.div>

        {/* Floating Mockup / Visual */}
        <motion.div 
          className="mt-20 relative mx-auto max-w-5xl group"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative glass-panel rounded-2xl border border-white/40 dark:border-white/10 p-2 shadow-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center aspect-video relative border border-gray-100 dark:border-slate-800">
              {/* Abstract Mockup inside */}
              <div className="absolute inset-0 bg-gray-50 dark:bg-slate-900 p-4 sm:p-8 flex flex-col gap-4">
                 <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div className="w-1/3 h-6 bg-gray-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50"></div>
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50"></div>
                    </div>
                 </div>
                 <div className="flex-1 flex gap-4 overflow-hidden">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex-1 bg-gray-100 dark:bg-slate-800/50 rounded-xl p-3 flex flex-col gap-3">
                        <div className="w-1/2 h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="w-full h-20 bg-white dark:bg-slate-800 rounded-lg shadow-sm"></div>
                        <div className="w-full h-24 bg-white dark:bg-slate-800 rounded-lg shadow-sm"></div>
                        {i === 2 && <div className="w-full h-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm"></div>}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="mt-32 pt-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why choose TaskFlow?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to manage projects, wrapped in a beautiful interface that sparks joy.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                className="card p-8 group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-slate-800 flex items-center justify-center mb-6 relative z-10 shadow-sm border border-primary-100 dark:border-slate-700 group-hover:-translate-y-1 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg mt-20 relative z-10 py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TaskFlow Logo" className="w-6 h-6 object-contain grayscale opacity-70" />
            <span className="font-bold text-gray-500 dark:text-gray-400">TaskFlow</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} TaskFlow by Antigravity. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
