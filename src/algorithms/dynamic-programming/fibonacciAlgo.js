// src/algorithms/dynamic-programming/fibonacciAlgo.js

export function fibonacciTopDown(n) {
    const memo = new Array(n + 1).fill(null);
    const steps = [];

    function solve(k) {
        steps.push({
            type: "call",
            index: k,
            memo: [...memo], // Clone memo to capture current state
            message: `Calling fib(${k}).`
        });

        if (k <= 1) {
            steps.push({
                type: "base_case",
                index: k,
                value: k,
                memo: [...memo],
                message: `Base case: fib(${k}) = ${k}.`
            });
            memo[k] = k;
            return k;
        }

        if (memo[k] !== null) {
            steps.push({
                type: "memo_hit",
                index: k,
                value: memo[k],
                memo: [...memo],
                message: `Memoization hit: fib(${k}) is already computed as ${memo[k]}.`
            });
            return memo[k];
        }

        const res = solve(k - 1) + solve(k - 2);
        memo[k] = res;

        steps.push({
            type: "store",
            index: k,
            value: res,
            memo: [...memo],
            message: `Computed fib(${k}) = fib(${k - 1}) + fib(${k - 2}) = ${res}. Storing in memo.`
        });
        return res;
    }

    const result = solve(n);

    // After the initial run, clean up steps that are too verbose for final display
    // For Top-Down, the array shown will be the 'memo'
    const visualSteps = steps.map(step => ({
        array: step.memo,
        currentIndex: step.index,
        message: step.message,
        value: step.value // Value computed/retrieved at this step
    }));

    return { steps: visualSteps, result };
}


export function fibonacciBottomUp(n) {
    const dp = new Array(n + 1).fill(null);
    const steps = [];

    // Base cases
    if (n >= 0) {
        dp[0] = 0;
        steps.push({
            type: "base_case",
            index: 0,
            value: 0,
            dp: [...dp],
            message: `Initializing dp[0] = 0.`
        });
    }
    if (n >= 1) {
        dp[1] = 1;
        steps.push({
            type: "base_case",
            index: 1,
            value: 1,
            dp: [...dp],
            message: `Initializing dp[1] = 1.`
        });
    }

    // Iterate and fill DP table
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        steps.push({
            type: "compute",
            index: i,
            value: dp[i],
            dp: [...dp],
            message: `Computing dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}.`
        });
    }

    // After the initial run, clean up steps that are too verbose for final display
    // For Bottom-Up, the array shown will be the 'dp' table
    const visualSteps = steps.map(step => ({
        array: step.dp, // Use 'dp' as the array for bottom-up
        currentIndex: step.index,
        message: step.message,
        value: step.value
    }));

    return { steps: visualSteps, result: dp[n] };
}