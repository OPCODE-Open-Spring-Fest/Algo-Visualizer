import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft, Play, Pause, StepForward, RotateCcw, TreePine } from "lucide-react";
import TreeTraversalVisualizer from "../../components/Tree/TreeTraversalVisualizer";
import { treeTraversalGenerator, buildTreeFromLevelOrder } from "../../algorithms/Tree/treeTraversal";

export default function TreeTraversal() {
  const [selectedTraversal, setSelectedTraversal] = useState("");
  const [treeData, setTreeData] = useState([1, 2, 3, 4, 5, null, 6, 7]);
  const [inputString, setInputString] = useState("1,2,3,4,5,-1,6,7");
  const [speed, setSpeed] = useState(800);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [tree, setTree] = useState(null);
  const [finalResult, setFinalResult] = useState([]);
  const generatorRef = useRef(null);
  const timerRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const root = buildTreeFromLevelOrder(treeData);
    setTree(root);
    if (root && selectedTraversal) {
      setSteps([]);
      setStepIndex(-1);
      setCurrentStep(null);
      setIsPlaying(false);
    }
  }, [treeData, selectedTraversal]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputString(value);
    try {
      const parsed = value
        .split(",")
        .map((p) =>
          ["-1", "", "null"].includes(p.trim().toLowerCase())
            ? null
            : Number(p.trim())
        );
      setTreeData(parsed);
      setSteps([]);
      setStepIndex(-1);
      setCurrentStep(null);
      setIsPlaying(false);
    } catch (err) {
      console.error("Error parsing input:", err);
    }
  };

  const loadDemo = () => {
    const demo = [1, 2, 3, 4, 5, null, 6, 7, null, null, null, null, null, 8, 9];
    setTreeData(demo);
    setInputString("1,2,3,4,5,-1,6,7,-1,-1,-1,-1,-1,8,9");
    setSteps([]);
    setStepIndex(-1);
    setCurrentStep(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!selectedTraversal || !tree) return;
    setIsPlaying(false);
    clearTimeout(timerRef.current);

    const newSteps = [];
    generatorRef.current = treeTraversalGenerator(treeData, selectedTraversal);
    try {
      for (const step of generatorRef.current) newSteps.push(step);
      stepsRef.current = newSteps;
      setSteps(newSteps);
      setStepIndex(0);
      setCurrentStep(newSteps[0] || null);

      const lastStep = newSteps.at(-1);
      const visited = lastStep?.step?.visited ?? [];
      setFinalResult(visited);
    } catch (error) {
      console.error("Error generating steps:", error);
      toast.error("Error generating traversal steps");
    }
  }, [selectedTraversal, treeData, tree]);

  useEffect(() => {
    if (isPlaying && stepIndex < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setStepIndex((prev) =>
          prev + 1 < steps.length ? prev + 1 : steps.length - 1
        );
      }, speed);
    } else if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, stepIndex, steps.length, speed]);

  useEffect(() => {
    if (stepIndex >= 0 && stepIndex < steps.length)
      setCurrentStep(steps[stepIndex]);
  }, [stepIndex, steps]);

  const togglePlay = () => {
    if (steps.length === 0) return;
    if (stepIndex >= steps.length - 1) {
      setStepIndex(0);
      setIsPlaying(true);
    } else setIsPlaying(!isPlaying);
  };
  const stepForward = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((p) => p + 1);
      setIsPlaying(false);
    }
  };
  const stepBackward = () => {
    if (stepIndex > 0) {
      setStepIndex((p) => p - 1);
      setIsPlaying(false);
    }
  };
  const reset = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    setSteps([]);
    setStepIndex(-1);
    setCurrentStep(null);
    setFinalResult([]);
    setSelectedTraversal("");
  };

  const getTraversalDescription = (type) =>
    type === "inorder"
      ? "Left → Root → Right"
      : type === "preorder"
      ? "Root → Left → Right"
      : "Left → Right → Root";

  if (!selectedTraversal) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 py-10">
        <TreePine className="w-16 h-16 text-white mb-5" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-white to-green-400 mb-4 text-center">
          Tree Traversal Algorithms
        </h1>
        <p className="text-gray-400 max-w-2xl text-center mb-12">
          Select a traversal method to visualize how it explores tree nodes —
          simple, elegant, and interactive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[
            {
              id: "inorder",
              title: "Inorder Traversal",
              desc: "Left → Root → Right",
            },
            {
              id: "preorder",
              title: "Preorder Traversal",
              desc: "Root → Left → Right",
            },
            {
              id: "postorder",
              title: "Postorder Traversal",
              desc: "Left → Right → Root",
            },
          ].map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTraversal(t.id)}
              className={`relative bg-gray-700/80 backdrop-blur-md rounded-2xl p-6 text-center border border-gray-800 cursor-pointer transition-all duration-300 hover:scale-105`}
            >
              <div className="text-5xl mb-4">🌳</div>
              <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
              <p className="text-gray-400 mb-4 text-sm font-medium">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-gray-800 text-white flex flex-col">
      <Toaster position="top-center" />
      {/* Control Bar */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/60 backdrop-blur-lg flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedTraversal("")}
            className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </button>
          <input
            value={inputString}
            onChange={handleInputChange}
            className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm w-48 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            onClick={loadDemo}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm"
          >
            Demo
          </button>
        </div>

        <div className="flex items-center gap-2">
          {["inorder", "preorder", "postorder"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTraversal(t)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedTraversal === t
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Speed:</label>
          <input  type="range"  min="200" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-blue-500 w-24" />
          <span className="text-xs text-gray-500">{speed}ms</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={stepForward}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            <StepForward size={16} />
          </button>
          <button
            onClick={stepBackward}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            ←
          </button>
          <button
            onClick={reset}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="p-6 flex justify-between items-center border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold">
            {selectedTraversal.charAt(0).toUpperCase() +
              selectedTraversal.slice(1)}{" "}
            Traversal
          </h1>
          <p className="text-sm text-gray-400">
            {getTraversalDescription(selectedTraversal)}
          </p>
        </div>
        {finalResult.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-indigo-300 mb-1">
              Final Sequence
            </h4>
            <div className="flex flex-wrap gap-2 font-mono text-indigo-200 text-base">
              {finalResult.map((v, i) => (
                <React.Fragment key={i}>
                  <span className="bg-indigo-600/20 px-3 py-1 rounded-full border border-indigo-400/30">
                    {v}
                  </span>
                  {i < finalResult.length - 1 && (
                    <span className="text-indigo-400">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto p-6 bg-gray-950">
        {tree ? (
          <TreeTraversalVisualizer
            tree={tree}
            currentStep={currentStep}
            traversalType={selectedTraversal}
          />
        ) : (
          <div className="text-gray-400 text-center mt-20">Loading Tree...</div>
        )}
      </div>
    </div>
  );
}
