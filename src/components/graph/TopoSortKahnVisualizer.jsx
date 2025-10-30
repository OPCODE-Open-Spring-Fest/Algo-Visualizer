import React, { useState, useEffect, useMemo } from "react";

export default function TopoSortGraph({
  nodes = [],
  edges = [],
  processed = [],
  queue = [],
  highlight = {},
}) {
  const [positions, setPositions] = useState({});

  // Arrange nodes in a circle
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

  // Dummy layout for idle mode
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
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row items-start gap-6 mt-10">
      {/* Graph Area */}
      <div className="flex justify-center flex-1 relative">
        <svg
          width="600"
          height="500"
          className="border border-gray-700 bg-gray-900 rounded-lg shadow-lg"
        >
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

          {/* Dummy mode */}
          {nodes.length === 0 && (
            <>
              {dummyGraph.dummyEdges.map((e, i) => {
                const u = dummyGraph.dummyNodes[e.u];
                const v = dummyGraph.dummyNodes[e.v];
                return (
                  <line
                    key={i}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#6b7280"
                    strokeWidth="3"
                    strokeDasharray="10 6"
                    markerEnd="url(#arrowhead)"
                    style={{
                      opacity: 0.7,
                      animation: `dashDummy ${2 + Math.random()}s linear infinite`,
                    }}
                  />
                );
              })}
              {dummyGraph.dummyNodes.map((n) => (
                <circle
                  key={n.id}
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
              ))}
              <text
                x="300"
                y="480"
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="14"
                fontWeight="bold"
              >
                ⚙️ Demo Mode: Waiting for input...
              </text>
              <style>{`
                @keyframes pulseDummy { from { opacity: 0.5; } to { opacity: 0.9; } }
                @keyframes dashDummy { to { stroke-dashoffset: -20; } }
              `}</style>
            </>
          )}

          {/* Render real edges */}
          {edges.map((e, idx) => {
            const from = positions[e.u];
            const to = positions[e.v];
            if (!from || !to) return null;

            const isRemoved = processed.includes(e.u) && processed.includes(e.v);
            const isHighlight =
              highlight?.edge && highlight.edge.u === e.u && highlight.edge.v === e.v;

            return (
              <line
                key={idx}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlight ? "#34d399" : isRemoved ? "#4b5563" : "#9ca3af"}
                strokeWidth={isHighlight ? 4 : 2}
                markerEnd="url(#arrowhead)"
                style={{
                  filter: isHighlight ? "url(#glow)" : "none",
                  opacity: isRemoved ? 0.4 : 1,
                  transition: "all 0.4s ease",
                }}
              />
            );
          })}

          {/* Render nodes */}
          {nodes.map((n) => {
            const pos = positions[n];
            if (!pos) return null;

            const isInQueue = queue.includes(n);
            const isProcessed = processed.includes(n);
            const isHighlight = highlight?.node === n;

            let fillColor = "#1f2937";
            let strokeColor = "#9ca3af";
            if (isProcessed) fillColor = "#374151";
            if (isInQueue) strokeColor = "#34d399";
            if (isHighlight) fillColor = "#065f46";

            return (
              <g key={n} style={{ transition: "all 0.3s ease" }}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isHighlight ? 3 : 2}
                  className="cursor-pointer hover:stroke-emerald-400"
                  style={{
                    filter: isHighlight ? "url(#glow)" : "none",
                  }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {n}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Right Info Panel */}
      <div className="flex-1 max-w-md bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold text-white mb-3">
          🧮 Kahn’s Algorithm — Topological Sort
        </h2>

        {nodes.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Add nodes and edges to visualize topological sorting.
          </p>
        ) : (
          <>
            {highlight && highlight.step && (
              <div className="mb-3 p-2 bg-gray-700 rounded">
                {highlight.step === "enqueue" && (
                  <p className="text-emerald-300">
                    ➕ Added <strong>{highlight.node}</strong> to queue (in-degree 0)
                  </p>
                )}
                {highlight.step === "process" && (
                  <p className="text-emerald-400">
                    ⚙️ Processing <strong>{highlight.node}</strong>, removing outgoing edges
                  </p>
                )}
                {highlight.step === "done" && (
                  <p className="text-emerald-400 font-semibold">
                    ✅ All nodes processed. Topological order found!
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <h3 className="text-gray-300 font-medium text-sm mb-1">Queue:</h3>
                <div className="flex gap-2 flex-wrap">
                  {queue.length === 0 ? (
                    <span className="text-gray-400 text-sm">Empty</span>
                  ) : (
                    queue.map((n) => (
                      <span
                        key={n}
                        className="bg-emerald-600 px-2 py-1 rounded text-white text-sm font-semibold"
                      >
                        {n}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-gray-300 font-medium text-sm mb-1">Processed:</h3>
                <div className="flex gap-2 flex-wrap">
                  {processed.length === 0 ? (
                    <span className="text-gray-400 text-sm">None yet</span>
                  ) : (
                    processed.map((n) => (
                      <span
                        key={n}
                        className="bg-gray-600 px-2 py-1 rounded text-white text-sm font-semibold"
                      >
                        {n}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
