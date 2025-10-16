import React, { useState } from "react";
import { Network, Compass, Rocket } from "lucide-react";
import BellmanFord from "./BellmanFord";
import UnionFindPage from "./UnionFind";
import Kruskal from "./Kruskal"; 
import FloydWarshall from "./FloydWarshall";

export default function GraphPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");

  const renderAlgorithm = () => {
    switch (selectedAlgo) {
      case "bellman-ford":
        return (
          <div className="w-full h-full overflow-auto p-">
            <BellmanFord />
          </div>
        );
      case "union-find":
        return (
          <div className="w-full h-full overflow-auto p-">
            <UnionFindPage />
          </div>
        );
      case "kruskal": 
        return (
          <div className="w-full h-full overflow-auto p-">
            <Kruskal />
          </div>
        );
      case "floyd-warshall":
        return (
          <div className="w-full h-full overflow-auto p-">
            <FloydWarshall />
          </div>
        );
      // case "dijkstra":
      //   return <Dijkstra />;
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="bg-gradient-to-tr from-indigo-500 via-blue-400 to-purple-500 p-[2px] rounded-2xl">
              <div className="bg-gray-950 rounded-2xl px-10 py-12 shadow-2xl">
                <div className="flex justify-center mb-4">
                  <Network className="w-16 h-16 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Graph Algorithm Visualizer
                </h2>
                <p className="text-gray-400 mb-6 max-w-sm">
                  Select a graph algorithm from the sidebar to begin visualization.
                  Watch how edges, nodes, and distances transform step by step! 🧠✨
                </p>
                <div className="flex items-center justify-center gap-6">
                  <Compass className="w-8 h-8 text-blue-400 animate-pulse" />
                  <Rocket className="w-8 h-8 text-purple-400 animate-bounce" />
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
          Graph Panel
        </h2>

        <label className="block mb-2 text-sm">Algorithm:</label>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="w-full p-2 rounded bg-[#1e293b] text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Select Algorithm</option>
          <option value="bellman-ford">Bellman–Ford</option>
          <option value="union-find">Union Find</option>
          <option value="kruskal">Kruskal</option> {/* ✅ New dropdown option */}
          <option value="floyd-warshall">Floyd-Warshall</option>
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
