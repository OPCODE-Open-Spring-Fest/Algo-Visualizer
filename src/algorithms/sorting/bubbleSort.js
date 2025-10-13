// src/algorithms/sorting/bubbleSort.js
export function* bubbleSort(array) {
	const arr = [...array];
	const n = arr.length;

	// Standard bubble sort with generator events
	for (let i = 0; i < n - 1; i++) {
		// After each pass, the largest element of the unsorted portion bubbles to position n-1-i
		for (let j = 0; j < n - 1 - i; j++) {
			// compare pair (j, j+1)
			yield { type: "compare", indices: [j, j + 1] };

			if (arr[j] > arr[j + 1]) {
				[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
				yield { type: "swap", indices: [j, j + 1], array: [...arr] };
			}
		}

		// mark the settled position at the end of this pass
		yield { type: "min", index: n - 1 - i };
	}

	yield { type: "done", array: arr };
}