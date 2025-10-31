import React, { useState } from "react";
import HeapVisualizer from "../../components/dataStructure/HeapVisualizer.jsx";
import { createHeap } from "../../algorithms/dataStructure/heap.js";

export default function HeapPage() {
  const [heapType, setHeapType] = useState("min");
  const [heapObj, setHeapObj] = useState(() => createHeap(heapType));
  const [heap, setHeap] = useState([]);
  const [value, setValue] = useState("");

  const insertValue = () => {
    if (!value.trim()) return;
    const updated = heapObj.insert(Number(value));
    setHeap(updated);
    setValue("");
  };

  const deleteRoot = () => setHeap(heapObj.deleteRoot());
  const reset = () => {
    const cleared = heapObj.reset();
    setHeap(cleared);
  };

  const toggleType = () => {
    const newType = heapType === "min" ? "max" : "min";
    const newHeap = createHeap(newType);
    setHeapType(newType);
    setHeapObj(newHeap);
    setHeap([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-indigo-400 uppercase tracking-wide">
        {heapType.toUpperCase()} Heap Visualizer
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={insertValue}
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 transition font-semibold"
        >
          Insert
        </button>
        <button
          onClick={deleteRoot}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition font-semibold"
        >
          Delete Root
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition font-semibold"
        >
          Reset
        </button>
        <button
          onClick={toggleType}
          className="px-4 py-2 rounded bg-fuchsia-600 hover:bg-fuchsia-700 transition font-semibold"
        >
          Switch to {heapType === "min" ? "Max" : "Min"} Heap
        </button>
      </div>

      <HeapVisualizer heap={heap} />
    </div>
  );
}
