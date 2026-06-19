import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import AlgorithmInput from '../components/input/AlgorithmInput';
import AnimationControls from '../components/controls/AnimationControls';
import VisualizationEngine from '../components/visualization/VisualizationEngine';
import ComplexityPanel from '../components/analysis/ComplexityPanel';
import DryRunTable from '../components/analysis/DryRunTable';
import { useApp } from '../context/AppContext';
import type { EdgeCase } from '../engine/types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, FileCode2, LineChart, Code2, TestTube } from 'lucide-react';

export default function VisualizerPage() {
  const { state, dispatch, currentFrameData } = useApp();
  const { analysisResult, isDark, activeTab } = state;

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-navy-900 text-white font-sans selection:bg-electric-500/30`}>
      <Navbar />
      <AnimatePresence>
        {state.isSidebarOpen && <Sidebar />}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
        
        {/* Top section: Input vs Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[480px]">
          
          {/* Left: Input (4 cols) */}
          <div className="lg:col-span-4 h-full flex flex-col">
            <AlgorithmInput />
          </div>

          {/* Right: Visualization & Controls (8 cols) */}
          <div className="lg:col-span-8 h-full flex flex-col space-y-4">
            <div className="flex-1 glass rounded-2xl p-4 overflow-hidden relative">
              {currentFrameData ? (
                <VisualizationEngine frame={currentFrameData} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <FileCode2 className="w-8 h-8 text-white/30" />
                  </div>
                  <p>Enter an algorithm to visualize</p>
                </div>
              )}
            </div>
            
            <AnimationControls />
          </div>
        </div>

        {/* Bottom section: Analysis Tabs */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 sm:p-6"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="gradient-text">{analysisResult.detection.name}</span>
                  <span className="badge-violet capitalize">{analysisResult.detection.category}</span>
                </h3>
                {analysisResult.detection.confidence < 0.5 && analysisResult.detection.name !== 'Unknown' && (
                  <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Low confidence detection. Double check the results.
                  </p>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 border-b border-white/10 mb-6 pb-2 no-scrollbar">
              {[
                { id: 'visualization', label: 'Explanation', icon: <FileCode2 className="w-4 h-4" /> },
                { id: 'complexity', label: 'Complexity', icon: <LineChart className="w-4 h-4" /> },
                { id: 'dryrun', label: 'Dry Run', icon: <TestTube className="w-4 h-4" /> },
                { id: 'edgecases', label: 'Edge Cases', icon: <AlertCircle className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id as any })}
                  className={`px-4 py-2 text-sm font-medium rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-electric-500/20 text-electric-400 border border-electric-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'visualization' && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white/90">How it works</h4>
                      <ul className="space-y-3">
                        {analysisResult.beginnerExplanation.map((line: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-white/70 text-sm bg-white/5 rounded-xl p-3 border border-white/5">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold border border-violet-500/30">
                              {i + 1}
                            </span>
                            <span className="mt-0.5">{line}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-6">
                        <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-cyan-400" /> Pseudocode
                        </h4>
                        <pre className="code-block text-cyan-300">
                          <code>{analysisResult.pseudocode.join('\n')}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {activeTab === 'complexity' && (
                    <ComplexityPanel complexity={analysisResult.complexity} />
                  )}

                  {activeTab === 'dryrun' && (
                    <DryRunTable steps={analysisResult.dryRun} />
                  )}

                  {activeTab === 'edgecases' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResult.edgeCases.length === 0 ? (
                        <p className="text-white/50 text-sm">No specific edge cases identified.</p>
                      ) : (
                        analysisResult.edgeCases.map((ec: EdgeCase, i: number) => (
                          <div key={i} className="glass rounded-xl p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-semibold text-white/90 text-sm">{ec.title}</h5>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                ec.impact === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                ec.impact === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                'bg-green-500/20 text-green-400 border-green-500/30'
                              }`}>
                                {ec.impact} Impact
                              </span>
                            </div>
                            <p className="text-sm text-white/60">{ec.description}</p>
                            <p className="text-xs font-mono text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20 inline-block mt-2">
                              Example: {ec.example}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </main>
    </div>
  );
}
