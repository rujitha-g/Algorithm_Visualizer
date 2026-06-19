import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAnimationPlayer } from '../../hooks/useAnimationPlayer';
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge,
} from 'lucide-react';

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.5, 2, 4];

export default function AnimationControls() {
  const { state, totalFrames } = useApp();
  const { play, pause, stepForward, stepBack, reset, setSpeed, seekTo } = useAnimationPlayer();
  const { isPlaying, currentFrame, speed } = state;

  const progress = totalFrames > 1 ? currentFrame / (totalFrames - 1) : 0;
  const hasFrames = totalFrames > 0;

  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-white/50">
          <span>Frame {currentFrame + 1} / {Math.max(1, totalFrames)}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div
          className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group"
          onClick={(e) => {
            if (!hasFrames) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seekTo(Math.round(ratio * (totalFrames - 1)));
          }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
              width: `${progress * 100}%`,
            }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress * 100}% - 6px)` }}
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2">
        {/* Reset */}
        <button onClick={reset} className="btn-icon" disabled={!hasFrames} title="Reset">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Step back */}
        <button onClick={stepBack} className="btn-icon" disabled={!hasFrames || currentFrame === 0} title="Step back">
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Play/Pause - main button */}
        <button
          onClick={isPlaying ? pause : play}
          disabled={!hasFrames}
          className="flex-1 py-2 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: isPlaying ? '0 0 20px rgba(59,130,246,0.5)' : undefined }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isPlaying ? (
              <motion.span key="pause" initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }} className="flex items-center gap-2">
                <Pause className="w-4 h-4" /> Pause
              </motion.span>
            ) : (
              <motion.span key="play" initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }} className="flex items-center gap-2">
                <Play className="w-4 h-4" /> Play
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Step forward */}
        <button onClick={stepForward} className="btn-icon" disabled={!hasFrames || currentFrame === totalFrames - 1} title="Step forward">
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Speed selector */}
      <div className="flex items-center gap-2">
        <Gauge className="w-3.5 h-3.5 text-white/50 shrink-0" />
        <span className="text-xs text-white/50 shrink-0 w-12">Speed</span>
        <div className="flex gap-1 flex-1">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                speed === s
                  ? 'bg-electric-500/30 text-electric-400 border border-electric-500/50'
                  : 'bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 border border-transparent'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
