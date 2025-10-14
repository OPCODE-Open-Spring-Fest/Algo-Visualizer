// src/algorithms/sorting/InsertionSort.js
export function* insertionSort(array) {
	const arr = [...array];
	const n = arr.length;

	for (let i = 1; i < n; i++) {
		// mark the current index being considered (matches selectionSort behavior)
		yield { type: "compare", indices: [i] };

		// perform insertion by swapping adjacent elements until correct position
		let j = i;
		while (j > 0) {
			// compare the pair we're about to potentially swap
			yield { type: "compare", indices: [j - 1, j] };

			if (arr[j - 1] > arr[j]) {
				// swap adjacent
				[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
				yield { type: "swap", indices: [j - 1, j], array: [...arr] };
				j--;
			} else {
				break;
			}
		}

		// if element moved, indicate insertion position (use "min" to match visual cue)
		if (j !== i) {
			yield { type: "min", index: j };
		}
	}

	yield { type: "done", array: arr };
}

