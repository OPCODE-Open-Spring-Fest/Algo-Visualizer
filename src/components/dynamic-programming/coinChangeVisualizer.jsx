import React, { useState, useEffect, useRef } from "react";

export default function CoinChangeVisualizer() {
    const [coins, setCoins] = useState([1, 2, 5]);
    const [amount, setAmount] = useState(11);
    const [speed, setSpeed] = useState(500);
    const [dp, setDp] = useState([]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    // --- Algorithm Logic ---
    const generateSteps = (coins, amount) => {
        const dpTable = Array(coins.length + 1)
            .fill(null)
            .map(() => Array(amount + 1).fill(Infinity));
        for (let i = 0; i <= coins.length; i++) dpTable[i][0] = 0;

        const stepsList = [];
        for (let i = 1; i <= coins.length; i++) {
            for (let j = 1; j <= amount; j++) {
                const withoutCoin = dpTable[i - 1][j];
                const withCoin =
                    j >= coins[i - 1] ? dpTable[i][j - coins[i - 1]] + 1 : Infinity;
                dpTable[i][j] = Math.min(withoutCoin, withCoin);

                stepsList.push({
                    i,
                    j,
                    coin: coins[i - 1],
                    withoutCoin,
                    withCoin,
                    result: dpTable[i][j],
                    dpSnapshot: dpTable.map((r) => [...r]),
                });
            }
        }
        return stepsList;
    };

    // --- Visualization Control ---
    const startVisualization = () => {
        const newSteps = generateSteps(coins, amount);
        setSteps(newSteps);
        setDp(newSteps[0].dpSnapshot);
        setCurrentStep(0);
        setIsRunning(true);
    };

    useEffect(() => {
        if (isRunning && steps.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev >= steps.length - 1) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, steps, speed]);

    useEffect(() => {
        if (steps[currentStep]) setDp(steps[currentStep].dpSnapshot);
    }, [currentStep, steps]);

    const current = steps[currentStep];

    // --- Color Logic ---
    const getCellColor = (i, j, cell) => {
        if (cell === 0) return "bg-green-600 text-white font-bold";
        if (current && current.i === i && current.j === j)
            return "bg-yellow-400 text-black animate-pulse shadow-lg shadow-yellow-400/40";
        if (i === coins.length && j === amount)
            return "bg-purple-600 text-white font-bold shadow-md";
        if (cell === Infinity) return "bg-gray-800 text-gray-400";
        return "bg-blue-600/70 text-white";
    };

    return (
        <div className="p-4 md:p-8 bg-gray-950 min-h-screen text-white font-sans">
            <h1 className="text-3xl font-bold mb-8 text-center text-indigo-400">
                Coin Change Visualizer (Dynamic Programming)
            </h1>

            {/* Input Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <input
                    type="text"
                    value={coins.join(",")}
                    onChange={(e) => setCoins(e.target.value.split(",").map(Number))}
                    placeholder="Coins (e.g., 1,2,5)"
                    className="p-2 rounded-md bg-gray-800 border border-gray-700 text-center w-48"
                />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Amount"
                    className="p-2 rounded-md bg-gray-800 border border-gray-700 text-center w-32"
                />
                <input
                    type="range"
                    min="200"
                    max="1500"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-40 accent-indigo-500"
                />
                <button
                    onClick={startVisualization}
                    className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-500 transition"
                >
                    Start
                </button>
                <button
                    onClick={() => {
                        setIsRunning(false);
                        clearInterval(intervalRef.current);
                        setSteps([]);
                        setDp([]);
                    }}
                    className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                >
                    Reset
                </button>
            </div>

            {/* DP Table */}
            <div className="overflow-x-auto flex justify-center mb-10">
                <table className="border-separate border-spacing-1 text-center">
                    <thead>
                        <tr>
                            <th className="p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300">
                                Coins ↓ / Amount →
                            </th>
                            {Array.from({ length: amount + 1 }, (_, j) => (
                                <th
                                    key={j}
                                    className="p-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                                >
                                    {j}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dp.map((row, i) => (
                            <tr key={i} className="even:bg-gray-900/40">
                                <td className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-300">
                                    {i === 0 ? "∅" : `[${coins[i - 1]}]`}
                                </td>
                                {row.map((cell, j) => (
                                    <td
                                        key={j}
                                        className={`w-12 h-12 border border-gray-700 rounded-md text-center transition-all duration-300 ${getCellColor(
                                            i,
                                            j,
                                            cell
                                        )}`}
                                    >
                                        {cell === Infinity ? "∞" : cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Explanation Panel */}
            {current && (
                <div className="text-center bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
                    <p className="text-indigo-300 font-semibold mb-2">
                        Step {currentStep + 1} / {steps.length}
                    </p>
                    <p className="text-gray-200">
                        Computing{" "}
                        <span className="text-yellow-400 font-medium">
                            dp[{current.i}][{current.j}]
                        </span>{" "}
                        using coin{" "}
                        <span className="text-cyan-400 font-medium">{current.coin}</span>
                    </p>
                    <p className="mt-3 text-gray-300">
                        Without coin ={" "}
                        <span className="text-red-400">
                            {current.withoutCoin === Infinity ? "∞" : current.withoutCoin}
                        </span>{" "}
                        | With coin ={" "}
                        <span className="text-green-400">
                            {current.withCoin === Infinity ? "∞" : current.withCoin}
                        </span>
                    </p>
                    <p className="mt-3 text-green-400 font-semibold">
                        dp[{current.i}][{current.j}] = min(
                        {current.withoutCoin === Infinity ? "∞" : current.withoutCoin},{" "}
                        {current.withCoin === Infinity ? "∞" : current.withCoin}) ={" "}
                        {current.result === Infinity ? "∞" : current.result}
                    </p>
                </div>
            )}
        </div>
    );
}
