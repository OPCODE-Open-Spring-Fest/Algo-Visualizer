// src/pages/SortingPage.jsx
import React, { useState } from "react";
import SelectionSort from "./SelectionSort";
import BubbleSort from "./BubbleSort";

export default function SortingPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");

  const renderAlgorithm = () => {
    switch (selectedAlgo) {
      case "selection":
        return <SelectionSort />;
      // You can add more later like:
      case "bubble":
        return <BubbleSort />;
      // case "merge": return <MergeSort />;
      default:
        return (
          <div className="text-gray-400 text-lg mt-20 text-center">
            Select an algorithm to visualize 👆
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0f172a] p-6">
        <h2 className="text-xl font-bold mb-6 text-indigo-400">
          Sorting Panel
        </h2>

        <label className="block mb-2 text-sm">Algorithm:</label>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="w-full p-2 rounded bg-[#1e293b] text-white border border-gray-600"
        >
          <option value="">Select Algorithm</option>
          <option value="selection">Selection Sort</option>
          <option value="bubble">Bubble Sort</option>
        </select>

        <button
          onClick={() => setSelectedAlgo("")}
          className="w-full mt-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
        >
          Reset
        </button>

        <a
          href="/"
          className="inline-block mt-10 text-indigo-400 hover:underline text-sm"
        >
          ← Back to Home
        </a>
      </div>

      {/* Right Visualization Area */}
      <div className="flex-1 flex justify-center items-center">
        {renderAlgorithm()}
      </div>
    </div>
  );
}
