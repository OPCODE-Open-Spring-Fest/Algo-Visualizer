export function longestCommonSubsequenceSteps(a = "", b = "") {
  const m = a.length;
  const n = b.length;

  // ✅ initialize DP table
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const steps = [];

  const snapshot = () => dp.map(row => [...row]);

  // ✅ filling dp table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          dp: snapshot(),
          active: { i, j },
          match: { i, j },
          message: `Characters match '${a[i - 1]}' at A[${i - 1}] & B[${j - 1}] → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          dp: snapshot(),
          active: { i, j },
          message: `No match. dp[${i}][${j}] = max(dp[${i - 1}][${j}] = ${dp[i - 1][j]}, dp[${i}][${j - 1}] = ${dp[i][j - 1]}) = ${dp[i][j]}`
        });
      }
    }
  }

  // ✅ traceback to get sequence
  let i = m, j = n;
  let lcsChars = [];
  const path = [];

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      lcsChars.push(a[i - 1]);
      path.push({ i, j });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }

  const finalPath = path.reverse();
  steps.push({
    dp: snapshot(),
    finalPath,
    message: `Final LCS sequence = '${lcsChars.reverse().join('')}'`,
    sequence: lcsChars.join('')
  });

  return steps;
}
