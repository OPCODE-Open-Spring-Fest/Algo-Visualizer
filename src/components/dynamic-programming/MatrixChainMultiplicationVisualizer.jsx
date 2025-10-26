import React, { useEffect, useMemo, useRef, useState } from "react";
import { matrixChainMultiplicationSteps, buildParenthesization } from "../../algorithms/dynamic-programming/matrixChainMultiplication";
import { Play, RotateCcw, Info, Pause, Shuffle } from "lucide-react";

const cls = (...arr) => arr.filter(Boolean).join(" ");

export default function MatrixChainMultiplicationVisualizer() {
  const [dimsInput, setDimsInput] = useState("10, 30, 5, 60");
  const [speed, setSpeed] = useState(600); // ms per step
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [running, setRunning] = useState(false);

  // DP tables (1-indexed for n)
  const [n, setN] = useState(0);
  const [m, setM] = useState([]);
  const [s, setS] = useState([]);

  // Active markers
  const [activeCell, setActiveCell] = useState(null); // {i,j}
  const [activeK, setActiveK] = useState(null);
  const [explain, setExplain] = useState("");
  const [trace, setTrace] = useState([]); // [{k,left,right,multCost,cost,isBest}]
  const [final, setFinal] = useState(null); // {minCost, parenthesization}

  const timerRef = useRef(null);

  const parsedDims = useMemo(() => {
    try {
      const arr = dimsInput
        .split(/[,\s]+/)
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => Number(x));
      if (!arr.length || arr.some((v) => !Number.isFinite(v) || v <= 0)) return null;
      return arr;
    } catch {
      return null;
    }
  }, [dimsInput]);

  const canStart = parsedDims && parsedDims.length >= 3; // at least 2 matrices

  const resetAll = () => {
    setSteps([]);
    setStepIdx(-1);
    setRunning(false);
    clearInterval(timerRef.current);
    setN(0);
    setM([]);
    setS([]);
    setActiveCell(null);
    setActiveK(null);
    setExplain("");
    setTrace([]);
    setFinal(null);
  };

  const initTables = (nVal) => {
    const mm = Array.from({ length: nVal + 1 }, () => Array(nVal + 1).fill(Infinity));
    const ss = Array.from({ length: nVal + 1 }, () => Array(nVal + 1).fill(0));
    for (let i = 1; i <= nVal; i++) mm[i][i] = 0;
    setM(mm);
    setS(ss);
  };

  const start = () => {
    if (!canStart) return;
    resetAll();

    const { steps: stps, n: nVal } = matrixChainMultiplicationSteps(parsedDims);
    setSteps(stps);
    setN(nVal);
    initTables(nVal);
    setExplain("Starting visualization...");
    setStepIdx(0);
    setRunning(true);
  };

  // apply a single step to tables/state (mutative on copies for React)
  const applyStep = (step) => {
    if (!step) return;

    setExplain(step.explain || "");

    if (step.type === "base") {
      setM((prev) => {
        const next = prev.map((row) => row.slice());
        next[step.i][step.j] = 0;
        return next;
      });
    }

    if (step.type === "chain-start") {
      // purely informational
    }

    if (step.type === "select-cell") {
      setActiveCell({ i: step.i, j: step.j });
      setActiveK(null);
      setTrace([]);
    }

    if (step.type === "try-k") {
      setActiveK(step.k);
      setTrace((prev) => [
        ...prev,
        {
          k: step.k,
          left: step.left,
          right: step.right,
          multCost: step.multCost,
          cost: step.cost,
          isBest: false,
        },
      ]);
    }

    if (step.type === "update-best") {
      setTrace((prev) =>
        prev.map((t) => (t.k === step.k ? { ...t, isBest: true } : t))
      );
      // don't write to m yet; we commit on commit-cell to visualize separation
    }

    if (step.type === "commit-cell") {
      setM((prev) => {
        const next = prev.map((row) => row.slice());
        next[step.i][step.j] = step.best;
        return next;
      });
      setS((prev) => {
        const next = prev.map((row) => row.slice());
        next[step.i][step.j] = step.bestK;
        return next;
      });
    }

    if (step.type === "done") {
      // compute final parenthesization from s
      setFinal((prev) => {
        try {
          const parenth = buildParenthesization(
            s.length ? s : Array.from({ length: n + 1 }, () => Array(n + 1).fill(0)),
            1,
            n
          );
          return { minCost: step.minCost, parenthesization: parenth };
        } catch {
          return { minCost: step.minCost, parenthesization: "" };
        }
      });
      setActiveCell({ i: 1, j: n });
      setActiveK(null);
    }
  };

  // drive animation
  useEffect(() => {
    if (!running) {
      clearInterval(timerRef.current);
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setStepIdx((idx) => {
        const nextIdx = idx + 1;
        if (nextIdx >= steps.length) {
          clearInterval(timerRef.current);
          setRunning(false);
          return idx;
        }
        return nextIdx;
      });
    }, Math.max(60, speed));
    return () => clearInterval(timerRef.current);
  }, [running, speed, steps.length]);

  // apply step side-effect when stepIdx changes
  useEffect(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      applyStep(steps[stepIdx]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx]);

  const onReset = () => resetAll();

  // Sample dimension sets (p0, p1, ..., pn)
  const samples = [
    [10, 30, 5, 60],
    [30, 35, 15, 5, 10, 20, 25],
    [5, 10, 3, 12, 5, 50, 6],
    [40, 20, 30, 10, 30],
    [5, 4, 6, 2, 7],
  ];

  const handleRandomDims = () => {
    const pick = samples[Math.floor(Math.random() * samples.length)];
    setDimsInput(pick.join(", "));
  };

  // table cell styles
  const cellStyle = (i, j) => {
    if (j < i) return "bg-gray-900 text-gray-600";
    const isBase = i === j;
    const isCurrent = activeCell && activeCell.i === i && activeCell.j === j;
    const isFinal = final && i === 1 && j === n;

    return cls(
      "border border-gray-700 text-center p-2 text-sm min-w-[56px] font-mono",
      isCurrent && "bg-yellow-900/40 border-yellow-500 shadow-lg",
      isBase && "bg-green-900/30",
      !isBase && m[i] && Number.isFinite(m[i][j]) && "bg-blue-900/30",
      isFinal && "ring-2 ring-purple-400"
    );
  };

  const kCellStyle = (i, j) => {
    if (j < i) return "bg-gray-900 text-gray-600";
    const isCurrent = activeCell && activeCell.i === i && activeCell.j === j;
    const isFinal = final && i === 1 && j === n;
    return cls(
      "border border-gray-700 text-center p-2 text-sm min-w-[56px] font-mono",
      isCurrent && "bg-yellow-900/40 border-yellow-500 shadow-lg",
      s[i] && s[i][j] !== 0 && "bg-blue-900/30",
      i === j && "bg-green-900/30",
      isFinal && "ring-2 ring-purple-400"
    );
  };

  const renderTable = (table, isK = false) => {
    if (!n) return null;
    return (
      <div className="overflow-auto">
        <div
          className="inline-grid"
          style={{
            gridTemplateColumns: `repeat(${n}, minmax(56px, 1fr))`,
          }}
        >
          {Array.from({ length: n }).map((_, i0) =>
            Array.from({ length: n }).map((_, j0) => {
              const i = i0 + 1;
              const j = j0 + 1;
              const style = isK ? kCellStyle(i, j) : cellStyle(i, j);
              const val =
                j < i
                  ? "—"
                  : i === j
                  ? (isK ? "" : 0)
                  : table[i] && Number.isFinite(table[i][j])
                  ? table[i][j]
                  : "";
              return (
                <div key={`${isK ? "k" : "m"}-${i}-${j}`} className={style}>
                  {val === Infinity ? "∞" : val}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black md:max-w-9xl">
      <div className="max-w-6xl md:mx-auto bg-gray-800 rounded-2xl shadow-2xl mt-14 md:p-8 p-4 border border-gray-700">
        <h1 className="text-2xl md:text-4xl font-bold text-center bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
          Matrix Chain Multiplication Visualizer
        </h1>
        <p className="text-center md:text-lg text-sm text-gray-400 mb-6">
          Dynamic Programming Algorithm Visualization
        </p>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-gray-300">
              Matrix dimensions (comma-separated), p0, p1, ..., pn
            </label>
            <div className="flex gap-2">
              <input
                value={dimsInput}
                onChange={(e) => setDimsInput(e.target.value)}
                placeholder="e.g., 10, 30, 5, 60"
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-gray-100 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={handleRandomDims}
                className="px-4 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Random
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              For matrices A1..An where Ai is p[i-1] × p[i].
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <label className="block text-sm mb-1 text-gray-300">
              Animation Speed
            </label>
            <div className="flex items-center gap-3 p-3 bg-indigo-900/30 rounded-lg border border-indigo-700/50">
              <input
                type="range"
                min={100}
                max={1500}
                step={50}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <span className="text-purple-400 font-semibold min-w-[60px] text-right">
                {speed} ms
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={running ? () => setRunning(false) : start}
            disabled={!canStart}
            className={cls(
              "px-6 py-3 bg-linear-to-r text-white rounded-lg font-semibold transition-all flex items-center gap-2",
              canStart
                ? running
                  ? "from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
                  : "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                : "from-gray-600 to-gray-700 cursor-not-allowed opacity-70"
            )}
            title={running ? "Pause" : "Start Visualization"}
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? "Pause" : "Start Visualization"}
          </button>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Formula */}
        <div className="text-xs md:text-sm text-gray-300 flex items-center gap-2 mb-6 p-3 rounded-lg bg-[#0b1220] border border-gray-800">
          <Info className="w-4 h-4 text-indigo-400" />
          State transition: m[i][j] = min over k∈[i..j-1] of m[i][k] + m[k+1][j] + p[i-1]×p[k]×p[j]
        </div>

        {/* Layout: tables and panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0b1220] border border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-300 mb-2">DP Cost Table m[i][j]</div>
              {renderTable(m, false)}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-yellow-900/40 border border-yellow-500">Current</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700">Computed</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700">Base case</span>
                <span className="px-2 py-1 rounded bg-gray-900 border border-gray-700">Unused</span>
                <span className="px-2 py-1 rounded ring-2 ring-purple-400">Final Answer</span>
              </div>
            </div>

            <div className="bg-[#0b1220] border border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-300 mb-2">Split Table s[i][j] (optimal k)</div>
              {renderTable(s, true)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-900/30 border border-amber-700/40 rounded-xl p-4">
              <div className="text-sm font-semibold text-amber-300 mb-2">Explanation</div>
              <div className="text-sm text-amber-100 min-h-12">{explain}</div>
            </div>

            <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-4">
              <div className="text-sm font-semibold text-indigo-300 mb-2">
                Subproblem Trace {activeCell ? `(m[${activeCell.i}][${activeCell.j}])` : ""}
              </div>
              <div className="space-y-1">
                {trace.length === 0 && (
                  <div className="text-sm text-gray-400">Waiting for computation...</div>
                )}
                {trace.map((t) => (
                  <div
                    key={`k-${t.k}`}
                    className={cls(
                      "text-sm p-2 rounded border",
                      t.isBest ? "bg-green-900/30 border-green-700 text-green-200" : "bg-[#0e1628] border-gray-800 text-gray-200"
                    )}
                  >
                    k={t.k}: left={t.left}, right={t.right}, mult={t.multCost}, total={t.cost}
                    {t.isBest ? "  ← best so far" : ""}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0b1220] border border-gray-800 rounded-xl p-4">
              <div className="text-sm font-semibold text-indigo-300 mb-2">Result</div>
              {final ? (
                <>
                  <div className="text-sm text-gray-300">
                    Minimum multiplications: <span className="font-semibold text-purple-300">{final.minCost}</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    Parenthesization: <span className="font-mono">{final.parenthesization}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">Run the visualization to see the result.</div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-700/30 mt-6">
          <h3 className="text-lg font-bold text-gray-200 mb-4">
            How it works:
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-900/60 rounded border border-green-700"></div>
              <span className="text-gray-300">Green cells: Base cases (m[i][i] = 0)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-yellow-900/60 rounded border border-yellow-500"></div>
              <span className="text-gray-300">Yellow cell: Currently computing m[i][j]</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-900/60 rounded border border-blue-700"></div>
              <span className="text-gray-300">Blue cells: Computed subproblems</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-900 rounded border border-gray-700"></div>
              <span className="text-gray-300">Gray cells: Unused (below diagonal)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 ring-2 ring-purple-400 rounded"></div>
              <span className="text-gray-300">Purple ring: Final answer at m[1][n]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
