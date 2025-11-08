export function rodCuttingTopDown(prices) {
    const n = prices.length;
    const memo = new Array(n + 1).fill(null); 
    const steps = []; 

    function solve(k) {
        steps.push({
            array: [...memo],
            currentIndex: k, 
            readingIndices: [],
            priceIndex: null,
            message: `Calling solve(k = ${k}).`
        });

        if (k === 0) {
            steps.push({
                array: [...memo],
                currentIndex: k,
                readingIndices: [],
                priceIndex: null,
                message: `Base case: solve(0) = 0.`
            });
            return 0;
        }

        if (memo[k] !== null) {
            steps.push({
                array: [...memo],
                currentIndex: k,
                readingIndices: [],
                priceIndex: null,
                message: `Memo hit: solve(${k}) is already computed as ${memo[k]}.`
            });
            return memo[k];
        }

        let currentMaxProfit = -1;

        for (let j = 1; j <= k; j++) {
            steps.push({
                array: [...memo],
                currentIndex: k,
                readingIndices: [],
                priceIndex: j - 1, 
                message: `... for k = ${k}, trying cut j = ${j}. Need to find solve(${k - j}).`
            });

            const remainingProfit = solve(k - j);
            let profit = prices[j - 1] + remainingProfit;

            steps.push({
                array: [...memo],
                currentIndex: k,
                readingIndices: [k - j], 
                priceIndex: j - 1, 
                message: `... cut j = ${j} gives profit = prices[${j - 1}] (${prices[j-1]}) + solve(${k - j}) (${remainingProfit}) = ${profit}.`
            });

            if (profit > currentMaxProfit) {
                currentMaxProfit = profit;
            }
        }

        memo[k] = currentMaxProfit;

        steps.push({
            array: [...memo], 
            currentIndex: k,
            readingIndices: [],
            priceIndex: null,
            message: `Computed solve(${k}) = ${currentMaxProfit}. Storing in memo[${k}].`
        });

        return currentMaxProfit;
    }

    const result = solve(n);

    steps.push({
        array: [...memo],
        currentIndex: n,
        readingIndices: [],
        priceIndex: null,
        message: `Computation complete. Max profit for a rod of length ${n} is ${result}.`
    });

    return { steps, result };
}


export function rodCuttingBottomUp(prices) {
    const n = prices.length;
    const dp = new Array(n + 1).fill(0); 
    const steps = []; 

    steps.push({
        array: [...dp],
        currentIndex: 0,
        readingIndices: [],
        priceIndex: null,
        message: `Base case: Max profit for length 0 is 0. dp[0] = 0.`
    });

    for (let i = 1; i <= n; i++) {
        let currentMaxProfit = -1;

        steps.push({
            array: [...dp],
            currentIndex: i, 
            readingIndices: [],
            priceIndex: null,
            message: `Calculating max profit for length i = ${i}.`
        });

        for (let j = 1; j <= i; j++) {
            let profit = prices[j - 1] + dp[i - j];

            steps.push({
                array: [...dp],
                currentIndex: i, 
                readingIndices: [i - j], 
                priceIndex: j - 1, 
                message: `... trying cut j = ${j}. Profit = prices[${j - 1}] (${prices[j-1]}) + dp[${i - j}] (${dp[i-j]}) = ${profit}.`
            });

            if (profit > currentMaxProfit) {
                currentMaxProfit = profit;
            }
        }

        dp[i] = currentMaxProfit;

        steps.push({
            array: [...dp], 
            currentIndex: i,
            readingIndices: [],
            priceIndex: null,
            message: `Max profit for length ${i} is ${currentMaxProfit}. Storing in dp[${i}].`
        });
    }

    steps.push({
        array: [...dp],
        currentIndex: n,
        readingIndices: [],
        priceIndex: null,
        message: `Computation complete. Max profit for a rod of length ${n} is ${dp[n]}.`
    });

    return { steps, result: dp[n] };
}