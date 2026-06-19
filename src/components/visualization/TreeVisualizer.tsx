import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { TreeFrame, TreeNode } from '../../engine/types';

const NODE_STYLE: Record<TreeNode['state'], { fill: string; stroke: string; text: string }> = {
  default:   { fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.2)', text: '#9ca3af' },
  active:    { fill: 'rgba(245,158,11,0.25)',  stroke: '#f59e0b',               text: '#fbbf24' },
  computing: { fill: 'rgba(139,92,246,0.3)',   stroke: '#8b5cf6',               text: '#a78bfa' },
  done:      { fill: 'rgba(34,197,94,0.25)',   stroke: '#22c55e',               text: '#4ade80' },
  memoized:  { fill: 'rgba(6,182,212,0.25)',   stroke: '#06b6d4',               text: '#22d3ee' },
};

// Auto-layout: assign x/y based on depth and sibling order
function layoutNodes(nodes: TreeNode[]): (TreeNode & { lx: number; ly: number })[] {
  const byDepth: Record<number, TreeNode[]> = {};
  for (const n of nodes) {
    (byDepth[n.depth] = byDepth[n.depth] ?? []).push(n);
  }
  const maxDepth = Math.max(...Object.keys(byDepth).map(Number), 0);
  const W = 480, H = 300;
  const yStep = H / (maxDepth + 1);

  return nodes.map(n => {
    const siblings = byDepth[n.depth] ?? [];
    const idx = siblings.indexOf(n);
    const count = siblings.length;
    const lx = W * (idx + 1) / (count + 1);
    const ly = yStep * (n.depth + 0.5);
    return { ...n, lx, ly };
  });
}

interface Props {
  frame: TreeFrame;
}

const R = 22;

export default function TreeVisualizer({ frame }: Props) {
  const { nodes, description, callStack } = frame;
  const laid = useMemo(() => layoutNodes(nodes), [nodes]);
  const idMap = useMemo(() => Object.fromEntries(laid.map(n => [n.id, n])), [laid]);

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

      {/* SVG tree */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        <svg viewBox="0 0 480 300" className="w-full max-h-64">
          {/* Edges */}
          {laid.filter(n => n.parentId).map(n => {
            const parent = idMap[n.parentId!];
            if (!parent) return null;
            return (
              <motion.line
                key={`edge-${n.id}`}
                x1={parent.lx} y1={parent.ly}
                x2={n.lx} y2={n.ly}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}

          {/* Nodes */}
          {laid.map(n => {
            const cfg = NODE_STYLE[n.state] ?? NODE_STYLE.default;
            return (
              <motion.g
                key={n.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: n.depth * 0.05 }}
                style={{ transformOrigin: `${n.lx}px ${n.ly}px` }}
              >
                {n.state === 'active' && (
                  <motion.circle
                    cx={n.lx} cy={n.ly} r={R + 5}
                    fill="none" stroke={cfg.stroke} strokeWidth="1" opacity={0.4}
                    animate={{ r: [R + 5, R + 10, R + 5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
                <circle cx={n.lx} cy={n.ly} r={R} fill={cfg.fill} stroke={cfg.stroke} strokeWidth="1.5" />
                <text x={n.lx} y={n.ly - 3} textAnchor="middle" dominantBaseline="middle"
                  fill={cfg.text} fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">
                  {n.label}
                </text>
                {n.value !== undefined && (
                  <text x={n.lx} y={n.ly + 9} textAnchor="middle" dominantBaseline="middle"
                    fill={cfg.text} fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                    ={String(n.value)}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Call stack */}
      {callStack.length > 0 && (
        <div className="glass px-3 py-2 rounded-xl">
          <p className="text-xs text-white/40 mb-1.5 font-semibold">Call Stack (top → bottom)</p>
          <div className="flex flex-wrap gap-1">
            {[...callStack].reverse().map((call, i) => (
              <span key={i} className={`px-2 py-0.5 rounded-md text-xs font-mono ${
                i === 0 ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-white/5 text-white/50'
              }`}>
                {call}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
