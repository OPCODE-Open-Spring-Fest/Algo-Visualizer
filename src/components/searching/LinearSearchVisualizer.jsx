import React from "react";

// Updated colors for searching visualization
const COLORS = {
  default: "bg-blue-500 shadow-[0_0_10px_#3b82f6]",         // Default bar color
  comparing: "bg-yellow-400 shadow-[0_0_12px_#facc15]",     // Element currently being checked
  found: "bg-green-500 shadow-[0_0_12px_#22c55e]",           // Target element found
  miss: "bg-red-500 shadow-[0_0_12px_#ef4444]",              // Optional: To highlight elements that were skipped (e.g., in Binary Search)
};

export default function LinearSearchVisualizer({ 
    array, 
    highlightIndex, 
    foundIndex 
}) {
  const maxValue = Math.max(...array, 1);
  const containerHeight = 288; // px (matches h-72)

  return (
    <div className="flex items-end justify-center space-x-2 h-72 mt-10 transition-all duration-500">
      {array.map((value, idx) => {
        let color = COLORS.default;

        // 1. Check if the element has been found (Highest priority for the final result)
        if (foundIndex === idx) {
          color = COLORS.found;
        } 
        // 2. Check if the element is currently being compared
        else if (highlightIndex === idx) {
          color = COLORS.comparing;
        }

        // Normalize height relative to the maximum value
        const height = Math.max((value / maxValue) * containerHeight, 15);

        return (
          <div
            key={idx}
            className={`${color} w-6 transition-all duration-300 rounded-t-md`}
            style={{ height: `${height}px` }}
          ></div>
        );
      })}
    </div>
  );
}