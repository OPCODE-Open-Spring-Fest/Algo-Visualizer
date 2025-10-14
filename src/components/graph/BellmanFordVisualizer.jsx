import React from "react";

export default function BellmanFordVisualizer({ nodes, edges, distances, highlight }) {
  return (
    <div className="text-white flex flex-col items-center gap-6 mt-8">
      {/* Nodes */}
      <div className="grid grid-cols-6 gap-4">
        {nodes.map((n) => (
          <div
            key={n}
            className={`relative flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 text-xl font-bold transition ${
              highlight?.dist && highlight.dist[n] !== undefined
                ? "border-emerald-400 bg-gray-800"
                : "border-gray-600 bg-gray-900"
            }`}
          >
            {n}
            <div className="text-xs mt-1 text-gray-300">
              {distances[n] === Infinity ? "∞" : distances[n] ?? "∞"}
            </div>
          </div>
        ))}
      </div>

      {/* Edges */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-2">Edges</h2>
        <ul className="space-y-1">
          {edges.map((e, idx) => (
            <li
              key={idx}
              className={`flex justify-between rounded-md px-2 py-1 transition ${
                highlight?.edge &&
                highlight.edge.u === e.u &&
                highlight.edge.v === e.v
                  ? "bg-emerald-700 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              <span>
                {e.u} → {e.v}
              </span>
              <span>w = {e.w}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Step Info */}
      {highlight && (
        <div className="mt-4 text-center">
          {highlight.type === "relax" && (
            <p className="text-emerald-300">
              Iteration {highlight.iteration}: Relaxing edge {highlight.edge.u} → {highlight.edge.v}
            </p>
          )}
          {highlight.type === "skip" && (
            <p className="text-gray-400">
              Iteration {highlight.iteration}: No update on edge {highlight.edge.u} → {highlight.edge.v}
            </p>
          )}
          {highlight.type === "done" && (
            <p className="text-emerald-400 font-semibold">✅ Algorithm finished. Final distances updated!</p>
          )}
          {highlight.type === "negative-cycle" && (
            <p className="text-red-400 font-semibold">
              ❌ Negative weight cycle detected on edge {highlight.edge.u} → {highlight.edge.v}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
