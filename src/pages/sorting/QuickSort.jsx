import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import QuickSortVisualizer from "../../components/sorting/QuickSortVisualizer";
import { quickSort } from "../../algorithms/sorting/quicksort";

export default function QuickSort() {
  const [array, setArray] = useState([]);
  const [input, setInput] = useState("");
  const [highlight, setHighlight] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = async () => {
    if (isRunning || array.length === 0) return;
    setIsRunning(true);
    const gen = quickSort(array);
    for (let step of gen) {
      setHighlight(step);
      if (step.array) setArray([...step.array]);
      await new Promise((r) => setTimeout(r, 500));
    }
    setHighlight({ type: "done" });
    setIsRunning(false);
  };

  const handleReset = () => {
    setArray([]);
    setInput("");
    setHighlight(null);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const numbers = e.target.value
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));
    setArray(numbers);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-6">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 drop-shadow-lg">
        Quick Sort Visualizer
      </h1>
      <input
        type="text"
        value={input}
        onChange={handleInput}
        placeholder="Enter numbers separated by commas"
        className="border-2 border-indigo-500 bg-gray-900 text-indigo-200 rounded-lg p-3 w-96 text-center shadow-lg focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <div className="space-x-4 mt-6">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className={`${
            isRunning
              ? "bg-indigo-700 text-gray-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          } px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300`}
        >
          {isRunning ? "Sorting..." : "Start Visualization"}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
        >
          Reset
        </button>
      </div>
      <div className="mt-15">
        <QuickSortVisualizer array={array} highlight={highlight} />
      </div>
    </div>
  );
}