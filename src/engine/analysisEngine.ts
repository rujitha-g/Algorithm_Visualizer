import type {
  AlgorithmName, ComplexityInfo, EdgeCase, DryRunStep, VisualizationFrame, AnalysisResult, DetectionResult,
} from './types';
import { generateBubbleSortFrames, generateMergeSortFrames, generateQuickSortFrames, generateInsertionSortFrames } from './algorithms/sorting/sortingAlgorithms';
import { generateBinarySearchFrames, generateLinearSearchFrames } from './algorithms/search/searchAlgorithms';
import { generateBFSFrames, generateDFSFrames } from './algorithms/graph/graphAlgorithms';
import { generateFibonacciFrames, generateFactorialFrames } from './algorithms/recursion/recursionAlgorithms';
import { generateLCSFrames, generateKnapsackFrames } from './algorithms/dp/dpAlgorithms';

// ─── Complexity Database ──────────────────────────────────────────────────────
const COMPLEXITY_DB: Record<AlgorithmName, ComplexityInfo> = {
  'Bubble Sort': {
    best: { label: 'Best', time: 'O(n)', space: 'O(1)', explanation: 'Already sorted array — only one pass needed with no swaps.' },
    average: { label: 'Average', time: 'O(n²)', space: 'O(1)', explanation: 'Random input requires roughly n²/2 comparisons.' },
    worst: { label: 'Worst', time: 'O(n²)', space: 'O(1)', explanation: 'Reverse-sorted input — maximum comparisons and swaps.' },
    spaceOverall: 'O(1)',
    notes: 'Bubble Sort is simple but inefficient for large datasets. It is stable and in-place.',
  },
  'Merge Sort': {
    best: { label: 'Best', time: 'O(n log n)', space: 'O(n)', explanation: 'Always divides into equal halves regardless of input.' },
    average: { label: 'Average', time: 'O(n log n)', space: 'O(n)', explanation: 'Consistent performance across all input types.' },
    worst: { label: 'Worst', time: 'O(n log n)', space: 'O(n)', explanation: 'Same as best — guaranteed O(n log n).' },
    spaceOverall: 'O(n)',
    notes: 'Merge Sort is stable and guaranteed O(n log n), but requires O(n) extra space for merging.',
  },
  'Quick Sort': {
    best: { label: 'Best', time: 'O(n log n)', space: 'O(log n)', explanation: 'Pivot always lands at the median, balanced partitions.' },
    average: { label: 'Average', time: 'O(n log n)', space: 'O(log n)', explanation: 'Random pivot placement gives good average performance.' },
    worst: { label: 'Worst', time: 'O(n²)', space: 'O(n)', explanation: 'Pivot always chosen as min/max (e.g. sorted array with last-element pivot).' },
    spaceOverall: 'O(log n)',
    notes: 'Quick Sort is cache-friendly and in-place (excluding stack), but unstable. Randomized pivot selection mitigates worst-case.',
  },
  'Insertion Sort': {
    best: { label: 'Best', time: 'O(n)', space: 'O(1)', explanation: 'Already sorted — each element is already in place.' },
    average: { label: 'Average', time: 'O(n²)', space: 'O(1)', explanation: 'On average, each element shifts halfway through the sorted portion.' },
    worst: { label: 'Worst', time: 'O(n²)', space: 'O(1)', explanation: 'Reverse-sorted input — every element shifts all the way to position 0.' },
    spaceOverall: 'O(1)',
    notes: 'Insertion Sort is efficient for small or nearly-sorted arrays. It is stable and adaptive.',
  },
  'Binary Search': {
    best: { label: 'Best', time: 'O(1)', space: 'O(1)', explanation: 'Target is at the midpoint on the first check.' },
    average: { label: 'Average', time: 'O(log n)', space: 'O(1)', explanation: 'Halves the search space each step — logarithmic comparisons.' },
    worst: { label: 'Worst', time: 'O(log n)', space: 'O(1)', explanation: 'Target is at the boundary or not present — maximum log₂(n) steps.' },
    spaceOverall: 'O(1)',
    notes: 'Binary Search requires a sorted array. Iterative version uses O(1) space; recursive uses O(log n) stack space.',
  },
  'Linear Search': {
    best: { label: 'Best', time: 'O(1)', space: 'O(1)', explanation: 'Target is the first element.' },
    average: { label: 'Average', time: 'O(n)', space: 'O(1)', explanation: 'On average scans n/2 elements.' },
    worst: { label: 'Worst', time: 'O(n)', space: 'O(1)', explanation: 'Target is last or not in array — scans all n elements.' },
    spaceOverall: 'O(1)',
    notes: 'Linear Search works on unsorted data. Simple but slow for large datasets.',
  },
  'BFS': {
    best: { label: 'Best', time: 'O(V + E)', space: 'O(V)', explanation: 'Target found close to start node.' },
    average: { label: 'Average', time: 'O(V + E)', space: 'O(V)', explanation: 'Visits all vertices V and edges E.' },
    worst: { label: 'Worst', time: 'O(V + E)', space: 'O(V)', explanation: 'Target at far end or not present — full traversal.' },
    spaceOverall: 'O(V)',
    notes: 'BFS uses a queue, guarantees shortest path in unweighted graphs. Space is proportional to the widest level of the graph.',
  },
  'DFS': {
    best: { label: 'Best', time: 'O(V + E)', space: 'O(V)', explanation: 'Target on first deep path explored.' },
    average: { label: 'Average', time: 'O(V + E)', space: 'O(V)', explanation: 'Explores all vertices and edges.' },
    worst: { label: 'Worst', time: 'O(V + E)', space: 'O(V)', explanation: 'Target at the last path explored — full traversal.' },
    spaceOverall: 'O(V)',
    notes: 'DFS uses a stack (or recursion). Great for cycle detection, topological sort, and maze solving.',
  },
  'Fibonacci': {
    best: { label: 'Best (Recursive)', time: 'O(2ⁿ)', space: 'O(n)', explanation: 'Even for small n, exponential branches are created.' },
    average: { label: 'With Memoization', time: 'O(n)', space: 'O(n)', explanation: 'Each subproblem computed once and cached.' },
    worst: { label: 'Worst (Naive)', time: 'O(2ⁿ)', space: 'O(n)', explanation: 'Naive recursion recomputes all overlapping subproblems.' },
    spaceOverall: 'O(n)',
    notes: 'Naive Fibonacci is classic exponential recursion. With memoization (DP) it drops to O(n). Bottom-up DP achieves O(1) space.',
  },
  'Factorial': {
    best: { label: 'Best', time: 'O(n)', space: 'O(n)', explanation: 'Always performs n multiplications.' },
    average: { label: 'Average', time: 'O(n)', space: 'O(n)', explanation: 'n recursive calls on the call stack.' },
    worst: { label: 'Worst', time: 'O(n)', space: 'O(n)', explanation: 'Same — linear regardless of input value.' },
    spaceOverall: 'O(n)',
    notes: 'Factorial grows astronomically fast (n=20 exceeds 64-bit integer). Iterative version is O(1) space.',
  },
  'LCS': {
    best: { label: 'Best', time: 'O(m·n)', space: 'O(m·n)', explanation: 'Must fill entire DP table regardless of match frequency.' },
    average: { label: 'Average', time: 'O(m·n)', space: 'O(m·n)', explanation: 'Standard DP tabulation of m×n subproblems.' },
    worst: { label: 'Worst', time: 'O(m·n)', space: 'O(m·n)', explanation: 'No shortcuts available — every cell is computed.' },
    spaceOverall: 'O(m·n)',
    notes: 'LCS is a classic DP problem. Space can be optimized to O(min(m,n)) using only two rows.',
  },
  'Knapsack': {
    best: { label: 'Best', time: 'O(n·W)', space: 'O(n·W)', explanation: 'All items fit — but DP table still requires full computation.' },
    average: { label: 'Average', time: 'O(n·W)', space: 'O(n·W)', explanation: 'n items × W capacity cells computed.' },
    worst: { label: 'Worst', time: 'O(n·W)', space: 'O(n·W)', explanation: 'Same — pseudopolynomial complexity due to W.' },
    spaceOverall: 'O(n·W)',
    notes: '0/1 Knapsack is NP-hard but solvable in pseudopolynomial time via DP. Space can be optimized to O(W) using a 1D array.',
  },
  'Unknown': {
    best: { label: 'Best', time: 'N/A', space: 'N/A', explanation: 'Algorithm not detected.' },
    average: { label: 'Average', time: 'N/A', space: 'N/A', explanation: '' },
    worst: { label: 'Worst', time: 'N/A', space: 'N/A', explanation: '' },
    spaceOverall: 'N/A',
    notes: 'Please provide a recognized algorithm for complexity analysis.',
  },
};

// ─── Edge Cases Database ──────────────────────────────────────────────────────
const EDGE_CASES_DB: Record<AlgorithmName, EdgeCase[]> = {
  'Bubble Sort': [
    { title: 'Empty Array', description: 'Input array is empty []', example: '[] → []', impact: 'low' },
    { title: 'Single Element', description: 'Array with one element is already sorted.', example: '[5] → [5]', impact: 'low' },
    { title: 'Already Sorted', description: 'Naïve version still does O(n²) comparisons. Optimized version exits early.', example: '[1,2,3] → [1,2,3]', impact: 'medium' },
    { title: 'All Identical Elements', description: 'No swaps needed; comparisons still happen.', example: '[4,4,4] → [4,4,4]', impact: 'low' },
    { title: 'Reverse Sorted', description: 'Worst case — maximum comparisons and swaps needed.', example: '[5,4,3,2,1] → [1,2,3,4,5]', impact: 'high' },
  ],
  'Merge Sort': [
    { title: 'Empty Array', description: 'Returns immediately — nothing to split.', example: '[] → []', impact: 'low' },
    { title: 'Single Element', description: 'Base case — already sorted.', example: '[7] → [7]', impact: 'low' },
    { title: 'Duplicate Values', description: 'Stable sort preserves original order of duplicates.', example: '[3,1,3,2] → [1,2,3,3]', impact: 'low' },
    { title: 'Large Arrays', description: 'Recursion depth is O(log n) — stack overflow unlikely but possible for extreme n.', example: 'n = 10⁷', impact: 'medium' },
  ],
  'Quick Sort': [
    { title: 'Already Sorted (last pivot)', description: 'Degenerates to O(n²) if last element is always chosen as pivot.', example: '[1,2,3,4,5] → worst case', impact: 'high' },
    { title: 'All Duplicates', description: 'Naïve partition creates unbalanced partitions. 3-way partition fixes this.', example: '[3,3,3,3] → O(n²) without 3-way', impact: 'high' },
    { title: 'Empty/Single Element', description: 'Handled by the low >= high base case.', example: '[] or [1]', impact: 'low' },
    { title: 'Negative Numbers', description: 'Standard comparison works fine with negatives.', example: '[-3,-1,-4,-2]', impact: 'low' },
  ],
  'Insertion Sort': [
    { title: 'Already Sorted', description: 'Best case — each element is already in position, O(n) total.', example: '[1,2,3] → O(n)', impact: 'low' },
    { title: 'Reverse Sorted', description: 'Worst case — every element is shifted all the way to index 0.', example: '[5,4,3,2,1] → O(n²)', impact: 'high' },
    { title: 'Single Element', description: 'Loop does not execute — immediately done.', example: '[42] → [42]', impact: 'low' },
    { title: 'Large Datasets', description: 'Very slow for n > 10,000 due to O(n²) shifts.', example: 'n = 100,000', impact: 'high' },
  ],
  'Binary Search': [
    { title: 'Unsorted Array', description: 'Binary Search REQUIRES a sorted array. Incorrect results on unsorted input.', example: '[3,1,4,2] — UNDEFINED BEHAVIOR', impact: 'high' },
    { title: 'Target Not Present', description: 'Returns -1 when low > high. Must handle this return value.', example: 'target=99 not in array', impact: 'medium' },
    { title: 'Empty Array', description: 'Loop never executes — immediately returns -1.', example: '[], target=5 → -1', impact: 'low' },
    { title: 'Integer Overflow (mid)', description: 'mid = (low+high)/2 can overflow for large indices. Use mid = low + (high-low)/2.', example: 'large array indices', impact: 'high' },
    { title: 'Duplicate Values', description: 'Returns one occurrence but not necessarily first/last. Use lower_bound for that.', example: '[2,2,2,2], target=2', impact: 'medium' },
  ],
  'Linear Search': [
    { title: 'Empty Array', description: 'Loop never executes, returns -1 immediately.', example: '[] → -1', impact: 'low' },
    { title: 'Target Not Present', description: 'Scans entire array — O(n) wasted work.', example: 'target=99, array has no 99', impact: 'medium' },
    { title: 'Multiple Occurrences', description: 'Returns index of FIRST occurrence only.', example: '[2,4,2,6], target=2 → index 0', impact: 'low' },
    { title: 'null / undefined', description: 'Comparison with null/undefined may give unexpected results in JS.', example: 'arr=[null,1,2], target=null', impact: 'medium' },
  ],
  'BFS': [
    { title: 'Disconnected Graph', description: 'BFS from one node won\'t visit disconnected components. Run BFS from all unvisited nodes.', example: 'Graph with 2 separate components', impact: 'high' },
    { title: 'Cyclic Graph', description: 'Without visited set, BFS loops infinitely. Always track visited nodes.', example: 'A→B→C→A cycle', impact: 'high' },
    { title: 'Empty Graph', description: 'No nodes to visit — returns empty result immediately.', example: 'graph = {}', impact: 'low' },
    { title: 'Start Node Isolated', description: 'Only the start node is visited if it has no edges.', example: 'Node A has no neighbors', impact: 'medium' },
  ],
  'DFS': [
    { title: 'Cyclic Graph', description: 'Without visited tracking, DFS recurses infinitely. Always mark visited before recursing.', example: 'A→B→A cycle', impact: 'high' },
    { title: 'Deep Graphs / Stack Overflow', description: 'Recursive DFS hits call stack limit for very deep graphs. Use iterative DFS for safety.', example: 'Linear chain of 10,000 nodes', impact: 'high' },
    { title: 'Disconnected Graph', description: 'Only visits nodes reachable from start. Must restart from unvisited nodes.', example: '2 disconnected components', impact: 'high' },
    { title: 'Self-Loop', description: 'Edge from node to itself. Visited check handles this correctly.', example: 'A→A', impact: 'medium' },
  ],
  'Fibonacci': [
    { title: 'n = 0 or n = 1', description: 'Base cases — must return immediately to stop recursion.', example: 'fib(0)=0, fib(1)=1', impact: 'high' },
    { title: 'Negative Input', description: 'Undefined behavior in standard definition. Add validation or extend definition.', example: 'fib(-1) → error or undefined', impact: 'high' },
    { title: 'Large n (naive recursion)', description: 'fib(50) takes billions of calls naively. Use memoization or DP.', example: 'fib(50) without memo → ~2⁵⁰ calls', impact: 'high' },
    { title: 'Integer Overflow', description: 'fib(79) exceeds 64-bit integer. Use BigInt in JavaScript.', example: 'fib(100) overflows Number.MAX_SAFE_INTEGER', impact: 'medium' },
  ],
  'Factorial': [
    { title: 'n = 0', description: 'Base case — 0! = 1. Must return 1, not 0.', example: 'factorial(0) = 1', impact: 'high' },
    { title: 'Negative Input', description: 'Factorial is undefined for negative integers. Must validate input.', example: 'factorial(-1) → infinite recursion', impact: 'high' },
    { title: 'Integer Overflow', description: 'factorial(21) > Number.MAX_SAFE_INTEGER in JS. Use BigInt.', example: 'factorial(20) = 2,432,902,008,176,640,000', impact: 'medium' },
    { title: 'Non-integer Input', description: 'Standard definition only for non-negative integers. Gamma function extends it.', example: 'factorial(3.5) → undefined', impact: 'low' },
  ],
  'LCS': [
    { title: 'Empty Strings', description: 'LCS of empty string and any string is 0.', example: 'LCS("", "ABC") = 0', impact: 'low' },
    { title: 'Identical Strings', description: 'LCS equals the full string length.', example: 'LCS("ABC","ABC") = 3', impact: 'low' },
    { title: 'No Common Characters', description: 'LCS = 0. Table fills with zeros.', example: 'LCS("ABC","XYZ") = 0', impact: 'low' },
    { title: 'Case Sensitivity', description: 'Standard LCS is case-sensitive. "a" ≠ "A".', example: 'LCS("abc","ABC") = 0 by default', impact: 'medium' },
    { title: 'Very Long Strings', description: 'O(m·n) memory — strings of length 10,000 need 100MB table.', example: 'm=n=10,000', impact: 'high' },
  ],
  'Knapsack': [
    { title: 'Capacity = 0', description: 'No item can be taken — maximum value = 0.', example: 'W=0 → value=0', impact: 'low' },
    { title: 'No Items', description: 'Empty item list — value = 0.', example: 'n=0 → value=0', impact: 'low' },
    { title: 'Item Heavier than Capacity', description: 'Item is simply skipped — dp[i][w] = dp[i-1][w].', example: 'weight=10, capacity=5', impact: 'low' },
    { title: 'All Items Same Weight', description: 'Algorithm still works correctly via DP table.', example: 'weights=[2,2,2], capacity=4', impact: 'low' },
    { title: 'Large Capacity', description: 'O(n·W) — if W is 10⁹, pseudopolynomial is no longer practical.', example: 'n=100, W=10⁹ → out of memory', impact: 'high' },
  ],
  'Unknown': [],
};

// ─── Explanations Database ────────────────────────────────────────────────────
export const EXPLANATIONS_DB: Record<AlgorithmName, string[]> = {
  'Bubble Sort': [
    ' Bubble Sort works like bubbles rising to the surface — the largest unsorted number "bubbles up" to its correct position each pass.',
    ' We compare adjacent pairs. If the left one is bigger, we swap them.',
    ' After each full pass through the array, the largest remaining unsorted element is guaranteed to be in its final position.',
    ' We repeat this process n-1 times (where n is the array length), shrinking the unsorted portion by 1 each time.',
    ' The array is sorted once no swaps are needed in a pass.',
  ],
  'Merge Sort': [
    ' Merge Sort uses "divide and conquer" — it splits the array in half, sorts each half, then merges them back.',
    ' The array keeps splitting until each piece has just 1 element (which is trivially sorted).',
    ' Then we merge pieces together: compare the front of each piece, pick the smaller one, repeat.',
    ' Merging two sorted arrays always produces a sorted array — this is the key insight.',
    ' Result: a fully sorted array with guaranteed O(n log n) performance.',
  ],
  'Quick Sort': [
    ' Quick Sort picks a "pivot" element and rearranges the array so everything smaller is on the left, larger on the right.',
    ' The pivot ends up in its exact final sorted position after one partition step.',
    ' We then recursively Quick Sort the left and right sub-arrays.',
    ' The magic: no merging step needed — sorting happens in-place during partitioning.',
    ' Average case is extremely fast in practice due to cache efficiency.',
  ],
  'Insertion Sort': [
    ' Think of sorting playing cards in your hand — you pick up each card and insert it into the right position among the already-sorted cards.',
    ' For each element, we "shift" larger elements one position to the right to make room.',
    ' The left portion of the array is always kept sorted as we process each new element.',
    ' Very efficient for small arrays or nearly-sorted data — often used for the base case in hybrid sorts like Timsort.',
    ' Despite O(n²) worst-case time complexity, it requires only O(1) auxiliary space, making it highly memory-efficient.',
  ],
  'Binary Search': [
    ' Imagine finding a word in a dictionary — you open to the middle, decide if your word comes before or after, then repeat in that half.',
    ' Binary Search requires the array to be sorted. This is non-negotiable.',
    ' Each step eliminates half the remaining search space: after k steps, only n/2ᵏ elements remain.',
    ' After at most log₂(n) steps, we either find the target or confirm it\'s absent.',
    ' Dramatically faster than Linear Search for large sorted datasets.',
  ],
  'Linear Search': [
    ' Linear Search is the simplest approach — check every element one by one until you find the target.',
    ' No preprocessing needed — works on unsorted arrays unlike Binary Search.',
    ' Best case: target is first element (O(1)). Worst case: target is last or absent (O(n)).',
    ' Perfect for small arrays, one-time searches, or when the array is unsorted.',
    ' It requires no additional memory, operating completely in-place with O(1) space complexity.',
  ],
  'BFS': [
    ' BFS (Breadth-First Search) explores a graph level by level — like ripples spreading outward from a stone thrown in water.',
    ' It uses a Queue: visit a node, enqueue all its unvisited neighbors, then process the queue one by one.',
    ' BFS guarantees the shortest path (fewest edges) between the start node and any reachable node.',
    ' Great for: shortest path, level-order traversal, social network "degrees of separation".',
    ' Memory usage can be high for wide graphs, as it must store all nodes of the current level in the queue.',
  ],
  'DFS': [
    ' DFS (Depth-First Search) explores as deep as possible along one path before backtracking — like exploring a maze by always going forward until you hit a dead end.',
    ' It uses a Stack (or recursion): visit a node, then immediately recurse into its first unvisited neighbor.',
    ' when stuck (no unvisited neighbors), it backtracks and tries the next branch.',
    ' Great for: cycle detection, topological sorting, solving mazes, finding connected components.',
    ' It may not find the shortest path and can run into infinite loops on cyclic graphs without proper visited-tracking.',
  ],
  'Fibonacci': [
    ' The Fibonacci sequence: each number is the sum of the two before it. F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3...',
    ' The recursive formula F(n) = F(n-1) + F(n-2) mirrors the definition directly but creates a huge call tree.',
    ' Naive recursion recomputes the same values repeatedly — F(5) computes F(3) twice, F(2) three times!',
    ' Memoization (caching results) fixes this: compute each F(k) exactly once → O(n) time.',
    ' Bottom-up DP computes F(0) → F(1) → ... → F(n) iteratively with O(1) space.',
  ],
  'Factorial': [
    ' Factorial of n (written n!) is the product of all integers from 1 to n. Example: 5! = 5×4×3×2×1 = 120.',
    ' The recursive definition: n! = n × (n-1)!  with base case 0! = 1.',
    ' Each recursive call adds a frame to the call stack — so n! uses O(n) stack space.',
    ' Numbers grow extremely fast — 21! exceeds JavaScript\'s safe integer limit.',
    ' For large n, use BigInt in JavaScript or an iterative approach.',
  ],
  'LCS': [
    ' LCS finds the longest subsequence common to two sequences (not necessarily contiguous).',
    ' We build a DP table where dp[i][j] = length of LCS of s1[0..i-1] and s2[0..j-1].',
    ' If characters match: dp[i][j] = dp[i-1][j-1] + 1 (extend the LCS by this character).',
    ' If no match: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (best LCS ignoring one character).',
    ' The answer is in dp[m][n]. Trace back through the table to reconstruct the actual subsequence.',
  ],
  'Knapsack': [
    ' You have a knapsack with weight capacity W and n items, each with a weight and value. Maximize total value without exceeding W.',
    ' For each item, you have a binary choice: include it or exclude it (hence "0/1 Knapsack").',
    ' dp[i][w] = max value using first i items with capacity w.',
    ' If item i fits (weight[i] ≤ w): dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i]).',
    ' If item doesn\'t fit: dp[i][w] = dp[i-1][w] (skip the item).',
  ],
  'Unknown': ['Algorithm not recognized. Please try entering code or a description of a known algorithm.'],
};

// ─── Pseudocode Database ──────────────────────────────────────────────────────
export const PSEUDOCODE_DB: Record<AlgorithmName, string[]> = {
  'Bubble Sort': [
    'for i = 0 to n-2:',
    '  for j = 0 to n-2-i:',
    '    if arr[j] > arr[j+1]:',
    '      swap(arr[j], arr[j+1])',
    '  // largest element in arr[0..n-1-i] is now at n-1-i',
    'return arr',
  ],
  'Merge Sort': [
    'function mergeSort(arr, left, right):',
    '  if left >= right: return',
    '  mid = floor((left + right) / 2)',
    '  mergeSort(arr, left, mid)',
    '  mergeSort(arr, mid+1, right)',
    '  merge(arr, left, mid, right)',
  ],
  'Quick Sort': [
    'function quickSort(arr, low, high):',
    '  if low < high:',
    '    pivot_idx = partition(arr, low, high)',
    '    quickSort(arr, low, pivot_idx - 1)',
    '    quickSort(arr, pivot_idx + 1, high)',
    'function partition(arr, low, high):',
    '  pivot = arr[high]',
    '  i = low - 1',
    '  for j = low to high-1:',
    '    if arr[j] < pivot: swap(arr[++i], arr[j])',
    '  swap(arr[i+1], arr[high])',
    '  return i + 1',
  ],
  'Insertion Sort': [
    'for i = 1 to n-1:',
    '  key = arr[i]',
    '  j = i - 1',
    '  while j >= 0 and arr[j] > key:',
    '    arr[j+1] = arr[j]',
    '    j = j - 1',
    '  arr[j+1] = key',
  ],
  'Binary Search': [
    'function binarySearch(arr, target):',
    '  low = 0, high = n - 1',
    '  while low <= high:',
    '    mid = floor((low + high) / 2)',
    '    if arr[mid] == target: return mid',
    '    else if arr[mid] < target: low = mid + 1',
    '    else: high = mid - 1',
    '  return -1',
  ],
  'Linear Search': [
    'function linearSearch(arr, target):',
    '  for i = 0 to n-1:',
    '    if arr[i] == target: return i',
    '  return -1',
  ],
  'BFS': [
    'function BFS(graph, start):',
    '  visited = {start}',
    '  queue = [start]',
    '  while queue is not empty:',
    '    node = queue.dequeue()',
    '    for neighbor in graph[node]:',
    '      if neighbor not in visited:',
    '        visited.add(neighbor)',
    '        queue.enqueue(neighbor)',
  ],
  'DFS': [
    'function DFS(graph, node, visited={}):',
    '  if node in visited: return',
    '  visited.add(node)',
    '  for neighbor in graph[node]:',
    '    DFS(graph, neighbor, visited)',
  ],
  'Fibonacci': [
    'function fib(n):',
    '  if n <= 1: return n',
    '  return fib(n-1) + fib(n-2)',
    '',
    '// Memoized version:',
    'memo = {}',
    'function fib(n):',
    '  if n in memo: return memo[n]',
    '  if n <= 1: return n',
    '  memo[n] = fib(n-1) + fib(n-2)',
    '  return memo[n]',
  ],
  'Factorial': [
    'function factorial(n):',
    '  if n <= 1: return 1',
    '  return n * factorial(n-1)',
  ],
  'LCS': [
    'function LCS(s1, s2):',
    '  m = len(s1), n = len(s2)',
    '  dp = 2D array of size (m+1)×(n+1) initialized to 0',
    '  for i = 1 to m:',
    '    for j = 1 to n:',
    '      if s1[i-1] == s2[j-1]:',
    '        dp[i][j] = dp[i-1][j-1] + 1',
    '      else:',
    '        dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    '  return dp[m][n]',
  ],
  'Knapsack': [
    'function knapsack(weights, values, W, n):',
    '  dp = 2D array (n+1)×(W+1) initialized to 0',
    '  for i = 1 to n:',
    '    for w = 0 to W:',
    '      if weights[i-1] <= w:',
    '        dp[i][w] = max(dp[i-1][w],',
    '                       dp[i-1][w-weights[i-1]] + values[i-1])',
    '      else:',
    '        dp[i][w] = dp[i-1][w]',
    '  return dp[n][W]',
  ],
  'Unknown': ['// Algorithm not recognized.'],
};

// ─── Sample Input Labels ──────────────────────────────────────────────────────
const SAMPLE_INPUTS: Record<AlgorithmName, string> = {
  'Bubble Sort': 'arr = [64, 34, 25, 12, 22, 11, 90]',
  'Merge Sort': 'arr = [38, 27, 43, 3, 9, 82, 10]',
  'Quick Sort': 'arr = [10, 7, 8, 9, 1, 5]',
  'Insertion Sort': 'arr = [12, 11, 13, 5, 6]',
  'Binary Search': 'arr = [1,3,5,7,9,11,13,15,17,19], target = 7',
  'Linear Search': 'arr = [4,2,7,1,9,3,6], target = 9',
  'BFS': 'graph = {A:[B,C], B:[D,E], C:[F,G]}, start = A',
  'DFS': 'graph = {A:[B,C], B:[D,E], C:[F,G]}, start = A',
  'Fibonacci': 'n = 5',
  'Factorial': 'n = 5',
  'LCS': 's1 = "ABCBDAB", s2 = "BDCAB"',
  'Knapsack': 'weights=[1,3,4,5], values=[1,4,5,7], W=7',
  'Unknown': '',
};

// ─── Dry Run Generator ────────────────────────────────────────────────────────
function generateDryRun(name: AlgorithmName): DryRunStep[] {
  switch (name) {
    case 'Bubble Sort': return [
      { step: 1, operation: 'Outer loop i=0', variables: { i: 0 }, state: 'Start outer pass', notes: 'n-1 passes total' },
      { step: 2, operation: 'Compare arr[0]=64 vs arr[1]=34', variables: { j: 0, 'arr[j]': 64, 'arr[j+1]': 34 }, state: 'Comparing', notes: '64 > 34 → swap' },
      { step: 3, operation: 'Swap 64 ↔ 34', variables: { 'arr[0]': 34, 'arr[1]': 64 }, state: 'Swapped', notes: 'Larger bubbles right' },
      { step: 4, operation: 'Compare arr[1]=64 vs arr[2]=25', variables: { j: 1, 'arr[j]': 64, 'arr[j+1]': 25 }, state: 'Comparing', notes: '64 > 25 → swap' },
      { step: 5, operation: '...continues...', variables: {}, state: 'Repeating', notes: 'After pass 0: 90 at last position' },
      { step: 6, operation: 'Outer loop i=1', variables: { i: 1 }, state: 'Start outer pass', notes: 'Exclude last sorted element' },
      { step: 7, operation: 'Final state', variables: { sorted: 1 }, state: 'Complete', notes: '[11,12,22,25,34,64,90]' },
    ];
    case 'Binary Search': return [
      { step: 1, operation: 'Initialize', variables: { low: 0, high: 9, target: 7 }, state: 'Start', notes: 'Array has 10 elements' },
      { step: 2, operation: 'Compute mid = ⌊(0+9)/2⌋ = 4', variables: { mid: 4, 'arr[4]': 9 }, state: 'Checking mid', notes: '9 > 7 → go left' },
      { step: 3, operation: 'Update high = 3', variables: { low: 0, high: 3 }, state: 'Left half', notes: 'Eliminated right half' },
      { step: 4, operation: 'mid = ⌊(0+3)/2⌋ = 1', variables: { mid: 1, 'arr[1]': 3 }, state: 'Checking mid', notes: '3 < 7 → go right' },
      { step: 5, operation: 'Update low = 2', variables: { low: 2, high: 3 }, state: 'Right half', notes: 'Eliminated left half' },
      { step: 6, operation: 'mid = ⌊(2+3)/2⌋ = 2', variables: { mid: 2, 'arr[2]': 5 }, state: 'Checking mid', notes: '5 < 7 → go right' },
      { step: 7, operation: 'mid = ⌊(3+3)/2⌋ = 3', variables: { mid: 3, 'arr[3]': 7 }, state: 'Found!', notes: 'arr[3]=7 == target=7 ✅' },
    ];
    case 'BFS': return [
      { step: 1, operation: 'Initialize', variables: { queue: '[A]', visited: '{}' }, state: 'Start', notes: 'Enqueue start node A' },
      { step: 2, operation: 'Dequeue A, visit neighbors B, C', variables: { queue: '[B,C]', visited: '{A}' }, state: 'Visiting A', notes: 'B and C enqueued' },
      { step: 3, operation: 'Dequeue B, visit neighbors D, E', variables: { queue: '[C,D,E]', visited: '{A,B}' }, state: 'Visiting B', notes: '' },
      { step: 4, operation: 'Dequeue C, visit neighbors F, G', variables: { queue: '[D,E,F,G]', visited: '{A,B,C}' }, state: 'Visiting C', notes: '' },
      { step: 5, operation: 'Dequeue D,E,F,G (leaf nodes)', variables: { queue: '[]', visited: '{A,B,C,D,E,F,G}' }, state: 'Complete', notes: 'BFS order: A→B→C→D→E→F→G' },
    ];
    default: return [
      { step: 1, operation: 'Start', variables: {}, state: 'Initialized', notes: 'See visualization for step-by-step details.' },
    ];
  }
}

// ─── Frame Generator Dispatch ─────────────────────────────────────────────────
function generateFrames(name: AlgorithmName): VisualizationFrame[] {
  switch (name) {
    case 'Bubble Sort': return generateBubbleSortFrames();
    case 'Merge Sort': return generateMergeSortFrames();
    case 'Quick Sort': return generateQuickSortFrames();
    case 'Insertion Sort': return generateInsertionSortFrames();
    case 'Binary Search': return generateBinarySearchFrames();
    case 'Linear Search': return generateLinearSearchFrames();
    case 'BFS': return generateBFSFrames();
    case 'DFS': return generateDFSFrames();
    case 'Fibonacci': return generateFibonacciFrames(5);
    case 'Factorial': return generateFactorialFrames(5);
    case 'LCS': return generateLCSFrames();
    case 'Knapsack': return generateKnapsackFrames();
    default: return [];
  }
}

// ─── Main Analysis Function ───────────────────────────────────────────────────
export function runAnalysis(detection: DetectionResult): AnalysisResult {
  const name = detection.name;
  return {
    detection,
    frames: generateFrames(name),
    dryRun: generateDryRun(name),
    complexity: COMPLEXITY_DB[name] ?? COMPLEXITY_DB['Unknown'],
    edgeCases: EDGE_CASES_DB[name] ?? [],
    beginnerExplanation: EXPLANATIONS_DB[name] ?? [],
    pseudocode: PSEUDOCODE_DB[name] ?? [],
    sampleInput: SAMPLE_INPUTS[name] ?? '',
  };
}
