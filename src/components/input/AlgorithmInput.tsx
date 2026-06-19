import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, MessageSquareText, ChevronDown, Wand2, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PRESETS: { label: string; mode: 'code' | 'description'; value: string }[] = [
  {
    label: 'Bubble Sort',
    mode: 'code',
    value: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // swap
      }
    }
  }
  return arr;
}`,
  },
  {
    label: 'Binary Search',
    mode: 'code',
    value: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
  },
  {
    label: 'Merge Sort',
    mode: 'description',
    value: 'merge sort: divide and conquer algorithm that splits array in half, recursively sorts each half, then merges them back together',
  },
  {
    label: 'BFS',
    mode: 'description',
    value: 'breadth first search graph traversal using a queue to visit nodes level by level, marking visited neighbors',
  },
  {
    label: 'Fibonacci',
    mode: 'code',
    value: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
  },
  {
    label: 'Knapsack',
    mode: 'description',
    value: '0/1 knapsack dynamic programming: given items with weight and value and a capacity W, maximize value using dp[i][w] table',
  },
];

export default function AlgorithmInput() {
  const { state, dispatch, analyze } = useApp();
  const [showPresets, setShowPresets] = useState(false);

  const loadPreset = (p: typeof PRESETS[0]) => {
    dispatch({ type: 'SET_INPUT_MODE', payload: p.mode });
    dispatch({ type: 'SET_INPUT_VALUE', payload: p.value });
    setShowPresets(false);
  };

  return (
    <div className="glass rounded-2xl p-5 flex flex-col h-full space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white/90">Input</h2>

        {/* Presets dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="btn-ghost text-xs px-3 py-1.5"
          >
            Quick Load <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-48 glass rounded-xl p-1.5 z-20 shadow-glass"
              >
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => loadPreset(p)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    {p.mode === 'code'
                      ? <Code2 className="w-3.5 h-3.5 text-electric-400" />
                      : <MessageSquareText className="w-3.5 h-3.5 text-violet-400" />
                    }
                    {p.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex bg-white/5 rounded-xl p-1 gap-1">
        {(['code', 'description'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => dispatch({ type: 'SET_INPUT_MODE', payload: mode })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${state.inputMode === mode
                ? 'bg-gradient-to-r from-electric-500/30 to-violet-500/30 text-white border border-electric-500/30'
                : 'text-white/50 hover:text-white/80'
              }`}
          >
            {mode === 'code'
              ? <><Code2 className="w-3.5 h-3.5" /> Code Input</>
              : <><MessageSquareText className="w-3.5 h-3.5" /> Description</>
            }
          </button>
        ))}
      </div>

      {/* Textarea */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.inputMode}
          initial={{ opacity: 0, x: state.inputMode === 'code' ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <textarea
            value={state.inputValue}
            onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
            placeholder={state.inputMode === 'code'
              ? '// Paste your algorithm code here...\nfunction bubbleSort(arr) {\n  ...\n}'
              : 'Describe the algorithm in plain English...\ne.g. "binary search on a sorted array"'
            }
            className={`w-full flex-1 bg-navy-950/80 border border-white/10 rounded-xl p-4 text-sm text-white/90 placeholder-white/20 resize-none focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all ${state.inputMode === 'code' ? 'font-mono' : 'font-sans'
              }`}
            style={{ minHeight: '160px' }}
            spellCheck={state.inputMode !== 'code'}
          />
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {state.error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs flex items-center gap-1.5"
        >
          ⚠️ {state.error}
        </motion.p>
      )}

      {/* Submit button */}
      <button
        onClick={analyze}
        disabled={state.isAnalyzing || !state.inputValue.trim()}
        className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state.isAnalyzing ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
        ) : (
          <><Wand2 className="w-4 h-4" /> Analyze &amp; Visualize</>
        )}
      </button>
    </div>
  );
}
