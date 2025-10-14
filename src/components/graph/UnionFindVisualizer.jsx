// src/components/graph/UnionFindVisualizer.jsx
import { motion } from "framer-motion";

export default function UnionFindVisualizer({ nodes, parent, highlights }) {
    return (
        <div className="flex flex-wrap justify-center gap-6 mt-6">
            {nodes.map((node, index) => {
                const isRoot = parent[index] === index;
                const color =
                    highlights.current === index
                        ? "bg-blue-500"
                        : highlights.root === index
                            ? "bg-green-500"
                            : highlights.union.includes(index)
                                ? "bg-red-500"
                                : "bg-gray-300";

                return (
                    <motion.div
                        key={index}
                        className={`w-16 h-16 flex flex-col items-center justify-center text-white font-semibold rounded-full shadow-md ${color}`}
                        layout
                        animate={{ scale: highlights.current === index ? 1.2 : 1 }}
                    >
                        <div>{node}</div>
                        <div className="text-xs">p:{parent[index]}</div>
                        {isRoot && <div className="text-[10px]">(root)</div>}
                    </motion.div>
                );
            })}
        </div>
    );
}
