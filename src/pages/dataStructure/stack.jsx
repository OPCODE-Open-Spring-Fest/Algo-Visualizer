import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import StackVisualizer from "../../components/dataStructure/stack.jsx";
import { stackOp } from "../../algorithms/dataStructure/stack.js";

export default function StackPage() {
  const [array, setArray] = useState([]);
  const [input, setInput] = useState("");
  const [highlight, setHighlight] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const runAction = async (action) => {
    if (isRunning) return;
    setIsRunning(true);

    const gen = stackOp(array, action);
    for (let step of gen) {
      setHighlight(step);
      if (step.array) setArray([...step.array]);
      await delay(400);
    }

    await delay(150);
    setHighlight(null);
    setIsRunning(false);
  };

  const handlePush = async () => {
    if (!input.trim()) {
      toast.error("Enter a value to push");
      return;
    }
    const parsed = input.trim();
    const value = parsed.length && !Number.isNaN(Number(parsed)) ? Number(parsed) : parsed;
    await runAction({ type: "push", value });
    setInput("");
  };

  const handlePop = async () => {
    await runAction({ type: "pop" });
  };

  const handlePeek = async () => {
    await runAction({ type: "peek" });
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
    setArray(["X", "Y", "Z"]);
    setHighlight({ type: "done", array: ["X", "Y", "Z"] });
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-4 sm:p-6">
      <Toaster position="top-center" />
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-indigo-400 drop-shadow-lg text-center">
        Stack Visualizer
      </h1>

      <div className="w-full max-w-2xl">
        <div className="bg-gray-900/40 rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Value to push (number or string)"
              className="flex-1 w-full sm:w-auto border-2 border-indigo-500 bg-gray-900 text-indigo-200 rounded-lg p-3 text-center outline-none shadow-inner"
            />
            <button
              onClick={handlePush}
              disabled={isRunning}
              className={`w-full sm:w-auto ${
                isRunning ? "bg-indigo-700 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
              } px-4 py-2 rounded text-white font-semibold`}
            >
              Push
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
            <button
              onClick={handlePop}
              disabled={isRunning}
              className={`col-span-1 w-full ${
                isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-500"
              } px-4 py-2 rounded text-white font-semibold`}
            >
              Pop
            </button>

            <button
              onClick={handlePeek}
              disabled={isRunning}
              className={`col-span-1 w-full ${
                isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"
              } px-4 py-2 rounded text-white font-semibold`}
            >
              Peek
            </button>

            <button
              onClick={handleClear}
              disabled={isRunning}
              className={`col-span-1 w-full ${
                isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
              } px-4 py-2 rounded text-white font-semibold`}
            >
              Clear
            </button>

            <button
              onClick={handleReset}
              className="col-span-1 w-full bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white font-semibold"
            >
              Reset
            </button>

            <button
              onClick={sampleLoad}
              className="col-span-1 w-full bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded text-white font-semibold"
            >
              Load Demo
            </button>
          </div>
        </div>

        <div className="mt-6">
          <StackVisualizer array={array} highlight={highlight} />
        </div>

        <div className="mt-4 text-sm text-slate-400 text-center">
          Tip: top of stack is shown at the top (index 0). Push adds to top; Pop removes the top (LIFO).
        </div>
      </div>
    </div>
  );
}