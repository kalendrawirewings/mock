import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  FileText,
  Mic,
  BarChart3,
  History,
  Settings,
  Brain,
  Contact,
  HandHelping,
} from 'lucide-react';
import logo from '../../assets/logo/growvira-logo.png';

const Layout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/resume', icon: FileText, label: 'Resume' },
    { path: '/interview', icon: Mic, label: 'Interview' },
    { path: '/feedback', icon: BarChart3, label: 'Feedback' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/help-us', icon: HandHelping, label: 'Help' },
    { path: '/contact-us', icon: Contact, label: 'Contact' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-r from-black via-slate-900 to-purple-950 '>
      {/* Header */}
      <header className='glass border-b border-white/10 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center justify-between'>
              <div className='w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center'>
                <Link to='/'>
                  <img src={logo} />
                </Link>
              </div>
            </div>

            <div className='flex items-center md:hidden space-x-4'>
              <div>
                <Link to='/help-us'>
                  <button className='border border-purple-500/20 rounded-lg px-4 py-2 hover:bg-purple-500/10 '>
                    <span className='text-[16px] text-gray-300'>Help</span>
                  </button>
                </Link>
              </div>
              <div>
                <Link to='/contact-us'>
                  <button className='border border-purple-500/20 rounded-lg px-4 py-2 hover:bg-purple-500/10 '>
                    <span className='text-[16px] text-gray-300'>Contact</span>
                  </button>
                </Link>
              </div>
            </div>

            <nav className='hidden md:flex space-x-1'>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-1 md:space-x-1 transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon className='w-4 h-4 hidden lg:block' />
                    <span className='text-sm font-medium'>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 mt-8 pb-20 '>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <nav className='md:hidden fixed bottom-0 z-50 left-0 right-0 glass border-t border-white/10 px-4 py-2'>
        <div className='flex justify-around'>
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive ? 'text-purple-400' : 'text-gray-500'
                }`}
              >
                <item.icon className='w-5 h-5' />
                <span className='text-xs'>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
