// ─── Algorithm Categories ────────────────────────────────────────────────────
export type AlgorithmCategory =
  | 'sorting'
  | 'search'
  | 'graph'
  | 'recursion'
  | 'dp'
  | 'unknown';

export type AlgorithmName =
  | 'Bubble Sort'
  | 'Merge Sort'
  | 'Quick Sort'
  | 'Insertion Sort'
  | 'Binary Search'
  | 'Linear Search'
  | 'BFS'
  | 'DFS'
  | 'Fibonacci'
  | 'Factorial'
  | 'LCS'
  | 'Knapsack'
  | 'Unknown';

// ─── Detection Result ─────────────────────────────────────────────────────────
export interface DetectionResult {
  name: AlgorithmName;
  category: AlgorithmCategory;
  confidence: number; // 0–1
  inputType: 'code' | 'description';
}

// ─── Visualization Frame Types ────────────────────────────────────────────────

// Array-based (sorting, search)
export type ArrayElementState =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'pivot'
  | 'found'
  | 'searching'
  | 'excluded';

export interface ArrayElement {
  value: number;
  state: ArrayElementState;
  index: number;
}

export interface ArrayFrame {
  type: 'array';
  elements: ArrayElement[];
  description: string;
  variables: Record<string, number | string | boolean | null>;
  pseudocodeLine?: number;
}

// Graph-based (BFS, DFS)
export type NodeState = 'default' | 'visiting' | 'visited' | 'frontier' | 'start' | 'end';
export type EdgeState = 'default' | 'traversed' | 'active';

export interface GraphNode {
  id: string;
  label: string;
  state: NodeState;
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  state: EdgeState;
}

export interface GraphFrame {
  type: 'graph';
  nodes: GraphNode[];
  edges: GraphEdge[];
  queue?: string[];
  stack?: string[];
  visited: string[];
  description: string;
  variables: Record<string, number | string | boolean | null>;
}

// Tree-based (recursion)
export type TreeNodeState = 'default' | 'active' | 'computing' | 'done' | 'memoized';

export interface TreeNode {
  id: string;
  label: string;
  value?: number | string;
  state: TreeNodeState;
  parentId?: string;
  depth: number;
  x?: number;
  y?: number;
}

export interface TreeFrame {
  type: 'tree';
  nodes: TreeNode[];
  description: string;
  variables: Record<string, number | string | boolean | null>;
  callStack: string[];
}

// DP Table
export interface DPCell {
  row: number;
  col: number;
  value: number | string;
  state: 'default' | 'active' | 'filled' | 'optimal';
}

export interface DPFrame {
  type: 'dp';
  table: DPCell[][];
  rowLabels: string[];
  colLabels: string[];
  description: string;
  variables: Record<string, number | string | boolean | null>;
  highlightCell?: { row: number; col: number };
}

export type VisualizationFrame = ArrayFrame | GraphFrame | TreeFrame | DPFrame;

// ─── Dry Run Step ─────────────────────────────────────────────────────────────
export interface DryRunStep {
  step: number;
  operation: string;
  variables: Record<string, number | string | boolean | null>;
  state: string;
  notes?: string;
}

// ─── Complexity Info ──────────────────────────────────────────────────────────
export interface ComplexityCase {
  label: string;
  time: string;
  space: string;
  explanation: string;
}

export interface ComplexityInfo {
  best: ComplexityCase;
  average: ComplexityCase;
  worst: ComplexityCase;
  spaceOverall: string;
  notes: string;
}

// ─── Edge Case ────────────────────────────────────────────────────────────────
export interface EdgeCase {
  title: string;
  description: string;
  example: string;
  impact: 'low' | 'medium' | 'high';
}

// ─── Full Analysis Result ─────────────────────────────────────────────────────
export interface AnalysisResult {
  detection: DetectionResult;
  frames: VisualizationFrame[];
  dryRun: DryRunStep[];
  complexity: ComplexityInfo;
  edgeCases: EdgeCase[];
  beginnerExplanation: string[];
  pseudocode: string[];
  sampleInput: string;
}
