import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LinkedListVisualizer({
  array = [],
  highlight = null,
  variant = "singly",
}) {
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [containerBounds, setContainerBounds] = useState(null);

  // Recalculate node positions when array changes
  useEffect(() => {
    if (!containerRef.current || array.length === 0) {
      setPositions([]);
      return;
    }

    // Wait briefly for DOM to update
    const timer = setTimeout(() => {
      const container = containerRef.current?.getBoundingClientRect();
      const nodes = Array.from(
        containerRef.current.querySelectorAll(".ll-node")
      );

      if (nodes.length > 0 && container) {
        const rects = nodes.map((n) => n.getBoundingClientRect());
        setPositions(rects);
        setContainerBounds(container);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [array.length]); // triggers on insert/delete

  if (!array || array.length === 0)
    return (
      <div className="flex items-center justify-center text-slate-400 text-lg h-40">
        List is empty
      </div>
    );

  const isCircular = variant === "circular";
  const isDoubly = variant === "doubly";

  // Color logic for different highlight actions
  const getNodeColor = (idx) => {
    const isActive = highlight && highlight.index === idx;
    const type = highlight?.type;
    if (type === "insert" && isActive) return "bg-emerald-700 text-white";
    if (type === "delete" && isActive) return "bg-rose-600 text-white";
    if (type === "traverse" && isActive) return "bg-yellow-500 text-black";
    return "bg-slate-800 text-white";
  };

  // ✅ Improved circular path calculation (perfectly connects)
  const getCircularPath = () => {
    if (!isCircular || positions.length < 2 || !containerBounds) return null;

    const first = positions[0];
    const last = positions[positions.length - 1];

    // Calculate path start/end near bottom centers
    const startX =
      last.right - containerBounds.left - last.width * 0.2; // tail bottom-right inward
    const startY = last.bottom - containerBounds.top - 5;

    const endX = first.left - containerBounds.left + first.width * 0.2; // head bottom-left inward
    const endY = first.bottom - containerBounds.top - 5;

    // Control point for smooth curve below nodes
    const controlY = Math.max(startY, endY) + 60;
    const midX = (startX + endX) / 2;

    return {
      path: `M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`,
      startX,
      startY,
      endX,
      endY,
    };
  };

  const circularPath = getCircularPath();

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center gap-6 p-6 min-h-[240px]"
    >
      {/* --- SVG Circular Connection --- */}
      {isCircular && circularPath && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="circular-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>

          <motion.path
            d={circularPath.path}
            stroke="url(#circular-gradient)"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="8 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Label on the path */}
          <text
            x={(circularPath.startX + circularPath.endX) / 2}
            y={Math.max(circularPath.startY, circularPath.endY) + 50}
            textAnchor="middle"
            className="fill-slate-300 text-xs"
          >
            Tail → Head
          </text>
        </svg>
      )}

      {/* --- Nodes --- */}
      <AnimatePresence mode="popLayout">
        {array.map((val, idx) => (
          <motion.div
            key={`${val}-${idx}`}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative ll-node flex flex-col items-center justify-center w-16 h-16 rounded-lg shadow-md ${getNodeColor(
              idx
            )}`}
          >
            {/* Index label */}
            <div className="absolute -top-5 text-xs text-slate-400">
              [{idx}]
            </div>

            {/* Node value */}
            <div className="text-base font-semibold">{val}</div>

            {/* HEAD label */}
            {idx === 0 && (
              <span className="absolute -bottom-6 text-xs text-emerald-400 font-semibold">
                HEAD
              </span>
            )}

            {/* TAIL label */}
            {idx === array.length - 1 && (
              <span
                className={`absolute text-xs font-semibold ${
                  isCircular
                    ? "top-[70px] text-cyan-400"
                    : "-bottom-6 text-rose-400"
                }`}
              >
                TAIL
              </span>
            )}

            {/* Doubly linked backward pointer */}
            {isDoubly && idx > 0 && (
              <span className="absolute -left-5 text-lg text-slate-500">←</span>
            )}

            {/* Forward pointer */}
            {(idx < array.length - 1 || isCircular) && (
              <span className="absolute -right-5 text-lg text-slate-500">→</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* --- Info Label --- */}
      {isCircular && (
        <div className="absolute bottom-2 text-slate-400 text-sm italic">
          ↻ Circular Linked List — Tail connects back to Head
        </div>
      )}
    </div>
  );
}
    