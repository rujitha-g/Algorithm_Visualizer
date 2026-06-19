import type { ArrayFrame, ArrayElement } from '../../types';

function makeElements(arr: number[], states: ('default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'found' | 'searching' | 'excluded')[]): ArrayElement[] {
  return arr.map((value, index) => ({ value, index, state: states[index] ?? 'default' }));
}

export function generateBubbleSortFrames(input: number[] = [64, 34, 25, 12, 22, 11, 90]): ArrayFrame[] {
  const arr = [...input];
  const n = arr.length;
  const frames: ArrayFrame[] = [];
  const sortedIndices = new Set<number>();

  frames.push({
    type: 'array',
    elements: makeElements(arr, arr.map(() => 'default')),
    description: 'Initial array — starting Bubble Sort.',
    variables: { i: 0, j: 0, n },
    pseudocodeLine: 0,
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const states = arr.map((_, idx): ArrayElement['state'] =>
        sortedIndices.has(idx) ? 'sorted' : idx === j || idx === j + 1 ? 'comparing' : 'default'
      );
      frames.push({
        type: 'array',
        elements: makeElements(arr, states),
        description: `Comparing arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}.`,
        variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
        pseudocodeLine: 3,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        const swapStates = arr.map((_, idx): ArrayElement['state'] =>
          sortedIndices.has(idx) ? 'sorted' : idx === j || idx === j + 1 ? 'swapping' : 'default'
        );
        frames.push({
          type: 'array',
          elements: makeElements(arr, swapStates),
          description: `Swapped! Now arr[${j}]=${arr[j]}, arr[${j + 1}]=${arr[j + 1]}.`,
          variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
          pseudocodeLine: 4,
        });
      }
    }
    sortedIndices.add(n - 1 - i);
  }
  sortedIndices.add(0);

  frames.push({
    type: 'array',
    elements: makeElements(arr, arr.map(() => 'sorted')),
    description: '✅ Array fully sorted!',
    variables: { sorted: true },
    pseudocodeLine: 6,
  });

  return frames;
}

export function generateMergeSortFrames(input: number[] = [38, 27, 43, 3, 9, 82, 10]): ArrayFrame[] {
  const arr = [...input];
  const frames: ArrayFrame[] = [];

  frames.push({
    type: 'array',
    elements: makeElements(arr, arr.map(() => 'default')),
    description: 'Initial array — starting Merge Sort.',
    variables: { phase: 'start' },
  });

  function merge(a: number[], left: number, mid: number, right: number) {
    const L = a.slice(left, mid + 1);
    const R = a.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < L.length && j < R.length) {
      const states = a.map((_, idx): ArrayElement['state'] =>
        idx >= left && idx <= right ? 'comparing' : 'default'
      );
      frames.push({
        type: 'array',
        elements: makeElements(a, states),
        description: `Merging: comparing L[${i}]=${L[i]} vs R[${j}]=${R[j]}.`,
        variables: { left, mid, right, 'L[i]': L[i], 'R[j]': R[j] },
      });

      if (L[i] <= R[j]) { a[k++] = L[i++]; } else { a[k++] = R[j++]; }
    }
    while (i < L.length) a[k++] = L[i++];
    while (j < R.length) a[k++] = R[j++];

    const merged = a.map((_, idx): ArrayElement['state'] =>
      idx >= left && idx <= right ? 'sorted' : 'default'
    );
    frames.push({
      type: 'array',
      elements: makeElements(a, merged),
      description: `Merged range [${left}..${right}].`,
      variables: { left, right },
    });
  }

  function mergeSort(a: number[], left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    frames.push({
      type: 'array',
      elements: makeElements(a, a.map((_, idx): ArrayElement['state'] =>
        idx >= left && idx <= right ? 'comparing' : 'excluded'
      )),
      description: `Splitting [${left}..${right}] at mid=${mid}.`,
      variables: { left, mid, right },
    });

    mergeSort(a, left, mid);
    mergeSort(a, mid + 1, right);
    merge(a, left, mid, right);
  }

  mergeSort(arr, 0, arr.length - 1);

  frames.push({
    type: 'array',
    elements: makeElements(arr, arr.map(() => 'sorted')),
    description: '✅ Array fully sorted via Merge Sort!',
    variables: { sorted: true },
  });

  return frames;
}

export function generateQuickSortFrames(input: number[] = [10, 7, 8, 9, 1, 5]): ArrayFrame[] {
  const arr = [...input];
  const frames: ArrayFrame[] = [];
  const sortedIndices = new Set<number>();

  frames.push({
    type: 'array',
    elements: makeElements(arr, arr.map(() => 'default')),
    description: 'Initial array — starting Quick Sort.',
    variables: {},
  });

  function partition(a: number[], low: number, high: number): number {
    const pivot = a[high];
    let i = low - 1;

    frames.push({
      type: 'array',
      elements: makeElements(a, a.map((_, idx): ArrayElement['state'] =>
        idx === high ? 'pivot' : sortedIndices.has(idx) ? 'sorted' : 'default'
      )),
      description: `Pivot selected: ${pivot} at index ${high}.`,
      variables: { pivot, low, high, i },
    });

    for (let j = low; j < high; j++) {
      frames.push({
        type: 'array',
        elements: makeElements(a, a.map((_, idx): ArrayElement['state'] =>
          idx === high ? 'pivot' : idx === j ? 'comparing' : sortedIndices.has(idx) ? 'sorted' : 'default'
        )),
        description: `Comparing a[${j}]=${a[j]} with pivot=${pivot}.`,
        variables: { pivot, i, j, 'a[j]': a[j] },
      });

      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        frames.push({
          type: 'array',
          elements: makeElements(a, a.map((_, idx): ArrayElement['state'] =>
            idx === i || idx === j ? 'swapping' : idx === high ? 'pivot' : sortedIndices.has(idx) ? 'sorted' : 'default'
          )),
          description: `a[${j}] < pivot — swapped a[${i}] and a[${j}].`,
          variables: { pivot, i, j },
        });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    sortedIndices.add(i + 1);
    frames.push({
      type: 'array',
      elements: makeElements(a, a.map((_, idx): ArrayElement['state'] =>
        sortedIndices.has(idx) ? 'sorted' : 'default'
      )),
      description: `Pivot ${pivot} placed at correct position ${i + 1}.`,
      variables: { pivotIndex: i + 1 },
    });
    return i + 1;
  }

  function quickSort(a: number[], low: number, high: number) {
    if (low < high) {
      const pi = partition(a, low, high);
      quickSort(a, low, pi - 1);
      quickSort(a, pi + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
    }
  }

  quickSort(arr, 0, arr.length - 1);

  frames.push({
    type: 'array',
    elements: makeElements(arr, arr.map(() => 'sorted')),
    description: '✅ Array fully sorted via Quick Sort!',
    variables: { sorted: true },
  });

  return frames;
}

export function generateInsertionSortFrames(input: number[] = [12, 11, 13, 5, 6]): ArrayFrame[] {
  const arr = [...input];
  const n = arr.length;
  const frames: ArrayFrame[] = [];

  frames.push({
    type: 'array',
    elements: makeElements(arr, arr.map(() => 'default')),
    description: 'Initial array — starting Insertion Sort.',
    variables: {},
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    frames.push({
      type: 'array',
      elements: makeElements(arr, arr.map((_, idx): ArrayElement['state'] =>
        idx < i ? 'sorted' : idx === i ? 'searching' : 'default'
      )),
      description: `Key = ${key} (index ${i}). Finding insertion position.`,
      variables: { key, i, j },
    });

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      frames.push({
        type: 'array',
        elements: makeElements(arr, arr.map((_, idx): ArrayElement['state'] =>
          idx < i ? 'comparing' : idx === j + 1 ? 'swapping' : 'default'
        )),
        description: `Shifting arr[${j}]=${arr[j + 1]} right to make room.`,
        variables: { key, j, 'arr[j]': arr[j] },
      });
      j--;
    }
    arr[j + 1] = key;

    frames.push({
      type: 'array',
      elements: makeElements(arr, arr.map((_, idx): ArrayElement['state'] =>
        idx <= i ? 'sorted' : 'default'
      )),
      description: `Inserted key=${key} at position ${j + 1}.`,
      variables: { key, insertedAt: j + 1 },
    });
  }

  frames.push({
    type: 'array',
    elements: makeElements(arr, arr.map(() => 'sorted')),
    description: '✅ Array fully sorted via Insertion Sort!',
    variables: { sorted: true },
  });

  return frames;
}
