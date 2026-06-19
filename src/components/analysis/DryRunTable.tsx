import { motion } from 'framer-motion';
import type { DryRunStep } from '../../engine/types';

interface Props { steps: DryRunStep[] }

export default function DryRunTable({ steps }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-white/40">Step-by-step variable states during execution</p>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-2.5 px-3 text-left text-white/50 font-semibold w-12">#</th>
              <th className="py-2.5 px-3 text-left text-white/50 font-semibold">Operation</th>
              <th className="py-2.5 px-3 text-left text-white/50 font-semibold">Variables</th>
              <th className="py-2.5 px-3 text-left text-white/50 font-semibold">State</th>
              <th className="py-2.5 px-3 text-left text-white/50 font-semibold hidden sm:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step, i) => (
              <motion.tr
                key={step.step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <td className="py-2.5 px-3 font-mono text-white/30">{step.step}</td>
                <td className="py-2.5 px-3 text-white/80">{step.operation}</td>
                <td className="py-2.5 px-3 font-mono">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(step.variables).map(([k, v]) => (
                      <span key={k} className="badge-blue whitespace-nowrap">
                        {k}={String(v ?? 'null')}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    step.state.toLowerCase().includes('found') || step.state.toLowerCase().includes('complete')
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : step.state.toLowerCase().includes('swap') || step.state.toLowerCase().includes('compar')
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-white/10 text-white/60 border border-white/10'
                  }`}>
                    {step.state}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-white/40 hidden sm:table-cell">{step.notes}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
