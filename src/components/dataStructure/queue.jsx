import React from "react";
import { motion } from "framer-motion";

export default function QueueVisualizer({ array, highlight }) {
  return (
    <div className="flex justify-center">
      <div className="flex items-end gap-2 overflow-x-auto p-2 bg-gray-800/30 rounded-lg border border-indigo-600 shadow-inner min-h-[100px] w-full">
        {array.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`min-w-[60px] sm:min-w-[70px] h-[70px] flex items-center justify-center rounded-lg font-bold border-2 text-white text-lg ${
              highlight?.highlight === i
                ? "bg-yellow-500 border-yellow-300 text-black"
                : "bg-indigo-600 border-indigo-400"
            }`}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
