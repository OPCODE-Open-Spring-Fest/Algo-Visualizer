import React, { useState, useEffect, useRef, useCallback } from "react";
import { towerOfHanoiVisualizerSteps } from "../../algorithms/Recursion/towerOfHanoi";

const DEFAULT_N = 3;
const MIN_N = 2;
const MAX_N = 6;
const DEFAULT_SPEED = 700;

function Rods({ rods }) {
    const rodNames = ["A", "B", "C"];

    return (
        <div className="flex justify-center gap-16 mt-10">
            {rodNames.map((rod) => (
                <div key={rod} className="flex flex-col items-center">
                    <div className="h-60 w-2 bg-gray-600 relative mb-2 rounded"></div>
                    <div className="w-32 h-2 bg-gray-700 mb-1 rounded"></div>
                    <div className="flex flex-col-reverse items-center justify-end h-48 w-32">
                        {rods[rod].map((disk, i) => (
                            <div
                                key={i}
                                className="h-5 rounded text-center font-semibold shadow-sm text-gray-900"
                                style={{
                                    width: `${20 + disk * 15}px`,
                                    backgroundColor: `hsl(${disk * 60}, 70%, 55%)`,
                                }}
                            >
                                {disk}
                            </div>
                        ))}
                    </div>
                    <span className="text-gray-300 font-semibold mt-2">{rod}</span>
                </div>
            ))}
        </div>
    );
}

function Legend({ color, text }) {
    return (
        <div className="flex items-center gap-2 mb-1">
            <div
                className="w-5 h-5 rounded border border-gray-600"
                style={{ backgroundColor: color }}
            ></div>
            <span className="text-gray-300 text-sm">{text}</span>
        </div>
    );
}

export default function TowerOfHanoiVisualizer() {
    const [N, setN] = useState(DEFAULT_N);
    const [speed, setSpeed] = useState(DEFAULT_SPEED);
    const [steps, setSteps] = useState([]);
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [moveCount, setMoveCount] = useState(0);
    const timerRef = useRef(null);

    const runSolver = useCallback(() => {
        const result = towerOfHanoiVisualizerSteps(N);
        setSteps(result.steps);
        setMoveCount(result.moveCount);
        setCurrentStepIdx(0);
        setIsPlaying(false);
    }, [N]);

    useEffect(() => {
        runSolver();
    }, [runSolver]);

    useEffect(() => {
        if (isPlaying && currentStepIdx < steps.length - 1) {
            timerRef.current = setTimeout(() => {
                setCurrentStepIdx((i) => i + 1);
            }, speed);
        } else {
            clearTimeout(timerRef.current);
            setIsPlaying(false);
        }
        return () => clearTimeout(timerRef.current);
    }, [isPlaying, currentStepIdx, steps.length, speed]);

    const step = steps[currentStepIdx] || {};
    const rods = step.rods || { A: [], B: [], C: [] };

    return (
        <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">
                    🏰 Tower of Hanoi Visualizer
                </h1>

                {/* Controls */}
                <div className="flex flex-wrap gap-6 mb-8 p-6 rounded-lg bg-gray-800 border border-gray-700 justify-center items-center">
                    <div>
                        <label className="text-gray-300 text-sm">Disks (N):</label>
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
                            min={200}
                            max={2000}
                            value={speed}
                            onChange={(e) =>
                                setSpeed(Math.max(200, Math.min(2000, Number(e.target.value))))
                            }
                            className="w-20 mt-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                        />
                    </div>

                    <button
                        onClick={runSolver}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-6 py-2 rounded-md"
                    >
                        Restart
                    </button>

                    <button
                        onClick={() => setIsPlaying((p) => !p)}
                        className={`px-5 py-2 rounded-md font-medium ${isPlaying ? "bg-red-600" : "bg-green-600"
                            } text-white`}
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </button>

                    <button
                        onClick={() => setCurrentStepIdx((i) => Math.max(0, i - 1))}
                        disabled={currentStepIdx === 0}
                        className={`px-4 py-2 rounded-md font-medium ${currentStepIdx > 0
                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                : "bg-gray-800 text-gray-500"
                            }`}
                    >
                        Prev
                    </button>

                    <button
                        onClick={() =>
                            setCurrentStepIdx((i) => Math.min(steps.length - 1, i + 1))
                        }
                        disabled={currentStepIdx === steps.length - 1}
                        className={`px-4 py-2 rounded-md font-medium ${currentStepIdx < steps.length - 1
                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                : "bg-gray-800 text-gray-500"
                            }`}
                    >
                        Next
                    </button>
                </div>

                {/* Visualization */}
                <div className="flex flex-col lg:flex-row gap-10 justify-center items-start">
                    <div className="flex flex-col items-center w-full">
                        <Rods rods={rods} />
                        <div className="mt-6 text-center text-gray-300 text-sm">
                            Step {currentStepIdx + 1}/{steps.length} • Total Moves:{" "}
                            <b className="text-green-400">{moveCount}</b>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="flex-1 flex flex-col gap-5 max-w-md">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <h3 className="text-yellow-400 font-semibold mb-2 text-lg">
                                Step Explanation
                            </h3>
                            <p className="text-gray-200 text-base leading-relaxed">
                                {step.message || "Solving Tower of Hanoi..."}
                            </p>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm">
                            <h3 className="text-yellow-400 font-semibold mb-3 text-lg">
                                Color Meanings
                            </h3>
                            <Legend color="hsl(60, 70%, 55%)" text="Smallest Disk" />
                            <Legend color="hsl(120, 70%, 55%)" text="Medium Disk" />
                            <Legend color="hsl(180, 70%, 55%)" text="Larger Disk" />
                            <Legend color="hsl(240, 70%, 55%)" text="Largest Disk" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
