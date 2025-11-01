import React, { useState, useEffect, useRef } from "react";
import { nQueensVisualizerSteps } from "../../algorithms/Recursion/NQueens";

const DEFAULT_N = 5;
const MIN_N = 4;
const MAX_N = 10;
const DEFAULT_SPEED = 500;

function Chessboard({ board, step, N }) {
  if (
    !board ||
    board.length !== N ||
    board.some((row) => !row || row.length !== N)
  ) {
    return (
      <div className="text-red-400 text-center p-10">
        Loading chessboard...
      </div>
    );
  }
  const BOARD_SIZE = 440;
  const cellSize = BOARD_SIZE / N;

  return (
    <div
      className="grid mx-auto border-[6px] border-gray-700 rounded-xl shadow-lg overflow-hidden bg-gray-800"
      style={{
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        gridTemplateRows: `repeat(${N}, ${cellSize}px)`,
        gridTemplateColumns: `repeat(${N}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: N }).map((_, row) =>
        Array.from({ length: N }).map((_, col) => {
          const cell = board[row][col];
          const isQueen = cell === 1;

          let color = (row + col) % 2 === 0 ? "bg-gray-100" : "bg-gray-400";

          if (step) {
            if (step.type === "try" && step.row === row && step.col === col)
              color = "bg-blue-300";
            else if (step.type === "check" && step.row === row && step.col === col)
              color = step.safe === false ? "bg-yellow-300" : "bg-green-300";
            else if (step.type === "place" && step.row === row && step.col === col)
              color = "bg-green-500";
            else if (step.type === "remove" && step.row === row && step.col === col)
              color = "bg-gray-500";
            else if (step.type === "solution" && board[row][col] === 1)
              color = "bg-lime-400";
          }

          return (
            <div
              key={`${row}-${col}`}
              className={`flex items-center justify-center border border-gray-600 ${color}`}
            >
              {isQueen && (
                <span
                  className="text-gray-800"
                  style={{ fontSize: `${cellSize * 0.7}px` }}
                >
                  ♛
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function StackTrace({ stack }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-3 shadow-sm w-100">
      <h3 className="text-indigo-400 font-semibold text-lg mb-2">
        Recursion Stack
      </h3>
      {stack.length === 0 ? (
        <div className="text-gray-400 text-sm italic">Stack empty</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {stack.map((pos, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
            >
              Row-{pos.row}, Col-{pos.col}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Legend({ color, text, symbol }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div
        className={`w-5 h-5 rounded border border-gray-600 flex items-center justify-center ${color}`}
      >
        {symbol}
      </div>
      <span className="text-gray-300 text-sm">{text}</span>
    </div>
  );
}

export default function NQueensVisualizer() {
  const [N, setN] = useState(DEFAULT_N);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [solutionCount, setSolutionCount] = useState(0);
  const [solvable, setSolvable] = useState(null);
  const timerRef = useRef(null);

  const runSolver = () => {
    const result = nQueensVisualizerSteps(N);
    setSteps(result.steps);
    setSolutionCount(result.solutionCount);
    setSolvable(result.solvable);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    setSteps([]);
    setCurrentStepIdx(0);
    setSolvable(null);
    setSolutionCount(0);
    runSolver();
  }, [N]);

  useEffect(() => {
    if (isPlaying && currentStepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStepIdx((idx) => idx + 1);
      }, speed);
    } else {
      clearTimeout(timerRef.current);
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIdx, steps, speed]);

  const step = steps[currentStepIdx] || {};
  const board = step.board || Array.from({ length: N }, () => Array(N).fill(0));

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-400">
          ♛ N-Queens Visualizer
        </h1>

        {/* Controls */}
        <div className="flex flex-wrap gap-6 mb-10 p-6 rounded-lg bg-gray-800 border border-gray-700 justify-center items-center">
          <div>
            <label className="text-gray-300 text-sm">Board Size (N):</label>
            <input
              type="number"
              min={MIN_N}
              max={MAX_N}
              value={N}
              onChange={(e) =>
                setN(Math.max(MIN_N, Math.min(MAX_N, Number(e.target.value))))
              }
              className="w-20 mt-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Speed (ms):</label>
            <input
              type="number"
              min={100}
              max={2000}
              value={speed}
              onChange={(e) =>
                setSpeed(Math.max(100, Math.min(2000, Number(e.target.value))))
              }
              className="w-20 mt-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />
          </div>

          <button
            onClick={runSolver}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-md"
          >
            Start
          </button>
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`px-5 py-2 rounded-md font-medium ${
              isPlaying ? "bg-red-600" : "bg-green-600"
            } text-white`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setCurrentStepIdx((idx) => Math.max(0, idx - 1))}
            disabled={currentStepIdx === 0}
            className={`px-4 py-2 rounded-md font-medium ${
              currentStepIdx > 0
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            Prev
          </button>
          <button
            onClick={() =>
              setCurrentStepIdx((idx) => Math.min(steps.length - 1, idx + 1))
            }
            disabled={currentStepIdx === steps.length - 1}
            className={`px-4 py-2 rounded-md font-medium ${
              currentStepIdx < steps.length - 1
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            Next
          </button>
        </div>

        {/* Main Layout*/}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/*Chessboard*/}
          <div className="flex flex-col items-center ml-16">
            <Chessboard board={board} step={step} N={N} />
            <div className="mt-4 text-center text-gray-300 text-sm">
              Step {currentStepIdx + 1}/{steps.length} • Solutions Found:{" "}
              <b className="text-green-400">{solutionCount}</b>
              {solvable === false && (
                <p className="text-red-400 font-medium mt-1">
                  No solution for N={N}
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-5 ml-26">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-100">
              <h3 className="text-indigo-400 font-semibold mb-2 text-lg">
                Step Explanation
              </h3>
              <p className="text-gray-200 text-base leading-relaxed">
                {step.message || "Start solving N-Queens..."}
              </p>
            </div>

            <StackTrace stack={step.stack || []} />

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm w-100">
              <h3 className="text-indigo-400 font-semibold mb-3 text-lg">
                Color Meanings
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Legend color="bg-blue-300" text="Trying this cell" />
                <Legend color="bg-yellow-300" text="Unsafe position" />
                <Legend color="bg-green-300" text="Safe position" />
                <Legend color="bg-green-500" text="Queen placed" symbol="♛" />
                <Legend color="bg-gray-500" text="Queen removed (backtrack)" />
                <Legend color="bg-lime-400" text="Final solution cell" symbol="♛" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
