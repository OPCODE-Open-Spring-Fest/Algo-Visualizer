import React, { useState } from "react";
import { X, Menu } from "lucide-react";
import MazeSolver from "./MazeSolver";
import NQueens from "./NQueens";
export default function RecursionPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderAlgorithm = () => {
    switch (selectedAlgo) {
      case "MazeSolver":
        return (
          <div className="w-full p-4 overflow-auto">
            <MazeSolver />
          </div>
        );
      case "NQueens":
        return (
          <div className="w-full p-4 overflow-auto">
            <NQueens />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center p-6 min-h-screen bg-gray-900 text-gray-300">
            <h2 className="text-6xl font-bold text-indigo-400 mb-2">
              Recursion & Backtracking Visualizer
            </h2>
            <p className="text-2xl mt-8 text-gray-400">
              Select an algorithm from the left panel to start visualization.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "hidden"
          } fixed md:static md:translate-x-0 transition-transform duration-300 w-64 bg-gray-900 min-h-screen p-6 border-r border-gray-800 flex-shrink-0 z-20`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-indigo-400">
            Recursion Panel
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <label className="block mb-2 text-sm text-gray-400">Algorithm:</label>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Select Algorithm</option>
          <option value="MazeSolver">Maze Solver</option>
          <option value="NQueens">NQueens</option>
        </select>

        <button
          onClick={() => setSelectedAlgo("")}
          className="w-full mt-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition text-sm font-medium text-gray-200"
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

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 p-2 bg-gray-800 rounded-md hover:bg-gray-700 z-10"
        >
          <Menu className="w-6 h-6 text-indigo-400" />
        </button>
      )}

      <div className="flex-1 overflow-auto">{renderAlgorithm()}</div>
    </div>
  );
}
