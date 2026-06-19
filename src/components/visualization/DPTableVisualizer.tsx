import { motion } from 'framer-motion';
import type { DPFrame, DPCell } from '../../engine/types';

const CELL_STYLE: Record<DPCell['state'], string> = {
  default: 'bg-white/5 text-white/30 border-white/10',
  active:  'bg-amber-500/30 text-amber-300 border-amber-500/50',
  filled:  'bg-electric-500/20 text-electric-400 border-electric-500/30',
  optimal: 'bg-green-500/25 text-green-400 border-green-500/40',
};

interface Props {
  frame: DPFrame;
}

export default function DPTableVisualizer({ frame }: Props) {
  const { table, rowLabels, colLabels, description, variables, highlightCell } = frame;
  const maxCols = colLabels.length;

  return (
    <div className="space-y-3 flex flex-col h-full">
      {/* Description */}
      <motion.div
        key={description}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl px-4 py-2.5 text-sm text-white/80"
      >
        {description}
      </motion.div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          <table className="border-collapse text-xs font-mono">
            <thead>
              <tr>
                <th className="w-8 h-7" />
                {colLabels.map((col, j) => (
                  <th
                    key={j}
                    className={`w-10 h-7 text-center font-semibold transition-colors ${
                      highlightCell && highlightCell.col === j
                        ? 'text-cyan-400'
                        : 'text-white/40'
                    }`}
                  >
                    {col.length > 6 ? col.slice(0, 5) + '…' : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <tr key={i}>
                  <td className={`w-8 h-7 text-center font-semibold pr-1 transition-colors whitespace-nowrap text-[10px] ${
                    highlightCell && highlightCell.row === i ? 'text-cyan-400' : 'text-white/40'
                  }`}>
                    {rowLabels[i]?.length > 6 ? rowLabels[i].slice(0, 5) + '…' : (rowLabels[i] ?? '')}
                  </td>
                  {row.slice(0, maxCols).map((cell, j) => {
                    const isHighlighted = highlightCell?.row === i && highlightCell?.col === j;
                    return (
                      <motion.td
                        key={`${i}-${j}`}
                        className={`w-10 h-8 text-center border rounded transition-all ${CELL_STYLE[cell.state]} ${
                          isHighlighted ? 'ring-2 ring-cyan-400/60 scale-110 z-10 relative' : ''
                        }`}
                        animate={{
                          scale: isHighlighted ? 1.1 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        {cell.value !== 0 || cell.state !== 'default' ? String(cell.value) : '0'}
                      </motion.td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Variables */}
      {Object.keys(variables).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(variables).map(([k, v]) => (
            <div key={k} className="glass px-2.5 py-1 rounded-lg text-xs font-mono">
              <span className="text-violet-400">{k}</span>
              <span className="text-white/40 mx-1">=</span>
              <span className="text-cyan-400">{String(v ?? 'null')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Default', cls: 'bg-white/10 border-white/20' },
          { label: 'Active', cls: 'bg-amber-500/30 border-amber-500/50' },
          { label: 'Filled', cls: 'bg-electric-500/20 border-electric-500/30' },
          { label: 'Optimal', cls: 'bg-green-500/25 border-green-500/40' },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded border ${cls}`} />
            <span className="text-[10px] text-white/40">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
