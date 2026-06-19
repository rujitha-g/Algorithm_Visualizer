import { motion } from 'framer-motion';
import type { ArrayFrame } from '../../engine/types';

const STATE_COLORS: Record<string, { bg: string; glow: string; label: string }> = {
  default:   { bg: 'from-electric-600 to-electric-400',  glow: 'rgba(59,130,246,0.4)',   label: 'Default'   },
  comparing: { bg: 'from-amber-600 to-amber-400',        glow: 'rgba(245,158,11,0.5)',   label: 'Comparing' },
  swapping:  { bg: 'from-red-600 to-red-400',            glow: 'rgba(239,68,68,0.5)',    label: 'Swapping'  },
  sorted:    { bg: 'from-green-600 to-green-400',        glow: 'rgba(34,197,94,0.4)',    label: 'Sorted'    },
  pivot:     { bg: 'from-violet-600 to-violet-400',      glow: 'rgba(139,92,246,0.5)',   label: 'Pivot'     },
  found:     { bg: 'from-cyan-600 to-cyan-400',          glow: 'rgba(6,182,212,0.6)',    label: 'Found'     },
  searching: { bg: 'from-yellow-600 to-yellow-400',      glow: 'rgba(234,179,8,0.5)',    label: 'Searching' },
  excluded:  { bg: 'from-white/10 to-white/5',           glow: 'transparent',            label: 'Excluded'  },
};

interface Props {
  frame: ArrayFrame;
}

export default function ArrayVisualizer({ frame }: Props) {
  const { elements, description, variables } = frame;
  const maxVal = Math.max(...elements.map(e => e.value), 1);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Description */}
      <motion.div
        key={description}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl px-4 py-2.5 text-sm text-white/80 min-h-[40px] flex items-center"
      >
        {description}
      </motion.div>

      {/* Bars */}
      <div className="flex-1 flex items-end justify-center gap-1.5 px-2 min-h-[160px]">
        {elements.map((el, i) => {
          const cfg = STATE_COLORS[el.state] ?? STATE_COLORS.default;
          const heightPct = (el.value / maxVal) * 100;

          return (
            <motion.div
              key={`${el.index}-${i}`}
              className="flex flex-col items-center gap-1 flex-1 min-w-0"
              style={{ minWidth: 0 }}
            >
              {/* Value label */}
              <motion.span
                className="text-[10px] font-mono text-white/60 leading-none"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ opacity: el.state !== 'default' ? 1 : 0.5 }}
              >
                {el.value}
              </motion.span>

              {/* Bar */}
              <motion.div
                className={`w-full rounded-t-md bg-gradient-to-t ${cfg.bg} relative`}
                animate={{
                  height: `${Math.max(heightPct, 5)}%`,
                  boxShadow: `0 0 8px ${cfg.glow}`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{ minHeight: '4px' }}
                title={`[${el.index}] = ${el.value}`}
              >
                {/* Shine overlay */}
                <div className="absolute inset-x-0 top-0 h-1/3 bg-white/20 rounded-t-md" />
              </motion.div>

              {/* Index label */}
              <span className="text-[10px] text-white/30 leading-none">{el.index}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Variables */}
      {Object.keys(variables).length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-1">
          {Object.entries(variables).map(([k, v]) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass px-2.5 py-1 rounded-lg text-xs font-mono"
            >
              <span className="text-violet-400">{k}</span>
              <span className="text-white/40 mx-1">=</span>
              <span className="text-cyan-400">{String(v ?? 'null')}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 px-1">
        {Object.entries(STATE_COLORS).slice(0, 6).map(([state, cfg]) => (
          <div key={state} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-sm bg-gradient-to-t ${cfg.bg}`} />
            <span className="text-[10px] text-white/40 capitalize">{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
