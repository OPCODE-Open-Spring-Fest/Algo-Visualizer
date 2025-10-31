// src/algorithms/sorting/radixSort.js
export function* radixSort(array) {
    const arr = [...array];

    // Get the maximum number to determine number of digits
    const maxNum = Math.max(...arr);
    const maxDigits = Math.floor(Math.log10(maxNum)) + 1;

    // Helper function to get digit at a specific place
    const getDigit = (num, place) => Math.floor(num / Math.pow(10, place)) % 10;

    // Counting sort for each digit position
    for (let place = 0; place < maxDigits; place++) {
        const buckets = Array.from({ length: 10 }, () => []);

        // Yield to show current digit pass
        yield { type: "digitPassStart", place };

        // Place each number in corresponding bucket
        for (let i = 0; i < arr.length; i++) {
            const digit = getDigit(arr[i], place);
            buckets[digit].push(arr[i]);

            yield { type: "bucket", digit, value: arr[i], array: [...arr] };
        }

        // Combine buckets back into array
        let index = 0;
        for (let b = 0; b < 10; b++) {
            for (let value of buckets[b]) {
                arr[index++] = value;
                yield { type: "rebuild", array: [...arr], bucket: b, value };
            }
        }

        // Yield after completing sorting by current digit
        yield { type: "digitPassEnd", place, array: [...arr] };
    }

    // Mark all elements as sorted
    for (let i = 0; i < arr.length; i++) {
        yield { type: "sorted", index: i };
    }

    // Final done state
    yield { type: "done", array: arr };
}
