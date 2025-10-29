/**
 * A generator function that performs Binary Search and yields visualization steps.
 * @param {number[]} array - The array to search through (must be sorted).
 * @param {number} target - The value to find.
 * @yields {{lowIndex: number, highIndex: number, midIndex: number | null, foundIndex: number | null, message?: string}}
 */
export function* binarySearch(array, target) {
    const targetNumber = parseInt(target);
    let low = 0;
    let high = array.length - 1;
    let foundIndex = null;

    // Initial state: show the full search range
    yield { lowIndex: low, highIndex: high, midIndex: null, foundIndex: null };

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        
        // Step 1: Highlight the middle element being compared (yellow)
        yield { 
            lowIndex: low, 
            highIndex: high, 
            midIndex: mid,
            foundIndex: null
        };

        // Step 2: Check for the target
        if (array[mid] === targetNumber) {
            foundIndex = mid;
            // Target found, yield the final state (green) and stop
            yield { 
                lowIndex: low, 
                highIndex: high, 
                midIndex: mid, 
                foundIndex: foundIndex, 
                message: `Success! Found target ${targetNumber} at index ${mid}` 
            };
            return; // Exit the generator
        } else if (array[mid] < targetNumber) {
            // Target is greater, search the right half. Discard the lower half by moving low.
            low = mid + 1;
        } else {
            // Target is smaller, search the left half. Discard the upper half by moving high.
            high = mid - 1;
        }
        
        // Step 3: Yield the updated boundaries for visualization before the next comparison
        yield { 
            lowIndex: low, 
            highIndex: high, 
            midIndex: null, // Clear the mid highlight
            foundIndex: null 
        };
    }

    // If the loop finishes without finding the target
    yield { 
        lowIndex: low, 
        highIndex: high, 
        midIndex: null,
        foundIndex: null,
        message: `Target ${targetNumber} was not found in the array.` 
    };
}