import React, { useState } from "react";
import { Target } from "lucide-react";
import FractionalKnapsackPage from "./FractionalKnapsack";

export default function GreedyPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const renderAlgorithm = () => {
    switch (selectedAlgo) {
      case "fractional-knapsack":
        return <FractionalKnapsackPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center p-6 mt-24">
            <div className="text-white border-2 p-[2px] rounded-2xl">
              <div className="bg-gray-700 rounded-2xl px-10 py-12 shadow-2xl">
                <div className="flex justify-center mb-4">
                  <Target className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-2">
                  Greedy Algorithms Visualizer
                </h2>
                <p className="text-gray-400 mb-6 max-w-sm">
                  Select a greedy algorithm from the sidebar to begin
                  visualization. Watch how greedy choices lead to optimal solutions!
                </p>
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f172a] p-6 border-r border-gray-800 flex-shrink-0">
        <h2 className="text-xl font-bold mb-6 text-indigo-400 tracking-wide">
          Greedy Panel
        </h2>
        <label className="block mb-2 text-sm">Algorithm:</label>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="w-full p-2 rounded bg-[#1e293b] text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          <option value="">Select Algorithm</option>
          <option value="fractional-knapsack">Fractional Knapsack</option>
        </select>
        <button
          onClick={() => setSelectedAlgo("")}
          className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition font-medium">
          Reset
        </button>
        <a href="/" className="inline-block mt-10 text-indigo-400 hover:underline text-sm">
          ← Back to Home
        </a>
      </div>
      <div className="flex-1 flex overflow-auto">
        <div className="flex-1 min-w-[800px] min-h-full p-4 overflow-y-auto">
          {renderAlgorithm()}
        </div>
      </div>
    </div>
  );
}

