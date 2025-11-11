import React from "react";

export default function MaxSumSubarrayVisualizer({array, windowStart, windowEnd, currentSum, maxSum, type, removedIndex, addedIndex}) {
    if (!array || array.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-400 text-lg">
                No array data to visualize
            </div>
        );
    }
    const maxValue = Math.max(...array, 1);
    const containerHeight = 320;

    const getColor = (idx) => {
        if (windowStart < 0 || windowEnd < 0) return "bg-gray-600";
        if (type === "slide_start" && idx === removedIndex) return "bg-red-500";
        if ((type === "slide_start" || type === "slide_update") && idx === addedIndex)
            return "bg-yellow-400";
        if (type === "new_max" && idx >= windowStart && idx <= windowEnd)
            return "bg-purple-500 animate-pulse";
        if (idx === windowStart || idx === windowEnd) return "bg-green-500";
        if (idx >= windowStart && idx <= windowEnd) return "bg-blue-500";
        return "bg-gray-500";
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-end justify-center space-x-4 transition-all duration-500">
                {array.map((value, idx) => {
                    const color = getColor(idx);
                    const height = Math.max((value / maxValue) * containerHeight, 40);
                    return (
                        <div key={idx} className="flex flex-col items-center">
                            <div
                                className={`${color} w-16 sm:w-12 rounded-t-md transition-all duration-300 shadow-lg`}
                                style={{ height: `${height}px` }}
                            ></div>
                            <span className="text-sm text-gray-200 mt-2 font-medium">
                                {value}
                            </span>
                        </div>
                    );
                })}
            </div>
            {windowStart >= 0 && windowEnd >= 0 && (
                <div className="flex justify-center gap-10 text-base text-gray-200 bg-gray-900/70 border border-gray-700 px-8 py-4 rounded-xl shadow-md">
                    <div>
                        <span className="text-gray-400">Window:</span>{" "}
                        <span className="text-indigo-400 font-semibold text-lg">
                            [{windowStart}, {windowEnd}]
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-400">Sum:</span>{" "}
                        <span className="text-yellow-400 font-semibold text-lg">
                            {currentSum}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-400">Max:</span>{" "}
                        <span className="text-purple-400 font-semibold text-lg">
                            {maxSum !== Number.NEGATIVE_INFINITY ? maxSum : "N/A"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
