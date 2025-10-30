import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { queueOp } from "../../algorithms/dataStructure/queue.js";
import QueueVisualizer from "../../components/dataStructure/queue.jsx";

export default function QueuePage() {
  const [array, setArray] = useState([]);
  const [input, setInput] = useState("");
  const [highlight, setHighlight] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const runAction = async (action) => {
    if (isRunning) return;
    setIsRunning(true);

    const gen = queueOp(array, action);
    for (let step of gen) {
      if (step.message) toast.error(step.message);
      setHighlight(step);
      if (step.array) setArray([...step.array]);
      await delay(400);
    }

    await delay(150);
    setHighlight(null);
    setIsRunning(false);
  };

  const handleEnqueue = async () => {
    if (!input.trim()) {
      toast.error("Enter a value to enqueue");
      return;
    }
    const parsed = input.trim();
    const value = parsed.length && !Number.isNaN(Number(parsed)) ? Number(parsed) : parsed;
    await runAction({ type: "enqueue", value });
    setInput("");
  };

  const handleDequeue = async () => {
    await runAction({ type: "dequeue" });
  };

  const handleFront = async () => {
    await runAction({ type: "front" });
  };

  const handleClear = async () => {
    await runAction({ type: "clear" });
  };

  const handleReset = () => {
    setArray([]);
    setInput("");
    setHighlight(null);
  };

  const sampleLoad = () => {
    setArray(["A", "B", "C"]);
    setHighlight({ type: "done", array: ["A", "B", "C"] });
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-4 sm:p-6">
      <Toaster position="top-center" />
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-indigo-400 drop-shadow-lg text-center">
        Queue Visualizer
      </h1>

      <div className="w-full max-w-2xl">
        <div className="bg-gray-900/40 rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Value to enqueue (number or string)"
              className="flex-1 w-full border-2 border-indigo-500 bg-gray-900 text-indigo-200 rounded-lg p-3 text-center outline-none shadow-inner"
            />
            <button
              onClick={handleEnqueue}
              disabled={isRunning}
              className={`w-full sm:w-auto ${
                isRunning ? "bg-indigo-700 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
              } px-4 py-2 rounded text-white font-semibold`}
            >
              Enqueue
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
            <button
              onClick={handleDequeue}
              disabled={isRunning}
              className={`${
                isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-500"
              } px-4 py-2 rounded text-white font-semibold`}
            >
              Dequeue
            </button>

            <button
              onClick={handleFront}
              disabled={isRunning}
              className={`${
                isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"
              } px-4 py-2 rounded text-white font-semibold`}
            >
              Front
            </button>

            <button
              onClick={handleClear}
              disabled={isRunning}
              className={`${
                isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
              } px-4 py-2 rounded text-white font-semibold`}
            >
              Clear
            </button>

            <button
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white font-semibold"
            >
              Reset
            </button>

            <button
              onClick={sampleLoad}
              className="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded text-white font-semibold"
            >
              Load Demo
            </button>
          </div>
        </div>

        <div className="mt-6">
          <QueueVisualizer array={array} highlight={highlight} />
        </div>

        <div className="mt-4 text-sm text-slate-400 text-center">
          Tip: Front of queue is on the left; Enqueue adds to end; Dequeue removes from front (FIFO).
        </div>
      </div>
    </div>
  );
}
