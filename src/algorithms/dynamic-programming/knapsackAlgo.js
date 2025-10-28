// src/algorithms/dynamic-programming/knapsackAlgo.js

// Implements 0/1 Knapsack (top-down with memo and bottom-up DP)
// Both functions return an object { steps, result } where
// - steps is an array of visual step objects shaped similarly to fibonacciAlgo.js
// - result is the maximum value achievable

function clone2D(arr) {
    return arr.map(row => Array.isArray(row) ? [...row] : row);
}

export function knapsackTopDown(weights, values, W) {
    const n = weights.length;
    // memo dimensions: n x (W+1), initialize null
    const memo = Array.from({ length: n }, () => new Array(W + 1).fill(null));
    const steps = [];

    function solve(i, cap) {
        steps.push({
            type: "call",
            index: { i, cap },
            memo: clone2D(memo),
            message: `Calling solve(i=${i}, cap=${cap}).`
        });

        if (i < 0 || cap <= 0) {
            steps.push({
                type: "base_case",
                index: { i, cap },
                value: 0,
                memo: clone2D(memo),
                message: `Base case: i=${i} or cap=${cap} -> 0.`
            });
            return 0;
        }

        if (memo[i][cap] !== null) {
            steps.push({
                type: "memo_hit",
                index: { i, cap },
                value: memo[i][cap],
                memo: clone2D(memo),
                message: `Memoization hit: memo[${i}][${cap}] = ${memo[i][cap]}.`
            });
            return memo[i][cap];
        }

        // Option 1: skip current item
        const without = solve(i - 1, cap);

        // Option 2: take current item (if it fits)
        let withItem = -Infinity;
        if (weights[i] <= cap) {
            withItem = values[i] + solve(i - 1, cap - weights[i]);
        }

        const res = Math.max(without, withItem);
        memo[i][cap] = res;

        steps.push({
            type: "store",
            index: { i, cap },
            value: res,
            memo: clone2D(memo),
            message: `Computed memo[${i}][${cap}] = max(${without}, ${withItem === -Infinity ? "-inf" : withItem}) = ${res}.`
        });

        return res;
    }

    const result = solve(n - 1, W);

    // Map steps to visualSteps (use memo as the array shown)
    const visualSteps = steps.map(step => ({
        array: step.memo,
        currentIndex: step.index,
        message: step.message,
        value: step.value
    }));

    return { steps: visualSteps, result };
}

export function knapsackBottomUp(weights, values, W) {
    const n = weights.length;
    // dp dimensions: (n+1) x (W+1)
    const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
    const steps = [];

    // Optionally push initial state
    steps.push({
        type: "init",
        index: { i: 0, w: 0 },
        dp: clone2D(dp),
        message: `Initializing dp table with zeros.`
    });

    // Build DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
            if (weights[i - 1] <= w) {
                const take = values[i - 1] + dp[i - 1][w - weights[i - 1]];
                const skip = dp[i - 1][w];
                dp[i][w] = Math.max(skip, take);
                steps.push({
                    type: "compute",
                    index: { i, w },
                    value: dp[i][w],
                    dp: clone2D(dp),
                    message: `dp[${i}][${w}] = max(dp[${i - 1}][${w}] = ${skip}, dp[${i - 1}][${w - weights[i - 1]}] + ${values[i - 1]} = ${take}) = ${dp[i][w]}.`
                });
            } else {
                dp[i][w] = dp[i - 1][w];
                steps.push({
                    type: "compute",
                    index: { i, w },
                    value: dp[i][w],
                    dp: clone2D(dp),
                    message: `dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]} (item ${i - 1} doesn't fit).`
                });
            }
        }
    }

    const visualSteps = steps.map(step => ({
        array: step.dp || step.memo,
        currentIndex: step.index,
        message: step.message,
        value: step.value
    }));

    return { steps: visualSteps, result: dp[n][W] };
}

// Default export is optional — keep named exports to match other algorithm files
