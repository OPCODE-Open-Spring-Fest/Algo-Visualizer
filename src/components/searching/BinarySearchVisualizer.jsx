import React from "react";

const COLORS = {
  default: "bg-blue-800",                                     // Bar outside the search range (eliminated)
  activeRange: "bg-blue-500 shadow-[0_0_10px_#3b82f6]",      // Bar inside the current search range
  comparing: "bg-yellow-400 shadow-[0_0_12px_#facc15]",      // Element currently being checked (mid)
  found: "bg-green-500 shadow-[0_0_12px_#22c55e]",           // Target element found
};

export default function BinarySearchVisualizer({ 
    array, 
    lowIndex, 
    highIndex, 
    midIndex, 
    foundIndex 
}) {
  const maxValue = Math.max(...array, 1);
  const containerHeight = 288; // px (matches h-72)

  return (
    <div className="flex items-end justify-center space-x-2 h-72 mt-10 transition-all duration-500">
      {array.map((value, idx) => {
        let color = COLORS.default;

        // 1. Check if the element is inside the current search range
        if (idx >= lowIndex && idx <= highIndex) {
            color = COLORS.activeRange;
        }

        // 2. Check if the element is currently being compared (mid)
        if (idx === midIndex) {
            color = COLORS.comparing;
        }

        // 3. Check if the element has been found (Highest priority)
        if (idx === foundIndex) {
          color = COLORS.found;
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