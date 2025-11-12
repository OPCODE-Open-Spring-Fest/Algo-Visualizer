import React, { useState } from "react";
import MaxSumSubarray from "./MaxSumSubarray";

export default function SlidingWindowPage() {
    const [selectedAlgo, setSelectedAlgo] = useState("");
    const renderAlgorithm = () => {
        switch (selectedAlgo) {
            case "maxSumSubarray":
                return <MaxSumSubarray />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center text-center p-6 min-h-screen bg-gray-900">
                        <div className="bg-blue-200 p-[2px] rounded-2xl shadow-2xl">
                            <div className="bg-gray-900 rounded-2xl px-10 py-12 shadow-2xl">
                                <div className="flex flex-col items-center">
                                    <h2 className="text-3xl font-extrabold text-blue-400 mb-4">
                                        Sliding Window Visualizer
                                    </h2>
                                    <p className="text-gray-400 mb-6 max-w-md">
                                        Understand how the sliding window technique optimizes time complexity
                                        in problems involving subarrays and substrings. Watch the window
                                        dynamically move and update across the input sequence!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-black text-white relative">
            {/* Sidebar */}
            <div className="w-64 bg-[#0f172a] min-h-screen p-6 border-r border-gray-800 flex-shrink-0">
                <h2 className="text-xl font-bold mb-6 text-indigo-400 tracking-wide">
                    Sliding Window Panel
                </h2>

                <label className="block mb-2 text-sm text-gray-300">Algorithm:</label>
                <select value={selectedAlgo} onChange={(e) => setSelectedAlgo(e.target.value)}
                    className="w-full p-2 rounded bg-[#1e293b] text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer">
                    <option value="">Select Algorithm</option>
                    <option value="maxSumSubarray">Maximum Sum Subarray</option>
                </select>

                <button onClick={() => setSelectedAlgo("")}  className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition font-medium cursor-pointer">
                    Reset
                </button>

                <a href="/" className="inline-block mt-10 text-indigo-400 hover:underline text-sm">
                    ← Back to Home
                </a>
            </div>
            <div className="flex-1 flex overflow-auto">
                <div className="flex-1 min-h-full">
                    {renderAlgorithm()}
                </div>
            </div>
        </div>
    );
}

