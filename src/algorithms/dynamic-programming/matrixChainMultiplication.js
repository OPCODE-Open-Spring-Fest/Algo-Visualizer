// DP tabulation for Matrix Chain Multiplication with visualization steps.
// p is the dimension array of length n+1 (for n matrices A1..An), where Ai is p[i-1] x p[i].
export function matrixChainMultiplicationSteps(p) {
  const n = p.length - 1;
  if (n <= 0) {
    return { steps: [], n: 0 };
  }

  // 1-indexed tables for convenience
  const m = Array.from({ length: n + 1 }, () => Array(n + 1).fill(Infinity));
  const s = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));

  const steps = [];

  // Base cases m[i][i] = 0
  for (let i = 1; i <= n; i++) {
    m[i][i] = 0;
    steps.push({
      type: "base",
      i,
      j: i,
      value: 0,
      explain: `Base case: cost of single matrix A${i} is 0.`,
    });
  }

  // chainLen = length of the chain
  for (let chainLen = 2; chainLen <= n; chainLen++) {
    steps.push({
      type: "chain-start",
      chainLen,
      explain: `Considering chain length L = ${chainLen}.`,
    });

    for (let i = 1; i <= n - chainLen + 1; i++) {
      const j = i + chainLen - 1;

      steps.push({
        type: "select-cell",
        i,
        j,
        explain: `Computing m[${i}][${j}] for chain A${i}..A${j}.`,
      });

      let best = Infinity;
      let bestK = -1;

      for (let k = i; k <= j - 1; k++) {
        const left = m[i][k];
        const right = m[k + 1][j];
        const multCost = p[i - 1] * p[k] * p[j];
        const cost = left + right + multCost;

        steps.push({
          type: "try-k",
          i,
          j,
          k,
          left,
          right,
          multCost,
          cost,
          explain: `Try k=${k}: m[${i}][${k}] (${left}) + m[${k + 1}][${j}] (${right}) + p[${i - 1}]*p[${k}]*p[${j}] (${p[i - 1]}*${p[k]}*${p[j]}=${multCost}) = ${cost}.`,
        });

        if (cost < best) {
          best = cost;
          bestK = k;
          steps.push({
            type: "update-best",
            i,
            j,
            k,
            best,
            explain: `New best for m[${i}][${j}] with k=${k}: cost=${best}.`,
          });
        }
      }

      m[i][j] = best;
      s[i][j] = bestK;

      steps.push({
        type: "commit-cell",
        i,
        j,
        best,
        bestK,
        explain: `Finalize m[${i}][${j}] = ${best} with split k=${bestK}.`,
      });
    }
  }

  if (n >= 1) {
    steps.push({
      type: "done",
      minCost: m[1][n],
      explain: `Done. Minimum multiplications = ${m[1][n]}.`,
    });
  }

  return { steps, n };
}

// Build optimal parenthesization using split table s (1-indexed).
export function buildParenthesization(s, i, j) {
  if (i === j) return `A${i}`;
  const k = s[i][j];
  return `(${buildParenthesization(s, i, k)} × ${buildParenthesization(s, k + 1, j)})`;
}
