import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { GraphFrame, GraphNode } from '../../engine/types';

const NODE_COLORS: Record<GraphNode['state'], { fill: string; stroke: string; text: string }> = {
  default:  { fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.2)', text: '#fff' },
  start:    { fill: 'rgba(59,130,246,0.3)',   stroke: '#3b82f6',               text: '#60a5fa' },
  visiting: { fill: 'rgba(245,158,11,0.3)',   stroke: '#f59e0b',               text: '#fbbf24' },
  frontier: { fill: 'rgba(139,92,246,0.3)',   stroke: '#8b5cf6',               text: '#a78bfa' },
  visited:  { fill: 'rgba(34,197,94,0.25)',   stroke: '#22c55e',               text: '#4ade80' },
  end:      { fill: 'rgba(6,182,212,0.3)',    stroke: '#06b6d4',               text: '#22d3ee' },
};

interface Props {
  frame: GraphFrame;
}

const SVG_W = 520;
const SVG_H = 360;
const R = 26;

export default function GraphVisualizer({ frame }: Props) {
  const { nodes, edges, queue, stack, visited, description, variables } = frame;

  const nodeMap = useMemo(() =>
    Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]
  );

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

      {/* SVG Graph */}
      <div className="flex-1 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full max-h-64"
          style={{ maxWidth: SVG_W }}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.3)" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map(edge => {
            const src = nodeMap[edge.source];
            const tgt = nodeMap[edge.target];
            if (!src || !tgt) return null;
            const isTraversed = edge.state === 'traversed';
            return (
              <motion.line
                key={edge.id}
                x1={src.position.x}
                y1={src.position.y}
                x2={tgt.position.x}
                y2={tgt.position.y}
                stroke={isTraversed ? '#3b82f6' : 'rgba(255,255,255,0.15)'}
                strokeWidth={isTraversed ? 2.5 : 1.5}
                strokeDasharray={isTraversed ? undefined : '4 4'}
                animate={{
                  stroke: isTraversed ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                  strokeWidth: isTraversed ? 2.5 : 1.5,
                  filter: isTraversed ? 'drop-shadow(0 0 4px rgba(59,130,246,0.8))' : undefined,
                }}
                transition={{ duration: 0.4 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const cfg = NODE_COLORS[node.state] ?? NODE_COLORS.default;
            return (
              <motion.g key={node.id} transform={`translate(${node.position.x},${node.position.y})`}>
                {/* Glow ring */}
                {node.state !== 'default' && (
                  <motion.circle
                    r={R + 6}
                    fill="none"
                    stroke={cfg.stroke}
                    strokeWidth="1"
                    opacity={0.3}
                    animate={{ r: [R + 6, R + 12, R + 6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {/* Main circle */}
                <motion.circle
                  r={R}
                  fill={cfg.fill}
                  stroke={cfg.stroke}
                  strokeWidth="2"
                  animate={{ fill: cfg.fill, stroke: cfg.stroke }}
                  transition={{ duration: 0.3 }}
                />
                {/* Label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={cfg.text}
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Queue / Stack display */}
      <div className="flex flex-wrap gap-2">
        {queue && (
          <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
            <span className="text-violet-400 font-semibold">Queue:</span>
            <span className="text-white/70 font-mono">
              [{queue.length > 0 ? queue.join(' → ') : 'empty'}]
            </span>
          </div>
        )}
        {stack && (
          <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
            <span className="text-amber-400 font-semibold">Stack:</span>
            <span className="text-white/70 font-mono">
              [{stack.length > 0 ? stack.join(' → ') : 'empty'}]
            </span>
          </div>
        )}
        {visited.length > 0 && (
          <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
            <span className="text-green-400 font-semibold">Visited:</span>
            <span className="text-white/70 font-mono">{visited.join(' → ')}</span>
          </div>
        )}
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
      <div className="flex flex-wrap gap-2">
        {Object.entries(NODE_COLORS).map(([state, cfg]) => (
          <div key={state} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border" style={{ background: cfg.fill, borderColor: cfg.stroke }} />
            <span className="text-[10px] text-white/40 capitalize">{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
