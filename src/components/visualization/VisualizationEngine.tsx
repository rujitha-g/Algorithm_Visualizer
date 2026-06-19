import { AnimatePresence, motion } from 'framer-motion';
import type { VisualizationFrame } from '../../engine/types';
import ArrayVisualizer from './ArrayVisualizer';
import GraphVisualizer from './GraphVisualizer';
import TreeVisualizer from './TreeVisualizer';
import DPTableVisualizer from './DPTableVisualizer';

interface Props {
  frame: VisualizationFrame;
}

export default function VisualizationEngine({ frame }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={frame.type}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="h-full"
      >
        {frame.type === 'array' && <ArrayVisualizer frame={frame} />}
        {frame.type === 'graph' && <GraphVisualizer frame={frame} />}
        {frame.type === 'tree'  && <TreeVisualizer frame={frame} />}
        {frame.type === 'dp'   && <DPTableVisualizer frame={frame} />}
      </motion.div>
    </AnimatePresence>
  );
}
