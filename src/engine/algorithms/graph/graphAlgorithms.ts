import type { GraphFrame, GraphNode, GraphEdge } from '../../types';

const SAMPLE_NODES: GraphNode[] = [
  { id: 'A', label: 'A', state: 'default', position: { x: 250, y: 50 } },
  { id: 'B', label: 'B', state: 'default', position: { x: 100, y: 160 } },
  { id: 'C', label: 'C', state: 'default', position: { x: 400, y: 160 } },
  { id: 'D', label: 'D', state: 'default', position: { x: 50,  y: 290 } },
  { id: 'E', label: 'E', state: 'default', position: { x: 180, y: 290 } },
  { id: 'F', label: 'F', state: 'default', position: { x: 340, y: 290 } },
  { id: 'G', label: 'G', state: 'default', position: { x: 460, y: 290 } },
];

const SAMPLE_EDGES: GraphEdge[] = [
  { id: 'AB', source: 'A', target: 'B', state: 'default' },
  { id: 'AC', source: 'A', target: 'C', state: 'default' },
  { id: 'BD', source: 'B', target: 'D', state: 'default' },
  { id: 'BE', source: 'B', target: 'E', state: 'default' },
  { id: 'CF', source: 'C', target: 'F', state: 'default' },
  { id: 'CG', source: 'C', target: 'G', state: 'default' },
];

const ADJACENCY: Record<string, string[]> = {
  A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F', 'G'],
  D: ['B'], E: ['B'], F: ['C'], G: ['C'],
};

function cloneNodes(nodes: GraphNode[], overrides: Partial<Record<string, GraphNode['state']>>): GraphNode[] {
  return nodes.map(n => ({ ...n, state: overrides[n.id] ?? n.state }));
}
export function generateBFSFrames(startNode = 'A'): GraphFrame[] {
  const frames: GraphFrame[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startNode];
  const visitedList: string[] = [];
  const nodeStates: Record<string, GraphNode['state']> = {};
  const edgeStates: Set<string> = new Set();

  SAMPLE_NODES.forEach(n => nodeStates[n.id] = 'default');
  nodeStates[startNode] = 'start';

  frames.push({
    type: 'graph',
    nodes: cloneNodes(SAMPLE_NODES, nodeStates),
    edges: SAMPLE_EDGES.map(e => ({ ...e, state: 'default' })),
    queue: [...queue],
    visited: [...visitedList],
    description: `BFS starting at node ${startNode}. Enqueue ${startNode}.`,
    variables: { start: startNode },
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    visitedList.push(current);
    nodeStates[current] = current === startNode ? 'start' : 'visiting';

    frames.push({
      type: 'graph',
      nodes: cloneNodes(SAMPLE_NODES, nodeStates),
      edges: SAMPLE_EDGES.map(e => ({ ...e, state: edgeStates.has(e.id) ? 'traversed' : 'default' })),
      queue: [...queue],
      visited: [...visitedList],
      description: `Dequeued ${current}. Exploring its neighbors.`,
      variables: { current, queueSize: queue.length },
    });

    for (const neighbor of (ADJACENCY[current] ?? [])) {
      if (!visited.has(neighbor)) {
        const edgeId = SAMPLE_EDGES.find(
          e => (e.source === current && e.target === neighbor) || (e.source === neighbor && e.target === current)
        )?.id;
        if (edgeId) edgeStates.add(edgeId);

        nodeStates[neighbor] = 'frontier';
        queue.push(neighbor);

        frames.push({
          type: 'graph',
          nodes: cloneNodes(SAMPLE_NODES, nodeStates),
          edges: SAMPLE_EDGES.map(e => ({ ...e, state: edgeStates.has(e.id) ? 'traversed' : 'default' })),
          queue: [...queue],
          visited: [...visitedList],
          description: `Neighbor ${neighbor} enqueued (not yet visited).`,
          variables: { current, neighbor, queueSize: queue.length },
        });
      }
    }
    nodeStates[current] = 'visited';
  }

  frames.push({
    type: 'graph',
    nodes: cloneNodes(SAMPLE_NODES, nodeStates),
    edges: SAMPLE_EDGES.map(e => ({ ...e, state: edgeStates.has(e.id) ? 'traversed' : 'default' })),
    queue: [],
    visited: [...visitedList],
    description: `✅ BFS complete. Visited order: ${visitedList.join(' → ')}.`,
    variables: { visitedOrder: visitedList.join(' → ') },
  });

  return frames;
}

export function generateDFSFrames(startNode = 'A'): GraphFrame[] {
  const frames: GraphFrame[] = [];
  const visited = new Set<string>();
  const visitedList: string[] = [];
  const nodeStates: Record<string, GraphNode['state']> = {};
  const edgeStates: Set<string> = new Set();
  const stack: string[] = [];

  SAMPLE_NODES.forEach(n => nodeStates[n.id] = 'default');
  nodeStates[startNode] = 'start';

  frames.push({
    type: 'graph',
    nodes: cloneNodes(SAMPLE_NODES, nodeStates),
    edges: SAMPLE_EDGES.map(e => ({ ...e, state: 'default' })),
    stack: [startNode],
    visited: [],
    description: `DFS starting at node ${startNode}.`,
    variables: { start: startNode },
  });

  function dfs(node: string) {
    if (visited.has(node)) return;
    visited.add(node);
    visitedList.push(node);
    stack.push(node);
    nodeStates[node] = node === startNode ? 'start' : 'visiting';

    frames.push({
      type: 'graph',
      nodes: cloneNodes(SAMPLE_NODES, nodeStates),
      edges: SAMPLE_EDGES.map(e => ({ ...e, state: edgeStates.has(e.id) ? 'traversed' : 'default' })),
      stack: [...stack],
      visited: [...visitedList],
      description: `Visiting ${node}. Call stack depth: ${stack.length}.`,
      variables: { node, stackDepth: stack.length },
    });

    for (const neighbor of (ADJACENCY[node] ?? [])) {
      if (!visited.has(neighbor)) {
        const edgeId = SAMPLE_EDGES.find(
          e => (e.source === node && e.target === neighbor) || (e.source === neighbor && e.target === node)
        )?.id;
        if (edgeId) edgeStates.add(edgeId);
        nodeStates[neighbor] = 'frontier';
        dfs(neighbor);
      }
    }

    nodeStates[node] = 'visited';
    stack.pop();
  }

  dfs(startNode);

  frames.push({
    type: 'graph',
    nodes: cloneNodes(SAMPLE_NODES, nodeStates),
    edges: SAMPLE_EDGES.map(e => ({ ...e, state: edgeStates.has(e.id) ? 'traversed' : 'default' })),
    stack: [],
    visited: [...visitedList],
    description: `✅ DFS complete. Visited order: ${visitedList.join(' → ')}.`,
    variables: { visitedOrder: visitedList.join(' → ') },
  });

  return frames;
}
