// src/algorithms/dynamic-programming/pascalTriangleAlgo.js

// Top-Down (Recursive with Memoization)
export function pascalTriangleTopDown(n) {
    const memo = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(null));
    const steps = [];

    function solve(row, col) {
        steps.push({
            type: "call",
            row,
            col,
            memo: memo.map(r => [...r]),
            message: `Calling pascal(${row}, ${col}).`
        });

        // Base case: edges of the triangle are always 1
        if (col === 0 || col === row) {
            memo[row][col] = 1;
            steps.push({
                type: "base_case",
                row,
                col,
                value: 1,
                memo: memo.map(r => [...r]),
                message: `Base case: pascal(${row}, ${col}) = 1.`
            });
            return 1;
        }

        // Memoization hit
        if (memo[row][col] !== null) {
            steps.push({
                type: "memo_hit",
                row,
                col,
                value: memo[row][col],
                memo: memo.map(r => [...r]),
                message: `Memoization hit: pascal(${row}, ${col}) = ${memo[row][col]}.`
            });
            return memo[row][col];
        }

        // Recursive relation: pascal(r, c) = pascal(r-1, c-1) + pascal(r-1, c)
        const val = solve(row - 1, col - 1) + solve(row - 1, col);
        memo[row][col] = val;

        steps.push({
            type: "store",
            row,
            col,
            value: val,
            memo: memo.map(r => [...r]),
            message: `Computed pascal(${row}, ${col}) = pascal(${row - 1}, ${col - 1}) + pascal(${row - 1}, ${col}) = ${val}. Stored in memo.`
        });

        return val;
    }

    // Build the entire triangle
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            solve(i, j);
        }
    }

    const triangle = memo.map(row => row.filter(x => x !== null));

    const visualSteps = steps.map(step => ({
        array: step.memo,
        currentPosition: { row: step.row, col: step.col },
        message: step.message,
        value: step.value
    }));

    return { steps: visualSteps, result: triangle };
}


// Bottom-Up (Iterative DP)
export function pascalTriangleBottomUp(n) {
    const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
    const steps = [];

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            if (j === 0 || j === i) {
                dp[i][j] = 1;
                steps.push({
                    type: "base_case",
                    row: i,
                    col: j,
                    value: 1,
                    dp: dp.map(r => [...r]),
                    message: `Base case: dp[${i}][${j}] = 1 (edges of triangle).`
                });
            } else {
                dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
                steps.push({
                    type: "compute",
                    row: i,
                    col: j,
                    value: dp[i][j],
                    dp: dp.map(r => [...r]),
                    message: `Computing dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + dp[${i - 1}][${j}] = ${dp[i - 1][j - 1]} + ${dp[i - 1][j]} = ${dp[i][j]}.`
                });
            }
        }
    }

    const triangle = dp.map(row => row.filter(x => x !== 0));

    const visualSteps = steps.map(step => ({
        array: step.dp,
        currentPosition: { row: step.row, col: step.col },
        message: step.message,
        value: step.value
    }));

    return { steps: visualSteps, result: triangle };
}
