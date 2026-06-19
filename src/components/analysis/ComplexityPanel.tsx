import { motion } from 'framer-motion';
import { Clock, HardDrive, TrendingUp } from 'lucide-react';
import type { ComplexityInfo } from '../../engine/types';

interface Props { complexity: ComplexityInfo }

const CASE_COLORS = {
  Best:    { border: 'border-green-500/40',  bg: 'bg-green-500/10',  text: 'text-green-400',  badge: 'badge-green' },
  Average: { border: 'border-amber-500/40',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  badge: 'badge-amber' },
  Worst:   { border: 'border-red-500/40',    bg: 'bg-red-500/10',    text: 'text-red-400',    badge: 'badge-red'   },
};

export default function ComplexityPanel({ complexity }: Props) {
  const cases = [complexity.best, complexity.average, complexity.worst];

  return (
    <div className="space-y-4">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cases.map((c, i) => {
          const colors = CASE_COLORS[c.label as keyof typeof CASE_COLORS] ?? CASE_COLORS.Average;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-xl p-4 border ${colors.border} ${colors.bg} space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${colors.text}`}>{c.label} Case</span>
                <TrendingUp className={`w-4 h-4 ${colors.text}`} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-xs text-white/50">Time</span>
                  <span className={`ml-auto font-mono font-bold text-sm ${colors.text}`}>{c.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-xs text-white/50">Space</span>
                  <span className="ml-auto font-mono font-bold text-sm text-cyan-400">{c.space}</span>
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">{c.explanation}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Space overall */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-xl p-4 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
          <HardDrive className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <p className="text-xs text-white/50">Overall Space Complexity</p>
          <p className="font-mono font-bold text-cyan-400 text-lg leading-tight">{complexity.spaceOverall}</p>
        </div>
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-4 border border-electric-500/20 bg-electric-500/5"
      >
        <p className="text-xs font-semibold text-electric-400 mb-1.5">📝 Notes</p>
        <p className="text-sm text-white/70 leading-relaxed">{complexity.notes}</p>
      </motion.div>
    </div>
  );
}
