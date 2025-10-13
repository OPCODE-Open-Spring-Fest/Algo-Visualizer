// src/algorithms/sorting/selectionSort.js
export function* selectionSort(array) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    yield { type: "compare", indices: [i] };

    for (let j = i + 1; j < n; j++) {
      yield { type: "compare", indices: [minIndex, j] };

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        yield { type: "min", index: minIndex };
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      yield { type: "swap", indices: [i, minIndex], array: [...arr] };
    }
  }

  yield { type: "done", array: arr };
}
