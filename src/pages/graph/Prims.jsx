import React from "react";
import PrimsVisualizer from "../../components/graph/PrimsVisualizer";

export default function Prims() {
  return (
    <div className="min-h-screen bg-black text-gray-200 p-4">
      <h1 className="text-3xl font-bold text-indigo-400 text-center mb-6">
        Prim's Minimum Spanning Tree
      </h1>
      <PrimsVisualizer />
    </div>
  );
}
