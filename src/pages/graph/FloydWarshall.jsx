import React from "react";
import FloydWarshallVisualizer from "../../components/graph/FloydWarshallVisualizer";

export default function FloydWarshall() {
  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 drop-shadow-lg">
        Floyd-Warshall All-Pairs Shortest Path Visualizer
      </h1>
      <FloydWarshallVisualizer />
    </div>
  );
}
