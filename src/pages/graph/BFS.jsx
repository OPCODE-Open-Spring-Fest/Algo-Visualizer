import React from "react";
import BFSVisualizer from "../../components/graph/BFSVisualizer";

export default function BFS() {
  return (
    <div className="w-full min-h-screen bg-gray-950 text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
          Breadth-First Search (BFS) Visualizer
        </h1>
        <BFSVisualizer />
      </div>
    </div>
  );
}
