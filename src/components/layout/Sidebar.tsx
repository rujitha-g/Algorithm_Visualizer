import { motion } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ALGORITHMS = {
  'Sorting': ['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Insertion Sort'],
  'Search': ['Binary Search', 'Linear Search'],
  'Graph': ['BFS', 'DFS'],
  'Recursion': ['Fibonacci', 'Factorial'],
  'DP': ['LCS', 'Knapsack'],
};

export default function Sidebar() {
  const { state, dispatch } = useApp();

  const handleSelect = (algo: string) => {
    dispatch({ type: 'SET_INPUT_VALUE', payload: algo });
    dispatch({ type: 'SET_INPUT_MODE', payload: 'description' });
    dispatch({ type: 'TOGGLE_SIDEBAR' });
    // Let user click Visualize, or we can trigger analyze if we modify analyze to take an argument
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-72 bg-navy-900 border-r border-white/10 z-50 flex flex-col shadow-2xl"
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold text-lg text-white">Algorithms</h2>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="btn-icon w-8 h-8"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(ALGORITHMS).map(([category, algos]) => {
            if (state.selectedCategory && state.selectedCategory !== category) return null;
            return (
              <div key={category}>
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-1">
                  {algos.map((algo) => (
                    <button
                      key={algo}
                      onClick={() => handleSelect(algo)}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors group"
                    >
                      {algo}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
