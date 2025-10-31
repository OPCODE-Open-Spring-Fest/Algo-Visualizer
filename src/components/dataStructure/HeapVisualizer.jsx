import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function getHeapLevels(heap) {
  const result = [];
  let levelStart = 0;
  let levelSize = 1;

  while (levelStart < heap.length) {
    result.push(heap.slice(levelStart, levelStart + levelSize));
    levelStart += levelSize;
    levelSize *= 2;
  }

  return result;
}

export default function HeapVisualizer({ heap }) {
  const levels = getHeapLevels(heap);

  return (
    <div className="flex flex-col items-center mt-10 space-y-8">
      <AnimatePresence>
        {levels.map((level, i) => (
          <motion.div
            key={i}
            className="flex justify-center space-x-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {level.map((val, j) => (
              <motion.div
                key={`${i}-${j}-${val}`}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold
                           w-16 h-16 flex items-center justify-center rounded-2xl shadow-md
                           transition-all duration-300 transform hover:scale-105"
              >
                {val}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
