export function* maxSumSubarray(array, k) {
    if (array.length === 0) {
        yield {
            type: "error",
            message: "Array cannot be empty",
            windowStart: -1, windowEnd: -1, currentSum: 0, maxSum: 0
        };
        return;
    }
    if (k > array.length) {
        yield {
            type: "error",
            message: `Window size ${k} cannot be greater than array length ${array.length}`,
            windowStart: -1, windowEnd: -1, currentSum: 0, maxSum: 0
        };
        return;
    }
    if (k <= 0) {
        yield {
            type: "error",
            message: "Window size must be greater than 0",
 windowStart: -1, windowEnd: -1, currentSum: 0, maxSum: 0
        };
        return;
    }
    let windowStart = 0;
    let windowEnd = 0;
    let currentSum = 0;
    let maxSum = Number.NEGATIVE_INFINITY;
    yield {
        type: "initialize",
        message: `Initializing: Calculating sum of first window [0, ${k - 1}]`,
        windowStart: 0,windowEnd: k - 1,currentSum: 0,maxSum: 0
    };
    for (let i = 0; i < k; i++) {
        currentSum += array[i];
        yield {
            type: "expand",
            message: `Adding element at index ${i}: ${array[i]}. Current sum: ${currentSum}`,
            windowStart: 0,windowEnd: i,currentSum: currentSum,maxSum: maxSum
        };
    }
    maxSum = currentSum;
    windowEnd = k - 1;

    yield {
        type: "window_ready",
        message: `First window sum: ${currentSum}. This is our initial maximum.`,
        windowStart: 0, windowEnd: k - 1, currentSum: currentSum, maxSum: maxSum
    };
    for (let i = k; i < array.length; i++) {
        const removedElement = array[i - k];
        const addedElement = array[i];
        yield {
            type: "slide_start",
            message: `Sliding window: Removing element at index ${i - k} (${removedElement}), adding element at index ${i} (${addedElement})`,
            windowStart: i - k, windowEnd: i - 1, currentSum: currentSum, maxSum: maxSum, removedIndex: i - k, addedIndex: i
        };
        currentSum = currentSum - removedElement + addedElement;
        windowStart = i - k + 1;
        windowEnd = i;
        yield {
            type: "slide_update",
            message: `Window moved: New sum = ${currentSum} (previous: ${currentSum + removedElement - addedElement}, removed: ${removedElement}, added: ${addedElement})`,
            windowStart: windowStart, windowEnd: windowEnd, currentSum: currentSum, maxSum: maxSum, removedIndex: i - k, addedIndex: i
        };
        if (currentSum > maxSum) {
            maxSum = currentSum;
            yield {
                type: "new_max",
                message: `New maximum found! Sum: ${maxSum} at window [${windowStart}, ${windowEnd}]`,
                windowStart: windowStart,  windowEnd: windowEnd,  currentSum: currentSum,  maxSum: maxSum
            };
        } else {
            yield {
                type: "window_ready",
                message: `Current sum: ${currentSum} (not greater than max: ${maxSum})`,
                windowStart: windowStart,  windowEnd: windowEnd,  currentSum: currentSum,  maxSum: maxSum
            };
        }
    }
    yield {
        type: "done",
        message: `Algorithm completed! Maximum sum of subarray of size ${k} is ${maxSum}`,
        windowStart: windowStart, windowEnd: windowEnd, currentSum: currentSum, maxSum: maxSum
    };
}

