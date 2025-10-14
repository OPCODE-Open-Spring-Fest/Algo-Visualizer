import React, { useState, useEffect } from "react";

export default function GraphVisualizer({ nodes = [], edges = [], distances = {}, highlight = {} }) {
  const [positions, setPositions] = useState({});

  // Arrange nodes in a circle when nodes change
  useEffect(() => {
    if (nodes.length === 0) return;

    const radius = 180;
    const centerX = 300;
    const centerY = 250;
    const newPositions = {};
    nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;
      newPositions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    setPositions(newPositions);
  }, [nodes]);

  return (
    <div className="w-full flex flex-col items-center mt-10 gap-6">
      <svg
        width="600"
        height="500"
        className="border border-gray-700 bg-gray-900 rounded-lg shadow-lg"
      >
        <defs>
          {/* Arrowhead marker */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="8"
            refY="3.5"
            orient="auto"
            fill="currentColor"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>

          {/* Glow effect for highlight */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((e, idx) => {
          const from = positions[e.u];
          const to = positions[e.v];
          if (!from || !to) return null;

          const isHighlighted =
            highlight?.edge && highlight.edge.u === e.u && highlight.edge.v === e.v;

          return (
            <g key={idx}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlighted ? "#34d399" : "#888"}
                strokeWidth={isHighlighted ? 5 : 2}
                markerEnd="url(#arrowhead)"
                style={{
                  color: isHighlighted ? "#34d399" : "#fff",
                  filter: isHighlighted ? "url(#glow)" : "none",
                  transition: "stroke 0.3s ease, stroke-width 0.3s ease",
                  strokeDasharray: isHighlighted ? "12 6" : "0",
                  animation: isHighlighted ? "dashMove 1s linear infinite" : "none",
                }}
              />
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 8}
                fill="white"
                fontSize="12"
                textAnchor="middle"
              >
                {e.w}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const pos = positions[n];
          if (!pos) return null;

          const isHighlighted = highlight?.dist && highlight.dist[n] !== undefined;

          return (
            <g key={n} style={{ transition: "all 0.3s ease" }}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="22"
                fill={isHighlighted ? "#065f46" : "#1f2937"}
                stroke={isHighlighted ? "#34d399" : "#9ca3af"}
                strokeWidth={isHighlighted ? 3 : 2}
                style={{ transition: "all 0.3s ease" }}
              />
              <text
                x={pos.x}
                y={pos.y - 5}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                {n}
              </text>
              <text
                x={pos.x}
                y={pos.y + 15}
                textAnchor="middle"
                fill="#d1d5db"
                fontSize="12"
              >
                {distances[n] === undefined || distances[n] === Infinity ? "∞" : distances[n]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ✅ Answer Box */}
      <div className="w-[600px] bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-white mb-2">📊 Result / Distances</h2>
        {Object.keys(distances).length === 0 ? (
          <p className="text-gray-400 text-sm">Run the algorithm to see results here.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {nodes.map((n) => (
              <div
                key={n}
                className="flex justify-between bg-gray-700 rounded px-3 py-1 text-sm text-gray-200"
              >
                <span className="font-semibold">Node {n}</span>
                <span>
                  {distances[n] === undefined || distances[n] === Infinity
                    ? "∞"
                    : distances[n]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edge animation keyframes */}
      <style>{`
        @keyframes dashMove {
          to {
            stroke-dashoffset: -18;
          }
        }
      `}</style>
    </div>
  );
}
