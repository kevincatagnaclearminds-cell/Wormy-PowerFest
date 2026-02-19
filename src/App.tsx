import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, BarChart3 } from 'lucide-react';
import { RegistrationPage } from './pages/RegistrationPage';
import { AdminDashboard } from './pages/AdminDashboard';
import logoHeader from './assets/logos/logo-header.jpeg';
type View = 'register' | 'dashboard';
export function App() {
  const [activeView, setActiveView] = useState<View>('register');
  const tabs = [
  {
    id: 'register',
    label: 'Registro',
    icon: Ticket
  },
  {
    id: 'dashboard',
    label: 'Panel',
    icon: BarChart3
  }];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-magenta/30">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src={logoHeader} 
                alt="Warmi PowerFest Logo" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-magenta to-violet">
                WARMI<span className="text-gray-900">POWERFEST</span>
              </span>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const isActive = activeView === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as View)}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2
                      ${isActive ? 'text-gray-900 bg-gray-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                    `}>

                    <Icon
                      className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-magenta' : 'text-gray-400'}`} />

                    {tab.label}
                    {isActive &&
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-magenta to-violet"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30
                      }} />

                    }
                  </button>);

              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            transition={{
              duration: 0.3
            }}
            className="w-full">

            {activeView === 'register' && <RegistrationPage />}
            {activeView === 'dashboard' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>);

}