import React, { useState, useEffect, useMemo } from "react";

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

  // ✅ Memoize dummy nodes and edges at top level
  const dummyGraph = useMemo(() => {
    const dummyNodes = Array.from({ length: 6 }).map((_, i) => {
      const radius = 180;
      const centerX = 300;
      const centerY = 250;
      const angle = (2 * Math.PI * i) / 6;
      return {
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    const dummyEdges = Array.from({ length: 8 }).map(() => {
      const u = Math.floor(Math.random() * 6);
      const v = (u + 1 + Math.floor(Math.random() * 5)) % 6;
      return { u, v };
    });

    return { dummyNodes, dummyEdges };
  }, []); // runs only once

  return (
    <div className="w-full flex flex-col lg:flex-row items-start gap-6 mt-10">
      <div className="flex justify-center flex-1 relative">
        <svg width="600" height="500" className="border border-gray-700 bg-gray-900 rounded-lg shadow-lg">
          <defs>
            <marker
              id="arrowhead-dummy"
              markerWidth="10"
              markerHeight="7"
              refX="8"
              refY="3.5"
              orient="auto"
              fill="#9ca3af"
            >
              <polygon points="0 0, 10 3.5, 0 7" />
            </marker>
            <filter id="glow-dummy">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <defs>
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
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dummy graph if no nodes yet */}
          {nodes.length === 0 && (
            <>
              {dummyGraph.dummyNodes.map((n) => (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="22"
                    fill="#374151"
                    stroke="#6b7280"
                    strokeWidth="2"
                    style={{
                      opacity: 0.7,
                      animation: `pulseDummy ${1.5 + Math.random()}s infinite alternate`,
                    }}
                  />
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    ?
                  </text>
                </g>
              ))}

              {dummyGraph.dummyEdges.map((e, i) => {
                const x1 = dummyGraph.dummyNodes[e.u].x;
                const y1 = dummyGraph.dummyNodes[e.u].y;
                const x2 = dummyGraph.dummyNodes[e.v].x;
                const y2 = dummyGraph.dummyNodes[e.v].y;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#6b7280"
                    strokeWidth="3"
                    strokeDasharray="12 8"
                    strokeDashoffset={Math.random() * 20}
                    markerEnd="url(#arrowhead-dummy)"
                    style={{
                      filter: "url(#glow-dummy)",
                      animation: `dashMoveDummy ${2 + Math.random()}s linear infinite`,
                    }}
                  />
                );
              })}

              <text
                x="300"
                y="480"
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="14"
                fontWeight="bold"
              >
                🎯 Demo graph: edges light up like traversal!
              </text>

              <style>{`
                @keyframes pulseDummy { from { opacity: 0.5; } to { opacity: 0.9; } }
                @keyframes dashMoveDummy { to { stroke-dashoffset: -20; } }
              `}</style>
            </>
          )}

          {/* Real edges and nodes rendering (same as before) */}

          
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
                  className="cursor-pointer hover:stroke-emerald-400"
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
      </div>

      {/* Result / Details Panel */}
      <div className="flex-1 max-w-md bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold text-white mb-4">📊 Algorithm Details</h2>

        {Object.keys(distances).length === 0 ? (
          <p className="text-gray-400 text-sm">
            Run the algorithm to see node distances and steps here.
          </p>
        ) : (
          <>
            {highlight && highlight.type && (
              <div className="mb-4 p-2 bg-gray-700 rounded">
                {highlight.type === "relax" && (
                  <p className="text-emerald-300">
                    Iteration {highlight.iteration}: Relaxing edge{" "}
                    <strong>{highlight.edge.u} → {highlight.edge.v}</strong>
                  </p>
                )}
                {highlight.type === "skip" && (
                  <p className="text-gray-400">
                    Iteration {highlight.iteration}: Skipped edge{" "}
                    <strong>{highlight.edge.u} → {highlight.edge.v}</strong>
                  </p>
                )}
                {highlight.type === "negative-cycle" && (
                  <p className="text-red-400 font-semibold">
                    ❌ Negative weight cycle detected on edge{" "}
                    <strong>{highlight.edge.u} → {highlight.edge.v}</strong>
                  </p>
                )}
                {highlight.type === "done" && (
                  <p className="text-emerald-400 font-semibold">
                    ✅ Algorithm finished. Final distances updated!
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {nodes.map((n) => (
                <div
                  key={n}
                  className="flex justify-between bg-gray-700 rounded px-3 py-1 text-sm text-gray-200 hover:bg-gray-600 transition"
                >
                  <span className="font-semibold">Node {n}</span>
                  <span>
                    {distances[n] === undefined || distances[n] === Infinity ? "∞" : distances[n]}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes dashMove {
          to {
            stroke-dashoffset: -18;
          }
        }
      `}
      </style>
    </div>
  );
}
