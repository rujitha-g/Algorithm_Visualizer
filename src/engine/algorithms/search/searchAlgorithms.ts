import type { ArrayFrame, ArrayElement } from '../../types';

function el(value: number, index: number, state: ArrayElement['state']): ArrayElement {
  return { value, index, state };
}

export function generateBinarySearchFrames(
  input: number[] = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  target: number = 7
): ArrayFrame[] {
  const arr = [...input].sort((a, b) => a - b);
  const frames: ArrayFrame[] = [];
  let low = 0, high = arr.length - 1;

  frames.push({
    type: 'array',
    elements: arr.map((v, i) => el(v, i, 'default')),
    description: `Binary Search for target=${target} in sorted array.`,
    variables: { target, low, high, mid: null },
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    frames.push({
      type: 'array',
      elements: arr.map((v, i) => el(v, i,
        i < low || i > high ? 'excluded'
          : i === mid ? 'searching'
            : 'default'
      )),
      description: `mid=${mid}, arr[mid]=${arr[mid]}. Checking against target=${target}.`,
      variables: { low, high, mid, 'arr[mid]': arr[mid], target },
    });

    if (arr[mid] === target) {
      frames.push({
        type: 'array',
        elements: arr.map((v, i) => el(v, i, i === mid ? 'found' : 'excluded')),
        description: `✅ Found target=${target} at index ${mid}!`,
        variables: { foundAt: mid, target },
      });
      return frames;
    } else if (arr[mid] < target) {
      frames.push({
        type: 'array',
        elements: arr.map((v, i) => el(v, i, i <= mid ? 'excluded' : i >= low && i <= high ? 'default' : 'excluded')),
        description: `arr[mid]=${arr[mid]} < target=${target}. Search right half.`,
        variables: { low: mid + 1, high },
      });
      low = mid + 1;
    } else {
      frames.push({
        type: 'array',
        elements: arr.map((v, i) => el(v, i, i >= mid ? 'excluded' : i >= low && i <= high ? 'default' : 'excluded')),
        description: `arr[mid]=${arr[mid]} > target=${target}. Search left half.`,
        variables: { low, high: mid - 1 },
      });
      high = mid - 1;
    }
  }

  frames.push({
    type: 'array',
    elements: arr.map((v, i) => el(v, i, 'excluded')),
    description: `❌ Target=${target} not found in the array.`,
    variables: { target, result: -1 },
  });

  return frames;
}

export function generateLinearSearchFrames(
  input: number[] = [4, 2, 7, 1, 9, 3, 6],
  target: number = 9
): ArrayFrame[] {
  const arr = [...input];
  const frames: ArrayFrame[] = [];

  frames.push({
    type: 'array',
    elements: arr.map((v, i) => el(v, i, 'default')),
    description: `Linear Search for target=${target}.`,
    variables: { target, i: null },
  });

  for (let i = 0; i < arr.length; i++) {
    frames.push({
      type: 'array',
      elements: arr.map((v, idx) => el(v, idx, idx < i ? 'excluded' : idx === i ? 'searching' : 'default')),
      description: `Checking arr[${i}]=${arr[i]} against target=${target}.`,
      variables: { i, 'arr[i]': arr[i], target },
    });

    if (arr[i] === target) {
      frames.push({
        type: 'array',
        elements: arr.map((v, idx) => el(v, idx, idx === i ? 'found' : 'excluded')),
        description: `✅ Found target=${target} at index ${i}!`,
        variables: { foundAt: i },
      });
      return frames;
    }
  }

  frames.push({
    type: 'array',
    elements: arr.map((v, i) => el(v, i, 'excluded')),
    description: `❌ Target=${target} not found after scanning all elements.`,
    variables: { result: -1 },
  });

  return frames;
}
