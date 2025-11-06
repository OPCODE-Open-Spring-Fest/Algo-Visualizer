export function getSubsetSumSteps(arr = [], target = 0) {
  const n = arr.length;
  const steps = [];

  const dp = Array.from({ length: n + 1 }, () =>
    Array(target + 1).fill(false)
  );

  dp[0][0] = true;

  steps.push({
    type: "init",
    message: "Initialize DP table: dp[0][0] = true (empty subset → sum 0)",
    dp: structuredClone(dp),
  });

  for (let i = 1; i <= n; i++) {
    const val = arr[i - 1];

    steps.push({
      type: "init_row",
      row: i,
      value: val,
      message: `Processing element arr[${i - 1}] = ${val}`,
      dp: structuredClone(dp),
    });

    for (let sum = 0; sum <= target; sum++) {
      steps.push({
        type: "process_cell",
        i,
        sum,
        value: val,
        message: `Checking if we can form sum ${sum} using first ${i} elements`,
        dp: structuredClone(dp),
      });

      if (dp[i - 1][sum]) {
        dp[i][sum] = true;
        steps.push({
          type: "true_set",
          i,
          sum,
          by: "exclude",
          message: `dp[${i}][${sum}] = true (exclude ${val})`,
          dp: structuredClone(dp),
        });
      }

      if (sum >= val && dp[i - 1][sum - val]) {
        dp[i][sum] = true;
        steps.push({
          type: "true_set",
          i,
          sum,
          by: "include",
          message: `dp[${i}][${sum}] = true (include ${val})`,
          dp: structuredClone(dp),
        });
      }
    }

    steps.push({
      type: "complete_row",
      row: i,
      message: `Completed row ${i} (processed arr[${i - 1}] = ${val})`,
      dp: structuredClone(dp),
    });
  }

  const isPossible = dp[n][target];

  if (!isPossible) {
    steps.push({
      type: "no_solution",
      message: `No subset found that adds up to target ${target}.`,
      dp: structuredClone(dp),
    });
    return { steps, solutions: [], solutionCount: 0 };
  }

  const solution = [];
  let i = n, sum = target;

  while (i > 0 && sum >= 0) {
    if (dp[i - 1][sum]) {
      steps.push({
        type: "decision",
        message: `arr[${i - 1}] = ${arr[i - 1]} was EXCLUDED`,
        dp: structuredClone(dp),
      });
      i--;
    } else {
      const val = arr[i - 1];
      solution.push(val);
      steps.push({
        type: "decision",
        message: `arr[${i - 1}] = ${val} was INCLUDED`,
        dp: structuredClone(dp),
      });
      sum -= val;
      i--;
    }
  }

  steps.push({
    type: "solution",
    solution: solution.reverse(),
    message: `✅ Found solution subset: [${solution.join(", ")}]`,
    dp: structuredClone(dp),
  });

  return {
    steps,
    solutions: [solution],
    solutionCount: 1,
  };
}
