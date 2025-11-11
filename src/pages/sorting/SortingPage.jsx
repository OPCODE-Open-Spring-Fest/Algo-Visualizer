import React, { useState } from "react";
import SelectionSort from "./SelectionSort";
import BubbleSort from "./BubbleSort";
import InsertionSort from "./InsertionSort";
import QuickSort from "./QuickSort";
import MergeSort from "./MergeSort";
import RadixSort from "./RadixSort";
import CountingSort from "./CountingSort";

export default function SortingPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");

  const renderAlgorithm = () => {
    switch (selectedAlgo) {
      case "selection":
        return <SelectionSort />;
      case "insertion":
        return <InsertionSort />;
      case "bubble":
        return <BubbleSort />;
      case "quick":
        return <QuickSort />;
      case "merge":
        return <MergeSort />;
      case "radix":
        return <RadixSort />
      case "counting":
        return <CountingSort />
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
          <option valueD="insertion">Insertion Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="radix">Radix Sort</option>
          <option value="counting">Counting Sort</option>
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

      
      <div className="flex-1 flex justify-center items-center">
        {renderAlgorithm()}
      </div>
    </div>
  );
}