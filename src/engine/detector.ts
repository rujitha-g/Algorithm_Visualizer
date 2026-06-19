import type { AlgorithmName, AlgorithmCategory, DetectionResult } from './types';

// ─── Keyword maps ─────────────────────────────────────────────────────────────
interface PatternRule {
  name: AlgorithmName;
  category: AlgorithmCategory;
  codePatterns: RegExp[];
  descPatterns: RegExp[];
  weight: number;
}

const RULES: PatternRule[] = [
  {
    name: 'Bubble Sort',
    category: 'sorting',
    weight: 1,
    codePatterns: [
      /bubble/i,
      /for\s*\(.*for\s*\(.*swap/s,
      /if\s*\(\s*arr\[j\]\s*>\s*arr\[j\s*\+\s*1\]/,
    ],
    descPatterns: [/bubble sort/i, /swap adjacent/i, /adjacent elements/i],
  },
  {
    name: 'Merge Sort',
    category: 'sorting',
    weight: 1,
    codePatterns: [
      /merge\s*sort/i,
      /mergeSort/,
      /merge\(/,
      /mid\s*=.*Math\.floor.*\/\s*2/,
      /left\.concat|\.concat\(right/,
    ],
    descPatterns: [/merge sort/i, /divide and conquer.*sort/i, /split.*merge/i],
  },
  {
    name: 'Quick Sort',
    category: 'sorting',
    weight: 1,
    codePatterns: [
      /quick\s*sort/i,
      /quickSort/,
      /pivot/i,
      /partition/i,
      /left.*pivot.*right/s,
    ],
    descPatterns: [/quick sort/i, /pivot/i, /partition.*sort/i],
  },
  {
    name: 'Insertion Sort',
    category: 'sorting',
    weight: 1,
    codePatterns: [
      /insertion\s*sort/i,
      /insertionSort/,
      /key\s*=\s*arr\[/,
      /while.*j\s*>=\s*0.*arr\[j\]/s,
    ],
    descPatterns: [/insertion sort/i, /insert.*sorted.*position/i, /build sorted.*one element/i],
  },
  {
    name: 'Binary Search',
    category: 'search',
    weight: 1,
    codePatterns: [
      /binary\s*search/i,
      /binarySearch/,
      /mid\s*=.*left.*right/,
      /low.*high.*mid/s,
      /Math\.floor.*\(low\s*\+\s*high\)/,
    ],
    descPatterns: [/binary search/i, /sorted array.*search/i, /halve.*search/i, /logarithmic.*search/i],
  },
  {
    name: 'Linear Search',
    category: 'search',
    weight: 0.8,
    codePatterns: [
      /linear\s*search/i,
      /linearSearch/,
      /for.*arr\[i\]\s*===\s*target/s,
      /for.*if.*===.*return\s*i/s,
    ],
    descPatterns: [/linear search/i, /sequential search/i, /scan.*array/i, /check each element/i],
  },
  {
    name: 'BFS',
    category: 'graph',
    weight: 1,
    codePatterns: [
      /bfs/i,
      /breadth.first/i,
      /queue\.push|enqueue/i,
      /queue\.shift|dequeue/i,
      /visited.*neighbors/s,
    ],
    descPatterns: [/bfs/i, /breadth.first/i, /level.by.level/i, /shortest path.*unweighted/i],
  },
  {
    name: 'DFS',
    category: 'graph',
    weight: 1,
    codePatterns: [
      /dfs/i,
      /depth.first/i,
      /stack\.push|stack\.pop/i,
      /visited.*recursive.*dfs/si,
      /function dfs/i,
    ],
    descPatterns: [/dfs/i, /depth.first/i, /explore.*deep/i, /backtrack/i, /recursive.*graph/i],
  },
  {
    name: 'Fibonacci',
    category: 'recursion',
    weight: 1,
    codePatterns: [
      /fibonacci|fib/i,
      /fib\(n\s*-\s*1\)\s*\+\s*fib\(n\s*-\s*2\)/,
      /return.*fib.*fib/,
    ],
    descPatterns: [/fibonacci/i, /fib sequence/i, /golden ratio/i, /f\(n\).*f\(n-1\).*f\(n-2\)/i],
  },
  {
    name: 'Factorial',
    category: 'recursion',
    weight: 0.9,
    codePatterns: [
      /factorial/i,
      /n\s*\*\s*factorial\(n\s*-\s*1\)/,
      /return n === 0|return n <= 1.*1/,
    ],
    descPatterns: [/factorial/i, /n!/i, /product.*1.*n/i],
  },
  {
    name: 'LCS',
    category: 'dp',
    weight: 1,
    codePatterns: [
      /lcs/i,
      /longest.common.subsequence/i,
      /dp\[i\]\[j\]/,
      /s1\[i-1\]\s*===\s*s2\[j-1\]/,
    ],
    descPatterns: [/longest common subsequence/i, /lcs/i, /common.*subsequence/i],
  },
  {
    name: 'Knapsack',
    category: 'dp',
    weight: 1,
    codePatterns: [
      /knapsack/i,
      /0.1.*knapsack/i,
      /dp\[i\]\[w\]/,
      /weight.*value.*capacity/i,
    ],
    descPatterns: [/knapsack/i, /0\/1 knapsack/i, /weight.*capacity.*maximize/i, /items.*bag/i],
  },
];

function score(input: string, patterns: RegExp[]): number {
  return patterns.reduce((acc, p) => acc + (p.test(input) ? 1 : 0), 0);
}

export function detectAlgorithm(input: string, inputType: 'code' | 'description'): DetectionResult {
  let bestScore = 0;
  let bestRule: PatternRule = RULES[0];

  for (const rule of RULES) {
    const allPatterns = [...rule.codePatterns, ...rule.descPatterns];
    const raw = score(input, allPatterns);
    const weighted = raw * rule.weight;
    if (weighted > bestScore) {
      bestScore = weighted;
      bestRule = rule;
    }
  }

  const maxPatterns = Math.max(
    bestRule.codePatterns.length,
    bestRule.descPatterns.length
  );
  const confidence = Math.min(1, bestScore / Math.max(1, maxPatterns));

  return {
    name: confidence > 0.1 ? bestRule.name : 'Unknown',
    category: confidence > 0.1 ? bestRule.category : 'unknown',
    confidence: confidence > 0.1 ? confidence : 0,
    inputType,
  };
}
