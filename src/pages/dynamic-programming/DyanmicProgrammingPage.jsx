import React, { useState } from "react";
import { Grid,Brain,Layers,Code } from "lucide-react";
import Levenshtein from "./Levenshtein";

export default function DynamicProgrammingPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");

  const renderAlgorithm = () => {
    switch (selectedAlgo) {
      case "Levenshtein":
        return (
          <div className="w-full h-full overflow-auto p-4">
            <Levenshtein />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center p-6 min-h-screen bg-gray-950">
            <div className="bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[2px] rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.4)]">
              <div className="bg-gray-950 rounded-2xl px-10 py-12 shadow-2xl">
                <div className="flex justify-center mb-4">
                  <Grid className="w-16 h-16 text-cyan-400 animate-spin-slow" />
                </div>
                <div className="flex flex-col  items-center">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Dynamic Programming Visualizer
                </h2>
                <p className="text-gray-400 mb-6 max-w-md">
                  Understand how overlapping subproblems and optimal
                  substructures work in real time. Visualize table-filling,
                  recursion trees, and memoization flow with stunning
                  animations! ⚙️🧩
                </p>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />
                  <Layers className="w-8 h-8 text-purple-400 animate-bounce" />
                  <Code className="w-8 h-8 text-cyan-400 animate-fade" />
                </div>
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
          DP Panel
        </h2>

        <label className="block mb-2 text-sm">Algorithm:</label>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="w-full p-2 rounded bg-[#1e293b] text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Select Algorithm</option>
          <option value="Levenshtein">Levenshtein Distance</option>
        </select>

        <button
          onClick={() => setSelectedAlgo("")}
          className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition font-medium"
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

      {/* Visualization Area */}
      <div className="flex-1 flex overflow-auto">
        <div className="flex-1 min-w-[800px] min-h-full">
          {renderAlgorithm()}
        </div>
      </div>
    </div>
  );
}
