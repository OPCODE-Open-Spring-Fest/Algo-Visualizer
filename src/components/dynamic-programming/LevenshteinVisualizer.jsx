import React, { useState, useEffect, useRef } from "react";
import { Play, Zap, RotateCcw, Shuffle } from "lucide-react";
import {
  calculateLevenshtein,
  getExplanation,
  backtrackOperations,
  processOperations,
} from "../../algorithms/dynamic-programming/levenshtein";

export default function LevenshteinVisualizer() {
  const [string1, setString1] = useState("horse");
  const [string2, setString2] = useState("ros");
  const [insertCost, setInsertCost] = useState(1);
  const [deleteCost, setDeleteCost] = useState(1);
  const [replaceCost, setReplaceCost] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState(1500);
  const [dpTable, setDpTable] = useState([]);
  const [distance, setDistance] = useState(0);
  const [currentCell, setCurrentCell] = useState({ i: -1, j: -1 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState({ title: "", text: "" });
  const [showExplanation, setShowExplanation] = useState(false);
  const [operations, setOperations] = useState([]);
  const [showOperations, setShowOperations] = useState(false);
  const [path, setPath] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const cancelAnimation = useRef(false);

  const wordPairs = [
    ["kitten", "sitting"],
    ["saturday", "sunday"],
    ["intention", "execution"],
    ["horse", "ros"],
    ["book", "back"],
    ["strong", "string"],
    ["flower", "flow"],
    ["algorithm", "altruistic"],
    ["programming", "playing"],
    ["javascript", "java"],
    ["python", "typhoon"],
    ["react", "create"],
    ["cloud", "could"],
    ["distance", "instance"],
    ["hello", "world"],
    ["morning", "evening"],
    ["computer", "commuter"],
    ["table", "stable"],
    ["night", "light"],
    ["brain", "train"],
  ];

  const animateCalculation = async (s1, s2, dp, costs) => {
    setShowExplanation(true);
    const m = s1.length;
    const n = s2.length;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (cancelAnimation.current) return;
        setCurrentCell({ i, j });
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + costs.delete,
            dp[i][j - 1] + costs.insert,
            dp[i - 1][j - 1] + costs.replace
          );
        }
        setDpTable(dp.map((row) => [...row]));
        const exp = getExplanation(s1, s2, i, j, dp, costs);
        setExplanation(exp);
        await new Promise((resolve) => setTimeout(resolve, animationSpeed));
        if (cancelAnimation.current) return;
        setCurrentCell({ i: -1, j: -1 });
      }
    }
    if (cancelAnimation.current) return;
    setExplanation({
      title: "Calculation Complete!",
      text: `The minimum edit distance is ${dp[m][n]}`,
    });
    const { operations: ops, path: pathCells } = backtrackOperations(
      s1,
      s2,
      dp,
      costs
    );
    setPath(pathCells);
    const processedOps = processOperations(ops, s1);
    setOperations(processedOps);
    setShowOperations(true);
  };

  const handleStartVisualization = async () => {
    if (isAnimating || !string1 || !string2) return;
    setIsAnimating(true);
    setShowOperations(false);
    setPath([]);
    cancelAnimation.current = false;
    const costs = {
      insert: insertCost,
      delete: deleteCost,
      replace: replaceCost,
    };
    const m = string1.length;
    const n = string2.length;
    const dp = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(null));
    for (let i = 0; i <= m; i++) dp[i][0] = i * costs.delete;
    for (let j = 0; j <= n; j++) dp[0][j] = j * costs.insert;
    setDpTable(dp);
    setShowResult(true);
    await animateCalculation(string1, string2, dp, costs);
    if (!cancelAnimation.current) {
      setDistance(dp[string1.length][string2.length]);
    }
    setIsAnimating(false);
  };

  const handleQuickCalculate = () => {
    if (!string1 || !string2) return;
    setShowExplanation(false);
    setShowOperations(false);
    setPath([]);
    const costs = {
      insert: insertCost,
      delete: deleteCost,
      replace: replaceCost,
    };
    const dp = calculateLevenshtein(string1, string2, costs);
    setDpTable(dp);
    setDistance(dp[string1.length][string2.length]);
    setShowResult(true);
    const { operations: ops, path: pathCells } = backtrackOperations(
      string1,
      string2,
      dp,
      costs
    );
    setPath(pathCells);
    const processedOps = processOperations(ops, string1);
    setOperations(processedOps);
    setShowOperations(true);
  };

  const handleReset = () => {
    cancelAnimation.current = true;
    setInsertCost(1);
    setDeleteCost(1);
    setReplaceCost(1);
    setAnimationSpeed(1500);
    setShowResult(false);
    setShowExplanation(false);
    setShowOperations(false);
    setDpTable([]);
    setOperations([]);
    setPath([]);
    setHighlightedCells([]);
    setIsAnimating(false);
    setCurrentCell({ i: -1, j: -1 });
  };

  const handleRandom = () => {
    const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    setString1(randomPair[0]);
    setString2(randomPair[1]);
  };

  const getCellClass = (i, j) => {
    const isHighlighted = highlightedCells.some(
      ([hi, hj]) => hi === i && hj === j
    );
    if (isHighlighted) return "bg-amber-600 scale-110 shadow-lg z-10";
    if (currentCell.i === i && currentCell.j === j)
      return "bg-yellow-400 scale-110 shadow-lg z-10";
    const isInPath = path.some(([pi, pj]) => pi === i && pj === j);
    if (isInPath && i === string1.length && j === string2.length)
      return "bg-green-500 text-white font-bold";
    if (isInPath) return "bg-gray-400 text-gray-900 font-bold";
    if (i === 0 || j === 0) return "bg-purple-600 text-white";
    return "bg-gray-700 text-gray-100";
  };

  return (
    <div className="min-h-screen bg-black md:max-w-9xl ">
      <div className="max-w-xl md:max-w-screen w-fit md:mx-auto bg-gray-800 rounded-2xl shadow-2xl mt-14 md:p-8 p-4 border border-gray-700">
        <h1 className="text-2xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
          Levenshtein Distance Visualizer
        </h1>
        <p className="text-center md:text-xl text-md text-gray-400 mb-6 text-base">
          Dynamic Programming Algorithm Visualization
        </p>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-base font-semibold text-gray-300 mb-2">
              String 1
            </label>
            <input
              type="text"
              value={string1}
              onChange={(e) => setString1(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-gray-100 focus:border-purple-500 focus:outline-none text-lg"
              disabled={isAnimating}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-base font-semibold text-gray-300 mb-2">
                String 2
              </label>
              <input
                type="text"
                value={string2}
                onChange={(e) => setString2(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-gray-100 focus:border-purple-500 focus:outline-none text-lg"
                disabled={isAnimating}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleRandom}
                disabled={isAnimating}
                className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-base h-[52px]"
              >
                <Shuffle size={18} />
                Random
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5 p-5 bg-gray-750 rounded-xl border border-gray-700">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Insert Cost
            </label>
            <input
              type="number"
              value={insertCost}
              onChange={(e) => setInsertCost(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-gray-100 focus:border-purple-500 focus:outline-none"
              min="0"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Delete Cost
            </label>
            <input
              type="number"
              value={deleteCost}
              onChange={(e) => setDeleteCost(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-gray-100 focus:border-purple-500 focus:outline-none"
              min="0"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Replace Cost
            </label>
            <input
              type="number"
              value={replaceCost}
              onChange={(e) => setReplaceCost(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-gray-100 focus:border-purple-500 focus:outline-none"
              min="0"
              max="10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 bg-indigo-900/30 rounded-xl border border-indigo-700/50">
          <label className="text-base font-semibold text-gray-300">
            Animation Speed:
          </label>
          <input
            type="range"
            min="100"
            max="3000"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <span className="text-purple-400 font-semibold min-w-[60px] text-right text-base">
            {(animationSpeed / 1000).toFixed(1)}s
          </span>
        </div>

        <div className="flex md:flex-row flex-col items-center justify-center gap-4 mb-6">
          <button
            onClick={handleStartVisualization}
            disabled={isAnimating || !string1 || !string2}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-base"
          >
            <Play size={18} />
            {isAnimating ? "Animating..." : "Start Visualization"}
          </button>
          <button
            onClick={handleQuickCalculate}
            disabled={isAnimating || !string1 || !string2}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-base"
          >
            <Zap size={18} />
            Quick Calculate
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2 text-base"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        {showResult && (
          <>
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl text-center border border-purple-700/50">
              <p className="text-xl text-gray-300 mb-2">Edit Distance</p>
              <p className="text-5xl font-bold text-purple-400">{distance}</p>
            </div>

            <div className="flex md:flex-row items-center flex-col justify-center md:items-start mb-6 gap-6">
              <div
                className="overflow-x-auto max-w-full"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#a78bfa #4b5563",
                }}
              >
                <div className="inline-block min-w-max mx-auto">
                  <table className="border-collapse">
                    <thead>
                      <tr>
                        <th className="border-2 border-gray-600 p-3 bg-gray-750"></th>
                        <th className="border-2 border-gray-600 p-3 bg-gray-750 font-bold text-gray-300">
                          ε
                        </th>
                        {string2.split("").map((char, idx) => (
                          <th
                            key={idx}
                            className="border-2 border-gray-600 p-3 bg-gray-750 font-bold text-gray-300 text-lg"
                          >
                            {char}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dpTable.map((row, i) => (
                        <tr key={i}>
                          <td className="border-2 border-gray-600 p-3 bg-gray-750 font-bold text-gray-300 text-lg">
                            {i === 0 ? "ε" : string1[i - 1]}
                          </td>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={`border-2 border-gray-600 p-4 text-center font-semibold transition-all duration-300 min-w-[60px] h-[60px] text-lg ${getCellClass(
                                i,
                                j
                              )}`}
                            >
                              {cell ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex-1 min-w-[200px] max-w-[400px]">
                {showExplanation && (
                  <div className="bg-amber-900/30 border-1 border-amber-500 p-4 rounded-lg mb-4">
                    <div className="font-bold text-amber-300 mb-2 text-base">
                      {explanation.title}
                    </div>
                    <div className="text-amber-200 whitespace-pre-line text-sm leading-relaxed">
                      {explanation.text}
                    </div>
                  </div>
                )}

                {showOperations && (
                  <div
                    className="bg-blue-900/30 rounded-xl max-h-[700px] p-4 overflow-y-auto"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#a78bfa transparent",
                    }}
                  >
                    <h3 className="text-xl font-bold text-gray-200 mb-3">
                      The Levenshtein distance is {distance}:
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Hover over each operation to see the cells involved
                    </p>
                    <ul className="space-y-1">
                      {operations.map((op, idx) => (
                        <li
                          key={idx}
                          onMouseEnter={() =>
                            setHighlightedCells(op.cells || [])
                          }
                          onMouseLeave={() => setHighlightedCells([])}
                          className={`p-3 rounded-lg cursor-pointer transition-all border-l-4 border-transparent hover:bg-blue-800/40 hover:border-purple-500 ${
                            op.isSkip
                              ? "text-gray-500"
                              : op.isFinal
                              ? "text-green-400 font-bold"
                              : "text-gray-300"
                          } text-base`}
                        >
                          • {op.displayText}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-700/30">
              <h3 className="text-lg font-bold text-gray-200 mb-4">
                How it works:
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-purple-600 rounded"></div>
                  <span className="text-gray-300">
                    Purple cells: Base cases (initialization)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-yellow-400 rounded"></div>
                  <span className="text-gray-300">
                    Yellow cell: Currently calculating
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  <span className="text-gray-300">
                    Gray cells: Optimal path (↓ = delete, → = insert, ↘ =
                    replace/skip)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-amber-600 rounded"></div>
                  <span className="text-gray-300">
                    Orange cells: Highlighted on hover (shows operation cells)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded"></div>
                  <span className="text-gray-300">
                    Green cell: Final result
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
