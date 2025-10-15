// src/algorithms/sorting/quickSort.js
export function* quickSort(array) {
    const arr = [...array];
    
    // Helper generator function for the recursive quicksort
    function* quickSortHelper(low, high) {
        if (low < high) {
            // Partition the array and get the pivot index
            yield* partition(low, high);
            const pivotIndex = arr.lastPivotIndex;
            
            // Recursively sort left subarray
            yield* quickSortHelper(low, pivotIndex - 1);
            
            // Recursively sort right subarray
            yield* quickSortHelper(pivotIndex + 1, high);
        } else if (low === high) {
            // Single element is already sorted
            yield { type: "sorted", index: low };
        }
    }
    
    // Partition function using Lomuto partition scheme
    function* partition(low, high) {
        // Choose the last element as pivot
        const pivot = arr[high];
        yield { type: "pivot", index: high };
        
        let i = low - 1; // Index of smaller element
        
        for (let j = low; j < high; j++) {
            // Highlight current partition range
            yield { type: "partition", indices: [low, high] };
            
            // Compare current element with pivot
            yield { type: "compare", indices: [j, high] };
            
            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    // Swap elements
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    yield { type: "swap", indices: [i, j], array: [...arr] };
                }
            }
        }
        
        // Place pivot in its correct position
        if (i + 1 !== high) {
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            yield { type: "swap", indices: [i + 1, high], array: [...arr] };
        }
        
        // Mark pivot as sorted in its final position
        yield { type: "sorted", index: i + 1 };
        
        // Store pivot index for recursive calls
        arr.lastPivotIndex = i + 1;
    }
    
    // Start the quicksort process
    yield* quickSortHelper(0, arr.length - 1);
    
    // Mark all elements as sorted
    yield { type: "done", array: arr };
}