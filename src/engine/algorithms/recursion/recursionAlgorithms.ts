import type { TreeFrame, TreeNode } from '../../types';

let nodeCounter = 0;

function makeId(label: string) {
  return `${label}-${nodeCounter++}`;
}

export function generateFibonacciFrames(n: number = 5): TreeFrame[] {
  nodeCounter = 0;
  const frames: TreeFrame[] = [];
  const allNodes: TreeNode[] = [];
  const callStack: string[] = [];

  function fib(num: number, parentId?: string, depth: number = 0): { id: string; value: number } {
    const id = makeId(`fib(${num})`);
    const node: TreeNode = {
      id, label: `fib(${num})`, state: 'active', parentId, depth,
    };
    allNodes.push(node);

    callStack.push(`fib(${num})`);
    frames.push({
      type: 'tree',
      nodes: allNodes.map(nd => ({
        ...nd,
        state: nd.id === id ? 'active' : nd.state === 'done' ? 'done' : 'default',
      })),
      description: `Calling fib(${num}). Call stack depth: ${depth + 1}.`,
      variables: { n: num, depth },
      callStack: [...callStack],
    });

    let value: number;
    if (num <= 1) {
      value = num;
    } else {
      const left = fib(num - 1, id, depth + 1);
      const right = fib(num - 2, id, depth + 1);
      value = left.value + right.value;
    }

    node.value = value;
    node.state = 'done';
    callStack.pop();

    frames.push({
      type: 'tree',
      nodes: allNodes.map(nd => ({
        ...nd,
        state: nd.id === id ? 'done' : nd.state,
      })),
      description: `fib(${num}) = ${value}. Returning to caller.`,
      variables: { n: num, result: value },
      callStack: [...callStack],
    });

    return { id, value };
  }

  fib(n);
  return frames;
}

export function generateFactorialFrames(n: number = 5): TreeFrame[] {
  nodeCounter = 0;
  const frames: TreeFrame[] = [];
  const allNodes: TreeNode[] = [];
  const callStack: string[] = [];

  function factorial(num: number, parentId?: string, depth: number = 0): number {
    const id = makeId(`fact(${num})`);
    const node: TreeNode = { id, label: `${num}!`, state: 'active', parentId, depth };
    allNodes.push(node);
    callStack.push(`${num}!`);

    frames.push({
      type: 'tree',
      nodes: allNodes.map(nd => ({ ...nd, state: nd.id === id ? 'active' : nd.state })),
      description: `Computing ${num}!. Base case: ${num} <= 1? ${num <= 1}.`,
      variables: { n: num, depth },
      callStack: [...callStack],
    });

    let result: number;
    if (num <= 1) {
      result = 1;
    } else {
      const sub = factorial(num - 1, id, depth + 1);
      result = num * sub;
    }

    node.value = result;
    node.state = 'done';
    callStack.pop();

    frames.push({
      type: 'tree',
      nodes: allNodes.map(nd => ({ ...nd, state: nd.id === id ? 'done' : nd.state })),
      description: `${num}! = ${result}.`,
      variables: { n: num, result },
      callStack: [...callStack],
    });

    return result;
  }

  factorial(n);
  return frames;
}
