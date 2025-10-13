import React from "react";

const COLORS = {
  default: "bg-blue-500 shadow-[0_0_10px_#3b82f6]",
  comparing: "bg-yellow-400 shadow-[0_0_12px_#facc15]",
  min: "bg-green-500 shadow-[0_0_12px_#22c55e]",
  swap: "bg-red-500 shadow-[0_0_12px_#ef4444]",
};

export default function SelectionSortVisualizer({ array, highlight }) {
  const maxValue = Math.max(...array, 1); // Avoid division by zero
  const containerHeight = 288; // px (matches h-72)

  return (
    <div className="flex items-end justify-center space-x-2 h-72 mt-10 transition-all duration-500">
      {array.map((value, idx) => {
        let color = COLORS.default;
        if (highlight?.type === "compare" && highlight.indices?.includes(idx))
          color = COLORS.comparing;
        if (highlight?.type === "min" && highlight.index === idx)
          color = COLORS.min;
        if (highlight?.type === "swap" && highlight.indices?.includes(idx))
          color = COLORS.swap;

        // Normalize height relative to the maximum value
        const height = Math.max((value / maxValue) * containerHeight, 15); // minimum 15px for visibility

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
