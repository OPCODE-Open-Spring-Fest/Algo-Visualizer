export function getCountingSortSteps(array) {
    const steps = [];
    const n = array.length;

    if (n === 0) {
        return { steps };
    }

    const max = Math.max(...array);
    const count = new Array(max + 1).fill(0);
    const output = new Array(n).fill(0);
    const initialInput = [...array];

    const pushStep = (phase, message, highlight = {}) => {
        steps.push({
            phase,
            input: [...initialInput],
            count: [...count],
            output: [...output],
            message,
            highlight
        });
    };

    pushStep(1, "Starting Phase 1: Count Frequencies. Creating 'Count' array of size (max + 1) = " + (max + 1) + ".", {});

    // Phase 1: Count frequencies
    for (let i = 0; i < n; i++) {
        const val = array[i];
        count[val]++;
        pushStep(1, `Read input[${i}] = ${val}. Incrementing count[${val}] to ${count[val]}.`, {
            input: i,
            count: val
        });
    }

    pushStep(2, "Starting Phase 2: Calculate Cumulative Sums.", {});

    for (let i = 1; i <= max; i++) {
        const prevCount = count[i - 1];
        count[i] += prevCount;
        pushStep(2, `Calculating count[${i}] = count[${i}] + count[${i - 1}] = ${count[i] - prevCount} + ${prevCount} = ${count[i]}.`, {
            count: i,
            countRead: i - 1
        });
    }

    pushStep(3, "Starting Phase 3: Build Output Array (Iterating input in reverse).", {});

    for (let i = n - 1; i >= 0; i--) {
        const val = array[i];
        pushStep(3, `Reading input[${i}] = ${val}.`, {
            input: i
        });

        const posIndex = count[val] - 1;
        pushStep(3, `Position for ${val} is count[${val}] - 1 = ${count[val]} - 1 = ${posIndex}.`, {
            input: i,
            countRead: val
        });

        output[posIndex] = val;
        pushStep(3, `Placing ${val} at output[${posIndex}].`, {
            input: i,
            countRead: val,
            output: posIndex
        });

        count[val]--;
        pushStep(3, `Decrementing count[${val}] to ${count[val]}.`, {
            input: i,
            count: val,
            output: posIndex
        });
    }

    pushStep(4, "Algorithm Complete. The 'Output' array is now sorted.", {});
    
    return { steps };
}