import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AnalysisResult, VisualizationFrame } from '../engine/types';
import { detectAlgorithm } from '../engine/detector';
import { runAnalysis } from '../engine/analysisEngine';

// ─── State ────────────────────────────────────────────────────────────────────
export interface AppState {
  // Input
  inputMode: 'code' | 'description';
  inputValue: string;

  // Analysis
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  error: string | null;

  // Animation
  currentFrame: number;
  isPlaying: boolean;
  speed: number; // multiplier: 0.25 to 4

  // UI
  isDark: boolean;
  activeTab: 'visualization' | 'complexity' | 'dryrun' | 'edgecases' | 'explanation';
  isSidebarOpen: boolean;
  selectedCategory: string | null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────
type Action =
  | { type: 'SET_INPUT_MODE'; payload: 'code' | 'description' }
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: AnalysisResult }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FRAME'; payload: number }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'TOGGLE_DARK' }
  | { type: 'SET_TAB'; payload: AppState['activeTab'] }
  | { type: 'RESET_ANIMATION' }
  | { type: 'NEXT_FRAME' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_CATEGORY'; payload: string | null };

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_INPUT_MODE': return { ...state, inputMode: action.payload };
    case 'SET_INPUT_VALUE': return { ...state, inputValue: action.payload };
    case 'SET_ANALYZING': return { ...state, isAnalyzing: action.payload };
    case 'SET_RESULT': return { ...state, analysisResult: action.payload, error: null, currentFrame: 0, isPlaying: false };
    case 'SET_ERROR': return { ...state, error: action.payload, isAnalyzing: false };
    case 'SET_FRAME': return { ...state, currentFrame: action.payload };
    case 'SET_PLAYING': return { ...state, isPlaying: action.payload };
    case 'SET_SPEED': return { ...state, speed: action.payload };
    case 'TOGGLE_DARK': {
      const next = !state.isDark;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return { ...state, isDark: next };
    }
    case 'SET_TAB': return { ...state, activeTab: action.payload };
    case 'RESET_ANIMATION': return { ...state, currentFrame: 0, isPlaying: false };
    case 'NEXT_FRAME': {
      const totalFrames = state.analysisResult?.frames.length ?? 0;
      const next = state.currentFrame + 1;
      if (next >= totalFrames) {
        return { ...state, isPlaying: false, currentFrame: Math.max(0, totalFrames - 1) };
      }
      return { ...state, currentFrame: next };
    }
    case 'TOGGLE_SIDEBAR': return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'SET_CATEGORY': return { ...state, selectedCategory: action.payload, isSidebarOpen: true };
    default: return state;
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────
const saved = localStorage.getItem('theme');
const prefersDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDark) document.documentElement.classList.add('dark');

const initialState: AppState = {
  inputMode: 'code',
  inputValue: '',
  isAnalyzing: false,
  analysisResult: null,
  error: null,
  currentFrame: 0,
  isPlaying: false,
  speed: 1,
  isDark: prefersDark,
  activeTab: 'visualization',
  isSidebarOpen: false,
  selectedCategory: null,
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  currentFrameData: VisualizationFrame | null;
  totalFrames: number;
  analyze: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const frames = state.analysisResult?.frames ?? [];
  const totalFrames = frames.length;
  const currentFrameData = frames[state.currentFrame] ?? null;

  const analyze = useCallback(() => {
    if (!state.inputValue.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Please enter some code or a description.' });
      return;
    }
    dispatch({ type: 'SET_ANALYZING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    // Small timeout to allow UI to update before heavy computation
    setTimeout(() => {
      try {
        const detection = detectAlgorithm(state.inputValue, state.inputMode);
        const result = runAnalysis(detection);
        dispatch({ type: 'SET_RESULT', payload: result });
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: 'Analysis failed. Please try again.' });
      } finally {
        dispatch({ type: 'SET_ANALYZING', payload: false });
      }
    }, 300);
  }, [state.inputValue, state.inputMode]);

  return (
    <AppContext.Provider value={{ state, dispatch, currentFrameData, totalFrames, analyze }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
