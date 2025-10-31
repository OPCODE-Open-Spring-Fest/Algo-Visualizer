import React, { useState, useEffect, useRef } from "react";
import { mazeSolverSteps } from "../../algorithms/Recursion/mazeSolver";

const CELL = {EMPTY: 0, WALL: 1, START: 2, END: 3};
const defaultSize = 10;

function makeGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(CELL.EMPTY));
}
function randomMaze(rows, cols, wallProbability = 0.3) {
  const grid = makeGrid(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.random() < wallProbability) grid[i][j] = CELL.WALL;
    }
  }
  return grid;
}
function getCellClass(cell, row, col, state) {
  if (cell === CELL.START)
    return "bg-yellow-400 text-black font-bold border border-yellow-600";
  if (cell === CELL.END)
    return "bg-yellow-400 text-black font-bold border border-yellow-600";
  if (cell === CELL.WALL)
    return "bg-black border border-gray-700";

  if (state.type === "path_cell" && state.path?.some(([r, c]) => r === row && c === col))
    return "bg-green-500 border border-green-700 animate-pulse";

  if (state.row === row && state.col === col) {
    if (state.type === "explore")
      return "bg-blue-500 border border-blue-700 animate-pulse";
    if (state.type === "dead_end")
      return "bg-red-600 border border-red-800";
    if (state.type === "backtrack")
      return "bg-red-800 border border-red-900 animate-pulse"; 
    if (state.type === "found")
      return "bg-green-600 border border-green-800 animate-pulse"; 
  }

  if (state.backtracked?.[row]?.[col])
    return "bg-red-800 border border-red-900";

  if (state.visited?.[row]?.[col])
    return "bg-blue-900 border border-blue-700";

  return "bg-gray-300 border border-gray-400";
}

export default function MazeSolverVisualizer() {
  const [rows, setRows] = useState(defaultSize);
  const [cols, setCols] = useState(defaultSize);
  const [grid, setGrid] = useState(makeGrid(defaultSize, defaultSize));
  const [start, setStart] = useState([0, 0]);
  const [end, setEnd] = useState([defaultSize - 1, defaultSize - 1]);
  const [allowDiagonal, setAllowDiagonal] = useState(false);
  const [speed, setSpeed] = useState(250);

  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [solutionFound, setSolutionFound] = useState(null);
  const [mode, setMode] = useState("manual");

  const timerRef = useRef(null);

  //handle grid cell click
  function handleCellClick(r, c) {
    if (running) return;
    if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) return;

    setGrid(g =>
      g.map((rowArr, i) =>
        rowArr.map((cell, j) =>
          i === r && j === c ? (cell === CELL.WALL ? CELL.EMPTY : CELL.WALL) : cell
        )
      )
    );
  }

  //handle right click
  function handleCellRightClick(r, c, e) {
    e.preventDefault();
    if (running) return;

    if (r === end[0] && c === end[1]) return;
    if (r === start[0] && c === start[1]) return;

    setGrid(g =>
      g.map((rowArr, i) =>
        rowArr.map((cell, j) => {
          if (i === start[0] && j === start[1]) return CELL.EMPTY;
          if (i === end[0] && j === end[1]) return CELL.EMPTY;
          if (i === r && j === c) {
            if (!start || (start[0] !== r || start[1] !== c)) {
              setStart([r, c]);
              return CELL.START;
            } else {
              setEnd([r, c]);
              return CELL.END;
            }
          }
          return cell;
        })
      )
    );
  }

  //Change grid size
  function handleGridSizeChange(size) {
    const newGrid = mode === "random" ? randomMaze(size, size) : makeGrid(size, size);
    setRows(size);
    setCols(size);
    setGrid(newGrid);
    setStart([0, 0]);
    setEnd([size - 1, size - 1]);
    resetState();
  }

  //random maze
  function generateRandomMaze() {
    const newGrid = randomMaze(rows, cols, 0.3);
    newGrid[start[0]][start[1]] = CELL.START;
    newGrid[end[0]][end[1]] = CELL.END;
    setGrid(newGrid);
    setMode("random");
  }

  // Manual maze
  function createManualGrid() {
    const newGrid = makeGrid(rows, cols);
    newGrid[start[0]][start[1]] = CELL.START;
    newGrid[end[0]][end[1]] = CELL.END;
    setGrid(newGrid);
    setMode("manual");
  }
  // Start
  function startVisualization() {
    if (running) return;
    const g = grid.map(row => [...row]);
    g[start[0]][start[1]] = CELL.START;
    g[end[0]][end[1]] = CELL.END;

    const result = mazeSolverSteps(g, start, end, allowDiagonal);
    setSteps(result.steps);
    setStepIdx(0);
    setRunning(true);
    setSolutionFound(result.solutionFound);
  }
  //Animation
  useEffect(() => {
    if (running && steps.length > 0 && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setStepIdx(idx => idx + 1);
      }, speed);
    } else {
      clearTimeout(timerRef.current);
      setRunning(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [running, stepIdx, steps, speed]);

  function handlePauseResume() {
    if (!steps.length) return;
    setRunning(r => !r);
  }

  function resetState() {
    clearTimeout(timerRef.current);
    setSteps([]);
    setStepIdx(0);
    setRunning(false);
    setSolutionFound(null);
  }

  function handleReset() {
    setGrid(makeGrid(rows, cols));
    setStart([0, 0]);
    setEnd([rows - 1, cols - 1]);
    resetState();
  }

  const currentStep = steps[stepIdx] || {};

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-indigo-400 text-center">
          🌀 Maze Solver Visualizer
        </h1>
        {/* Controls */}
<div className="flex flex-col gap-4 mb-8 p-6 rounded-xl border border-gray-700 shadow-lg">
  <div className="flex flex-wrap gap-4 justify-center items-center">
    <button
      onClick={createManualGrid}
      className={`px-4 py-2 rounded-md font-semibold transition ${mode === "manual" ? "bg-indigo-600" : "bg-gray-700 hover:bg-gray-600"}`}
    >
      Manual Grid
    </button>
    <button
      onClick={generateRandomMaze}
      className={`px-4 py-2 rounded-md font-semibold transition ${mode === "random" ? "bg-indigo-600" : "bg-gray-700 hover:bg-gray-600"}`}
    >
      Random Maze
    </button>

    <div className="flex items-center gap-2">
      <label>Grid Size:</label>
      <input
        type="number"
        min="5"
        max="20"
        value={rows}
        onChange={e => handleGridSizeChange(Number(e.target.value))}
        className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-16"
      />
    </div>

    <div className="flex items-center gap-2">
      <label>Speed:</label>
      <input
        type="range"
        min="100"
        max="1000"
        value={speed}
        onChange={e => setSpeed(Number(e.target.value))}
        className="accent-indigo-500"
      />
      <span>{speed}ms</span>
    </div>

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={allowDiagonal}
        onChange={() => setAllowDiagonal(d => !d)}
        className="accent-indigo-500"
      />
      Allow Diagonal
    </label>
  </div>

  <div className="flex flex-wrap gap-4 justify-center items-center">
    <button
      onClick={startVisualization}
      disabled={running}
      className="px-5 py-2 bg-green-600 rounded-md hover:bg-green-500 transition font-semibold"
    >
      Start
    </button>
    <button
      onClick={handlePauseResume}
      disabled={!steps.length}
      className="px-5 py-2 bg-yellow-500 rounded-md hover:bg-yellow-400 transition font-semibold"
    >
      {running ? "Pause" : "Resume"}
    </button>
    <button
      onClick={handleReset}
      className="px-5 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition font-semibold"
    >
      Reset
    </button>
  </div>
</div>
{/* Visualization*/}
<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
  <div className="flex justify-center rounded-4xl">
    <div
      className="grid"
      style={{
        gridTemplateRows: `repeat(${rows}, 44px)`,
        gridTemplateColumns: `repeat(${cols}, 44px)`,
        gap: "2px",
      }}
    >
      {grid.map((rowArr, i) =>
        rowArr.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded ${getCellClass(cell, i, j, currentStep)}`}
            onClick={() => handleCellClick(i, j)}
            onContextMenu={e => handleCellRightClick(i, j, e)}
          >
            {cell === CELL.START && "S"}
            {cell === CELL.END && "E"}
          </div>
        ))
      )}
    </div>
  </div>

  <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 text-sm text-gray-300">
    {steps.length > 0 ? (
      <>
       <h2 className="text-indigo-400 font-bold mb-2 text-xl"># STEPS :</h2>
        <p className="text-indigo-300 mb-1 text-lg">
          Step {stepIdx + 1} / {steps.length}
        </p>
        <p className="text-gray-100 mb-3">{currentStep.message}</p>

        {solutionFound === false && stepIdx === steps.length - 1 && (
          <div className="mt-2 text-red-400 font-bold text-center text-lg">
             No Path Found Between Start and End!
          </div>
        )}
      </>
    ) : (
      <div className="text-gray-400 italic text-center">
         Start the visualization to see step-by-step progress here.
      </div>
    )}
    <div className="bg-gray-800 mt-10 p-5 rounded-lg border border-gray-700 text-sm text-gray-300">
    <h2 className="text-indigo-400 font-bold text-xl mb-2"># Instructions</h2>
    <ul className="list-disc ml-6 space-y-1">
      <li>Left-click on a cell to toggle a wall (black cell).</li>
      <li>Right-click on a cell to move the Start (S) or End (E) point.</li>
    </ul>
<br/>
    <h2 className="text-indigo-400 font-bold text-xl"># Meaning of cell colors</h2>
    <div className="flex flex-wrap gap-4 mt-2 text-sm">
      <Legend color="bg-yellow-400 border-yellow-600" text="Start / End Point" />
      <Legend color="bg-gray-900 border-gray-700" text="Wall" />
      <Legend color="bg-blue-500 border-blue-700" text="Currently Exploring" />
      <Legend color="bg-green-400 border-green-700" text="Solution Path" />
      <Legend color="bg-red-700 border-red-900" text="Dead End" />
      <Legend color="bg-red-900 border-red-600" text="Backtracked Cell" />
      <Legend color="bg-blue-900 border-blue-700" text="Visited Cell" />
    </div>
  </div>
  </div>
</div>
      </div>
    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded border-2 ${color}`}></div>
      <span className="text-gray-300">{text}</span>
    </div>
  );
}
