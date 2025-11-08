export function longestIncreasingSubsequenceSteps(arr = []) {
    const n = arr.length;
    const dp = Array(n).fill(1);
    const parent = Array(n).fill(-1);
    const steps = [];

    const snapshot = () => [...dp];

    // Fill dp array
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
                parent[i] = j;
                dp[i] = dp[j] + 1;
                steps.push({
                    dp: snapshot(),
                    active: { i, j },
                    match: { i, j },
                    message: `arr[${j}] (${arr[j]}) < arr[${i}] (${arr[i]}) → dp[${i}] = dp[${j}] + 1 = ${dp[i]}`
                });
            } else {
                steps.push({
                    dp: snapshot(),
                    active: { i, j },
                    message: `arr[${j}] (${arr[j]}) >= arr[${i}] (${arr[i]}) → no update, dp[${i}] remains ${dp[i]}`
                });
            }
        }
    }

    // Find LIS length and reconstruct sequence
    let lisLen = 0, lisEnd = 0;
    for (let i = 0; i < n; i++) {
        if (dp[i] > lisLen) {
            lisLen = dp[i];
            lisEnd = i;
        }
    }

    const sequence = [];
    let t = lisEnd;
    while (t !== -1) {
        sequence.push(arr[t]);
        t = parent[t];
    }
    sequence.reverse();

    steps.push({
        dp: snapshot(),
        message: `Final LIS sequence = [${sequence.join(', ')}], length = ${lisLen}`,
        sequence,
    });

    return steps;
}
