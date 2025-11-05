// src/components/Recursion/SudokuVisualizer.jsx
import React, { useState } from "react";
import { solveSudoku } from "../../algorithms/Recursion/sudokuSolver";

export default function SudokuVisualizer() {
  const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  const [grid, setGrid] = useState(initialBoard);
  const [cellStatus, setCellStatus] = useState({});
  const [solving, setSolving] = useState(false);

  const visualizeStep = (r, c, val, status) => {
    setGrid((prev) => {
      const copy = prev.map((row) => row.slice());
      copy[r][c] = val;
      return copy;
    });

    setCellStatus((prev) => ({
      ...prev,
      [`${r}-${c}`]: status,
    }));
  };

  const handleSolve = async () => {
    setSolving(true);
    const copy = grid.map((row) => row.slice());
    await solveSudoku(copy, visualizeStep);
    setSolving(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Sudoku Solver Visualizer </h2>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(9, 40px)",
          gridTemplateRows: "repeat(9, 40px)",
          gap: "2px",
        }}
      >
        {grid.map((row, r) =>
          row.map((val, c) => {
            const status = cellStatus[`${r}-${c}`];
            let bg = "bg-gray-800";

            if (status === "filled") bg = "bg-green-500";
            else if (status === "trying") bg = "bg-yellow-400";
            else if (status === "backtrack") bg = "bg-red-500";

            return (
              <div
                key={`${r}-${c}`}
                className={`w-10 h-10 flex justify-center items-center text-white text-lg font-medium border border-gray-600 ${bg}`}
              >
                {val !== 0 ? val : ""}
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={handleSolve}
        disabled={solving}
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
      >
        {solving ? "Solving..." : "Start Visualization"}
      </button>
    </div>
  );
}
