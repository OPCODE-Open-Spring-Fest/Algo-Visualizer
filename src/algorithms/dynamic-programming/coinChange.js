export function coinChangeTabulation(coins = [], amount = 0) {
    // dp dimensions: (n + 1) x (amount + 1)
    const n = coins.length;
    const dp = Array.from({ length: n + 1 }, () =>
        new Array(amount + 1).fill(Infinity)
    );

    const steps = [];

    // Base case: dp[i][0] = 0 for all i
    for (let i = 0; i <= n; i++) {
        dp[i][0] = 0;
        steps.push({
            type: "base_case",
            row: i,
            col: 0,
            value: 0,
            dp: dp.map((r) => [...r]),
            message: `Base case: dp[${i}][0] = 0 (0 coins needed to make amount 0).`,
        });
    }

    // Fill table row by row: i = 1..n (using first i coins), j = 1..amount
    for (let i = 1; i <= n; i++) {
        const coin = coins[i - 1];
        for (let j = 1; j <= amount; j++) {
            // Highlight cell selection
            steps.push({
                type: "select_cell",
                row: i,
                col: j,
                coin,
                dp: dp.map((r) => [...r]),
                message: `Computing dp[${i}][${j}] considering coin ${coin}.`,
            });

            // Option 1: don't use current coin => dp[i-1][j]
            const option1 = dp[i - 1][j];
            steps.push({
                type: "option_without",
                row: i,
                col: j,
                coin,
                optionValue: option1,
                dp: dp.map((r) => [...r]),
                message: `Option 1 (without coin ${coin}): dp[${i - 1}][${j}] = ${option1 === Infinity ? "∞" : option1}.`,
            });

            // Option 2: use current coin if j >= coin => dp[i][j-coin] + 1
            let option2 = Infinity;
            if (j - coin >= 0) {
                option2 = dp[i][j - coin] === Infinity ? Infinity : dp[i][j - coin] + 1;
                steps.push({
                    type: "option_with",
                    row: i,
                    col: j,
                    coin,
                    optionValue:
                        option2 === Infinity ? "∞" : option2,
                    dp: dp.map((r) => [...r]),
                    message: `Option 2 (use coin ${coin}): dp[${i}][${j - coin}] ${dp[i][j - coin] === Infinity ? "= ∞" : `= ${dp[i][j - coin]}`
                        } → +1 => ${option2 === Infinity ? "∞" : option2}.`,
                });
            } else {
                steps.push({
                    type: "option_with_unavailable",
                    row: i,
                    col: j,
                    coin,
                    optionValue: "N/A",
                    dp: dp.map((r) => [...r]),
                    message: `Option 2 (use coin ${coin}) not possible since ${coin} > ${j}.`,
                });
            }

            // Take min and store
            const chosen = Math.min(option1, option2);
            dp[i][j] = chosen;

            steps.push({
                type: "take_min",
                row: i,
                col: j,
                coin,
                chosen: chosen === Infinity ? "∞" : chosen,
                option1: option1 === Infinity ? "∞" : option1,
                option2: option2 === Infinity ? "∞" : option2,
                dp: dp.map((r) => [...r]),
                message: `dp[${i}][${j}] = min(${option1 === Infinity ? "∞" : option1}, ${option2 === Infinity ? "∞" : option2}) = ${chosen === Infinity ? "∞" : chosen}.`,
            });
        }
    }

    const result = dp[n][amount] === Infinity ? -1 : dp[n][amount];

    // Prepare visual steps (trim large dp values to Infinity string for clarity)
    const visualSteps = steps.map((step) => ({
        array: step.dp.map((r) => r.map((v) => (v === Infinity ? Infinity : v))),
        currentPosition: { row: step.row, col: step.col },
        coin: step.coin,
        message: step.message,
        type: step.type,
        extra: {
            option1: step.option1,
            option2: step.option2,
            chosen: step.chosen,
            optionValue: step.optionValue,
        },
    }));

    return {
        steps: visualSteps,
        result,
        dpFinal: dp.map((r) => r.map((v) => (v === Infinity ? Infinity : v))),
    };
}
