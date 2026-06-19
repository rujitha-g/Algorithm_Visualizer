import { motion } from 'framer-motion';
import { Moon, Sun, BrainCircuit, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const { state, dispatch } = useApp();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-white/10 px-4 sm:px-6 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="btn-icon mr-2"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center glow-blue">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">
              <span className="gradient-text">AI Algorithm</span>
              <span className="text-white"> Visualizer</span>
            </h1>
            <p className="text-[10px] text-white/40 leading-none">Animate · Analyze · Understand</p>
          </div>
        </div>

        {/* Center pills */}
        <div className="hidden md:flex items-center gap-1 glass px-3 py-1.5 rounded-full">
          {['Sorting', 'Search', 'Graph', 'Recursion', 'DP'].map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch({ type: 'SET_CATEGORY', payload: cat })}
              className={`px-3 py-1 text-xs font-medium transition-colors rounded-full ${
                state.selectedCategory === cat
                  ? 'bg-electric-500/20 text-electric-400'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            aria-label="GitHub"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>

          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
            className="btn-icon"
            aria-label="Toggle dark mode"
          >
            {state.isDark
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-violet-400" />
            }
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
