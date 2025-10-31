export function createHeap(type = "max") {
  let heap = [];
  const compare = (a, b) => (type === "max" ? a > b : a < b);

  const swap = (i, j) => {
    [heap[i], heap[j]] = [heap[j], heap[i]];
  };

  const heapifyUp = () => {
    let i = heap.length - 1;
    while (i > 0) {
      let p = Math.floor((i - 1) / 2);
      if (compare(heap[i], heap[p])) {
        swap(i, p);
        i = p;
      } else break;
    }
  };

  const heapifyDown = () => {
    let i = 0;
    const n = heap.length;
    while (true) {
      let l = 2 * i + 1,
        r = 2 * i + 2,
        target = i; // ✅ changed from 'largest' → 'target' for clarity
      if (l < n && compare(heap[l], heap[target])) target = l;
      if (r < n && compare(heap[r], heap[target])) target = r;
      if (target === i) break;
      swap(i, target);
      i = target;
    }
  };

  return {
    getHeap: () => [...heap],

    insert: (val) => {
      heap.push(val);
      heapifyUp();
      return [...heap];
    },

    deleteRoot: () => {
      if (heap.length === 0) return [];
      if (heap.length === 1) {
        heap.pop();
        return [];
      }

      // ✅ fixed: replace root with last, pop last, then heapify
      heap[0] = heap[heap.length - 1];
      heap.pop();
      heapifyDown();
      return [...heap];
    },

    reset: () => {
      heap = [];
      return [];
    },
  };
}
