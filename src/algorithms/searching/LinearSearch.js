/**
 * A generator function that performs Linear Search and yields visualization steps.
 * @param {number[]} array - The array to search through.
 * @param {number} target - The value to find.
 * @yields {{highlightIndex: number | null, foundIndex: number | null, message?: string}}
 */
export function* linearSearch(array, target) {
    const targetNumber = parseInt(target); // Ensure target is a number
    let foundIndex = null;

    // Iterate through the array
    for (let i = 0; i < array.length; i++) {
        // 1. Yield the current index being compared (yellow highlight)
        yield { 
            highlightIndex: i, 
            foundIndex: foundIndex 
        };

        // 2. Check for the target
        if (array[i] === targetNumber) {
            foundIndex = i;
            // Target found, yield the final state (green) and return
            yield { 
                highlightIndex: i, 
                foundIndex: foundIndex, 
                message: `Success! Found target ${targetNumber} at index ${i}` 
            };
            return; // Stop the generator
        }
    }

    // If the loop finishes without finding the target
    yield { 
        highlightIndex: null, // Clear highlight
        foundIndex: null,     // Not found
        message: `Target ${targetNumber} was not found in the array.`
    };
}