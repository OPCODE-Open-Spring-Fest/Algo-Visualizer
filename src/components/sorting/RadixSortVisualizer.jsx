import React from "react";

const COLORS = {
    default: "bg-blue-500 shadow-[0_0_10px_#3b82f6]",
    comparing: "bg-yellow-400 shadow-[0_0_12px_#facc15]",
    bucket: "bg-purple-500 shadow-[0_0_12px_#a855f7]",
    swap: "bg-red-500 shadow-[0_0_12px_#ef4444]",
    sorted: "bg-green-500 shadow-[0_0_12px_#22c55e]",
};

export default function RadixSortVisualizer({ array, highlight }) {
    const maxValue = Math.max(...array, 1);
    const containerHeight = 288; // matches h-72

    return (
        <div className="flex flex-col items-center mt-10 space-y-6">
            {/* Main Array Display */}
            <div className="flex items-end justify-center space-x-2 h-72 transition-all duration-500">
                {array.map((value, idx) => {
                    let color = COLORS.default;

                    if (highlight?.type === "compare" && highlight.indices?.includes(idx))
                        color = COLORS.comparing;
                    if (highlight?.type === "bucket" && highlight.indices?.includes(idx))
                        color = COLORS.bucket;
                    if (highlight?.type === "swap" && highlight.indices?.includes(idx))
                        color = COLORS.swap;
                    if (highlight?.type === "sorted" && highlight.indices?.includes(idx))
                        color = COLORS.sorted;

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

            {/* Current Digit / Pass Info */}
            {highlight?.digit !== undefined && (
                <div className="text-center text-lg font-medium text-gray-300">
                    Processing Digit Place:{" "}
                    <span className="text-yellow-400">{highlight.digit}</span>
                </div>
            )}

            {/* Buckets Visualization */}
            {highlight?.buckets && (
                <div className="grid grid-cols-10 gap-4 text-center">
                    {highlight.buckets.map((bucket, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="text-gray-300 text-sm mb-2">Bucket {i}</div>
                            <div className="flex space-x-1">
                                {bucket.map((val, j) => (
                                    <div
                                        key={j}
                                        className={`${COLORS.bucket} w-4 h-4 rounded-sm`}
                                        title={val}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
