// src/algorithms/sorting/mergeSort.js
export function* mergeSort(array) {
  const arr = [...array];
  const n = arr.length;

  if (n === 0) {
    yield { type: "done", array: arr };
    return;
  }

  function* merge(l, m, r) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0;
    let j = 0;
    let k = l;

    while (i < left.length && j < right.length) {
      // highlight the two elements being compared (use their original indices)
      yield { type: "compare", indices: [l + i, m + 1 + j] };

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        yield { type: "swap", indices: [k, l + i], array: [...arr] };
        i++;
      } else {
        arr[k] = right[j];
        yield { type: "swap", indices: [k, m + 1 + j], array: [...arr] };
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      yield { type: "swap", indices: [k, l + i], array: [...arr] };
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      yield { type: "swap", indices: [k, m + 1 + j], array: [...arr] };
      j++;
      k++;
    }

    // mark merged positions as "min" to indicate they're in final place for this merge
    for (let idx = l; idx <= r; idx++) {
      yield { type: "min", index: idx };
    }
  }

  function* mergeSortRec(l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    yield* mergeSortRec(l, m);
    yield* mergeSortRec(m + 1, r);
    yield* merge(l, m, r);
  }

  yield* mergeSortRec(0, n - 1);
  yield { type: "done", array: arr };
}