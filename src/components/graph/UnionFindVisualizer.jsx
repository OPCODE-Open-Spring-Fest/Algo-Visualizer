// src/components/graph/UnionFindVisualizer.jsx
import { motion } from "framer-motion";

export default function UnionFindVisualizer({ nodes, parent, highlights }) {
    // Calculate positions for nodes in a grid layout
    const getNodePosition = (index) => {
        const cols = Math.ceil(Math.sqrt(nodes.length));
        const row = Math.floor(index / cols);
        const col = index % cols;
        return { row, col };
    };

    // Generate connections for visualization
    const connections = [];
    nodes.forEach((node, index) => {
        if (parent[index] !== index) {
            const parentPos = getNodePosition(parent[index]);
            const childPos = getNodePosition(index);
            connections.push({
                from: childPos,
                to: parentPos,
                child: index,
                parent: parent[index]
            });
        }
    });

    return (
        <div className="relative">
            {/* SVG for connections */}
            <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                style={{ minHeight: '300px' }}
            >
                {connections.map((conn, index) => {
                    const fromX = (conn.from.col + 0.5) * (100 / Math.ceil(Math.sqrt(nodes.length))) + '%';
                    const fromY = (conn.from.row + 0.5) * (100 / Math.ceil(Math.sqrt(nodes.length))) + '%';
                    const toX = (conn.to.col + 0.5) * (100 / Math.ceil(Math.sqrt(nodes.length))) + '%';
                    const toY = (conn.to.row + 0.5) * (100 / Math.ceil(Math.sqrt(nodes.length))) + '%';
                    
                    const isHighlighted = highlights.union.includes(conn.child) || 
                                        highlights.current === conn.child ||
                                        highlights.root === conn.parent;
                    
                    return (
                        <motion.line
                            key={index}
                            x1={fromX}
                            y1={fromY}
                            x2={toX}
                            y2={toY}
                            stroke={isHighlighted ? "#ef4444" : "#6b7280"}
                            strokeWidth={isHighlighted ? "3" : "2"}
                            strokeDasharray={isHighlighted ? "5,5" : "none"}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                    );
                })}
            </svg>

            {/* Nodes */}
            <div className="grid gap-4 justify-center" style={{ 
                gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(nodes.length))}, 1fr)`,
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                {nodes.map((node, index) => {
                    const isRoot = parent[index] === index;
                    const color =
                        highlights.current === index
                            ? "bg-blue-500"
                            : highlights.root === index
                                ? "bg-green-500"
                                : highlights.union.includes(index)
                                    ? "bg-red-500"
                                    : highlights.path.includes(index)
                                        ? "bg-purple-500"
                                        : "bg-gray-600";

                    return (
                        <motion.div
                            key={index}
                            className={`w-20 h-20 flex flex-col items-center justify-center text-white font-semibold rounded-full shadow-lg border-2 border-white/20 ${color} relative`}
                            layout
                            animate={{ 
                                scale: highlights.current === index ? 1.2 : 1,
                                boxShadow: highlights.current === index ? "0 0 20px rgba(59, 130, 246, 0.5)" : "0 4px 6px rgba(0, 0, 0, 0.1)"
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-lg font-bold">{node}</div>
                            <div className="text-xs opacity-80">p:{parent[index]}</div>
                            {isRoot && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-black">R</span>
                                </div>
                            )}
                            {highlights.current === index && (
                                <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center animate-pulse">
                                    <span className="text-[10px] font-bold text-white">F</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-gray-300">
                <p>Each node shows: <span className="text-white font-semibold">Node Number</span> | <span className="text-gray-400">Parent</span></p>
                <p className="mt-1">
                    <span className="text-yellow-400">R</span> = Root | 
                    <span className="text-blue-400"> F</span> = Finding | 
                    <span className="text-red-400"> Red</span> = Unioning
                </p>
            </div>
        </div>
    );
}
