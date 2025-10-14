import React from "react";
import KruskalVisualizer from "../../components/graph/KruskalVisualizer";

export default function Kruskal() {
  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 drop-shadow-lg">
        Kruskal’s Minimum Spanning Tree Visualizer
      </h1>
      <KruskalVisualizer />
    </div>
  );
}
