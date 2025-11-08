import React, { useState } from "react";
import { floodFill } from "@/algorithms/Recursion/FloodFill";
export default function FloodFillVisualizer() {
  const rows = 20;
  const cols = 20;

  const generateGrid = () => {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(Math.random() > 0.3 ? 1 : 0);
      }
      grid.push(row);
    }
    return grid;
  };

  const [grid, setGrid] = useState(generateGrid());
  const [speed, setSpeed] = useState(200);
  const [isRunning, setIsRunning] = useState(false);

  const source = { x: 0, y: 0 };

  const startFloodFill = () => {
    if (isRunning) return;

    const mat = grid.map((row) => [...row]);
    const steps = [];
    floodFill(grid.map((row) => [...row]), source.x, source.y, 1, 2, steps);

    animateFill(steps);
  };

  const animateFill = (steps) => {
    let i = 0;
    setIsRunning(true);

    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }

      const { x, y } = steps[i];
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        newGrid[x][y] = 2;
        return newGrid;
      });

      i++;
    }, speed);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Recursive Flood Fill Visualization</h2>
      <div style={{ margin: "20px 0" }}>
        <label style={{ fontWeight: "bold" }}>Speed: </label>
        <input
          type="range"
          min="50"
          max="800"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          style={{ width: "300px" }}
        />
        <div>{speed} ms per step</div>
      </div>
      <div
        style={{
          display: "inline-grid",
          gridTemplateColumns: `repeat(${cols}, 25px)`,
          gap: "2px",
          marginTop: "20px",
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            let color = "#dfe6e9";

            if (r === source.x && c === source.y) {
              color = "#ff7675";
            } else if (cell === 2) {
              color = "#3498db";
            } else if (cell === 1) {
              color = "#b2bec3";
            }

            return (
              <div
                key={`${r}-${c}`}
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  backgroundColor: color,
                  transition: "background-color 0.25s",
                }}
              />
            );
          })
        )}
      </div>
      <div style={{ marginTop: "30px" }}>
        <button
          disabled={isRunning}
          onClick={startFloodFill}
          style={{
            padding: "10px 20px",
            background: isRunning ? "#b2bec3" : "#0984e3",
            color: "white",
            border: "none",
            cursor: isRunning ? "not-allowed" : "pointer",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Start Flood Fill
        </button>

        <button
          disabled={isRunning}
          onClick={() => setGrid(generateGrid())}
          style={{
            padding: "10px 20px",
            background: "#6c5ce7",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Reset Grid
        </button>
      </div>
    </div>
  );
}
