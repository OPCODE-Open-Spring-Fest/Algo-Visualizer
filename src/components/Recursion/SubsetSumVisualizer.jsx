import React, { useEffect, useRef, useState } from "react";
import { getSubsetSumSteps } from "../../algorithms/Recursion/SubsetSum";

const MIN_SPEED = 50;
const MAX_SPEED = 2000;

const Color = ({ color, text }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded ${color}`} />
    <span className="text-gray-300 text-sm">{text}</span>
  </div>
);

export default function SubsetSumVisualizer() {
  const [inputArray, setInputArray] = useState("3, 34, 4, 12, 5, 2");
  const [arr, setArr] = useState([3, 34, 4, 12, 5, 2]);
  const [target, setTarget] = useState(9);

  const [steps, setSteps] = useState([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [solutions, setSolutions] = useState([]);

  const [speed, setSpeed] = useState(400);
  const timerRef = useRef(null);

  const parseArray = () => {
    const parsed = inputArray
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n));

    return parsed.length ? parsed : null;
  };

  const regenerate = () => {
    const res = getSubsetSumSteps(arr, target);
    setSteps(res.steps);
    setSolutions(res.solutions);
    setIdx(0);
    setPlaying(false);
  };

  const handleStart = () => {
    const parsed = parseArray();
    if (!parsed) {
      alert("Invalid array");
      return;
    }

    clearTimeout(timerRef.current);
    setPlaying(false);

    setArr(parsed);

    setTimeout(() => {
      regenerate();
      setIdx(0);
      setPlaying(true);
    }, 80);
  };
  const handlePauseResume = () => {
    if (steps.length === 0) return;
    clearTimeout(timerRef.current);
    setPlaying((p) => !p);
  };
  const handleReset = () => {
    clearTimeout(timerRef.current);
    setPlaying(false);
    setIdx(0);
  };
  useEffect(() => {
    clearTimeout(timerRef.current);

    if (playing && idx < steps.length - 1) {
      timerRef.current = setTimeout(() => setIdx((i) => i + 1), speed);
    }

    return () => clearTimeout(timerRef.current);
  }, [playing, idx, steps, speed]);

  const step = steps[idx] || {};

  const getCellColor = (i, s) => {
    if (!step.dp) return "bg-gray-700";

    if (step.type === "process_cell" && step.i === i && step.sum === s)
      return "bg-blue-400 text-black";

    if (step.type === "true_set" && step.i === i && step.sum === s)
      return step.by === "include"
        ? "bg-green-500 text-black"
        : "bg-green-100 text-black";

    return step.dp[i][s] ? "bg-green-700" : "bg-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Subset Sum Visualizer
        </h1>
        {/*Controls*/}
        <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm">Array</label>
              <input
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600"
                placeholder="comma-separated"
              />
            </div>
            <div>
              <label className="text-sm">Target</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-20 mt-1 p-2 rounded bg-gray-700 border border-gray-600"
              />
            </div>

            <div>
              <label className="text-sm">Speed (ms)</label>
              <input
                type="number"
                value={speed}
                min={MIN_SPEED}
                max={MAX_SPEED}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-24 mt-1 p-2 rounded bg-gray-700 border border-gray-600"
              />
            </div>

            <button
              onClick={handleStart}
              className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Start
            </button>

            <button
              onClick={handlePauseResume}
              disabled={steps.length === 0}
              className={`px-4 py-2 rounded-md ${
                playing ? "bg-yellow-500" : "bg-green-600"
              }`}
            >
              {playing ? "Pause" : "Resume"}
            </button>

            <button
              onClick={handleReset}
              className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* array */}
          <div className="md:col-span-3 bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
            <h2 className="text-lg font-semibold text-indigo-300 mb-2">
              Array Elements : (Each Row in DP corresponds to one element)
            </h2>

            <div className="flex flex-wrap gap-4">
              {arr.map((v, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                    step.i - 1 === i
                      ? "bg-blue-400 text-black"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>

          {/*dp table*/}
          <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-indigo-300 mb-3">
              DP Table (dp[i][sum])
            </h2>

            {step.dp && (
              <div className="overflow-auto">
                <table className="border-collapse text-center">
                  <thead>
                    <tr>
                      <th className="p-2 text-gray-300">i / sum</th>
                      {step.dp[0].map((_, s) => (
                        <th key={s} className="px-3 text-gray-300">
                          {s}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {step.dp.map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-gray-400">i={i}</td>
                        {row.map((_, s) => (
                          <td
                            key={s}
                            className={`w-12 h-12 border border-gray-700 ${getCellColor(
                              i,
                              s
                            )}`}
                          >
                            {step.dp[i][s] ? "T" : "F"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-5 bg-gray-900 p-4 rounded">
              <h3 className="text-teal-300 font-semibold mb-2">Explanation</h3>
              <p className="text-gray-300 text-sm">
                {step.message || "Press Start to begin."}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-teal-300 font-semibold mb-3">Solutions</h3>

            {solutions.length > 0 ? (
              <div className="space-y-2 text-gray-200 text-sm">
                {solutions.map((s, i) => (
                  <div key={i} className="p-2 bg-gray-900 rounded">
                    # <b>Subset:</b> [{s.join(", ")}]
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No solutions found yet.</div>
            )}

            <h3 className="text-indigo-300 font-semibold mt-6 mb-2">Color</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Color color="bg-blue-400" text="Current cell" />
              <Color color="bg-green-500" text="Set TRUE via include" />
              <Color color="bg-green-100" text="Set TRUE via exclude" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
