import type { DPFrame, DPCell } from '../../types';

function makeTable(rows: number, cols: number): DPCell[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r, col: c, value: 0, state: 'default' as DPCell['state'],
    }))
  );
}

function cloneTable(t: DPCell[][]): DPCell[][] {
  return t.map(row => row.map(cell => ({ ...cell })));
}

export function generateLCSFrames(
  s1: string = 'ABCBDAB',
  s2: string = 'BDCAB'
): DPFrame[] {
  const frames: DPFrame[] = [];
  const m = s1.length, n = s2.length;
  const table = makeTable(m + 1, n + 1);

  const rowLabels = ['', ...s1.split('')];
  const colLabels = ['', ...s2.split('')];

  frames.push({
    type: 'dp',
    table: cloneTable(table),
    rowLabels,
    colLabels,
    description: `LCS of "${s1}" and "${s2}". Initialize ${m+1}×${n+1} DP table with zeros.`,
    variables: { s1, s2, m, n },
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      table[i][j].state = 'active';

      frames.push({
        type: 'dp',
        table: cloneTable(table),
        rowLabels,
        colLabels,
        description: `Comparing s1[${i-1}]='${s1[i-1]}' with s2[${j-1}]='${s2[j-1]}'.`,
        variables: { i, j, 's1[i-1]': s1[i-1], 's2[j-1]': s2[j-1] },
        highlightCell: { row: i, col: j },
      });

      if (s1[i - 1] === s2[j - 1]) {
        table[i][j].value = (table[i-1][j-1].value as number) + 1;
        table[i][j].state = 'optimal';
        frames.push({
          type: 'dp',
          table: cloneTable(table),
          rowLabels,
          colLabels,
          description: `Match! dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${table[i][j].value}.`,
          variables: { match: `${s1[i-1]}`, 'dp[i][j]': table[i][j].value },
          highlightCell: { row: i, col: j },
        });
      } else {
        table[i][j].value = Math.max(
          table[i-1][j].value as number,
          table[i][j-1].value as number
        );
        table[i][j].state = 'filled';
        frames.push({
          type: 'dp',
          table: cloneTable(table),
          rowLabels,
          colLabels,
          description: `No match. dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${table[i][j].value}.`,
          variables: { 'dp[i-1][j]': table[i-1][j].value, 'dp[i][j-1]': table[i][j-1].value, result: table[i][j].value },
          highlightCell: { row: i, col: j },
        });
      }
    }
  }

  frames.push({
    type: 'dp',
    table: cloneTable(table),
    rowLabels,
    colLabels,
    description: `✅ LCS length = ${table[m][n].value}. Trace back for the actual subsequence.`,
    variables: { lcsLength: table[m][n].value },
    highlightCell: { row: m, col: n },
  });

  return frames;
}

export function generateKnapsackFrames(
  weights: number[] = [1, 3, 4, 5],
  values: number[] = [1, 4, 5, 7],
  capacity: number = 7
): DPFrame[] {
  const frames: DPFrame[] = [];
  const n = weights.length;
  const table = makeTable(n + 1, capacity + 1);

  const rowLabels = ['0', ...weights.map((w, i) => `Item ${i+1}(w=${w},v=${values[i]})`)];
  const colLabels = Array.from({ length: capacity + 1 }, (_, i) => String(i));

  frames.push({
    type: 'dp',
    table: cloneTable(table),
    rowLabels,
    colLabels,
    description: `0/1 Knapsack. ${n} items, capacity=${capacity}. Build DP table.`,
    variables: { n, capacity },
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      table[i][w].state = 'active';
      frames.push({
        type: 'dp',
        table: cloneTable(table),
        rowLabels,
        colLabels,
        description: `Item ${i} (w=${weights[i-1]}, v=${values[i-1]}), capacity=${w}.`,
        variables: { item: i, weight: weights[i-1], value: values[i-1], capacity: w },
        highlightCell: { row: i, col: w },
      });

      if (weights[i - 1] > w) {
        table[i][w].value = table[i-1][w].value;
        table[i][w].state = 'filled';
        frames.push({
          type: 'dp',
          table: cloneTable(table),
          rowLabels,
          colLabels,
          description: `Item weight ${weights[i-1]} > capacity ${w}. Skip item. dp[${i}][${w}]=${table[i][w].value}.`,
          variables: { skip: true, 'dp[i][w]': table[i][w].value },
          highlightCell: { row: i, col: w },
        });
      } else {
        const withItem = (table[i-1][w - weights[i-1]].value as number) + values[i-1];
        const withoutItem = table[i-1][w].value as number;
        table[i][w].value = Math.max(withItem, withoutItem);
        table[i][w].state = withItem >= withoutItem ? 'optimal' : 'filled';
        frames.push({
          type: 'dp',
          table: cloneTable(table),
          rowLabels,
          colLabels,
          description: `Include(${withItem}) vs Skip(${withoutItem}). dp[${i}][${w}]=${table[i][w].value}.`,
          variables: { include: withItem, skip: withoutItem, 'dp[i][w]': table[i][w].value },
          highlightCell: { row: i, col: w },
        });
      }
    }
  }

  frames.push({
    type: 'dp',
    table: cloneTable(table),
    rowLabels,
    colLabels,
    description: `✅ Maximum value = ${table[n][capacity].value}.`,
    variables: { maxValue: table[n][capacity].value },
    highlightCell: { row: n, col: capacity },
  });

  return frames;
}
