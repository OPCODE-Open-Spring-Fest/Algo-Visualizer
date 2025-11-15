import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft, Play, Pause, StepForward, RotateCcw } from "lucide-react";
import BuildTreeVisualizer from "../../components/Tree/BuildTreeVisualizer";
import { buildTreeFromPreorderInorder, cloneTree } from "../../algorithms/Tree/buildTreeFromPreorderInorder";

export default function BuildTreeFromPreorderInorder() {
  const [preorder, setPreorder] = useState([3, 9, 20, 15, 7]);
  const [inorder, setInorder] = useState([9, 3, 15, 20, 7]);
  const [preorderInput, setPreorderInput] = useState("3,9,20,15,7");
  const [inorderInput, setInorderInput] = useState("9,3,15,20,7");
  const [speed, setSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [tree, setTree] = useState(null);
  const generatorRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (preorder.length === 0 || inorder.length === 0) {
      setTree(null);
      setSteps([]);
      setStepIndex(-1);
      setCurrentStep(null);
      return;
    }
    if (preorder.length !== inorder.length) {
      toast.error("Preorder and Inorder arrays must have the same length!");
      return;
    }
    const preorderSorted = [...preorder].sort((a, b) => a - b);
    const inorderSorted = [...inorder].sort((a, b) => a - b);
    if (JSON.stringify(preorderSorted) !== JSON.stringify(inorderSorted)) {
      toast.error("Preorder and Inorder arrays must contain the same elements!");
      return;
    }
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    const newSteps = [];
    generatorRef.current = buildTreeFromPreorderInorder(preorder, inorder);
    try {
      for (const step of generatorRef.current) {
        newSteps.push(step);
      }
      setSteps(newSteps);
      setStepIndex(0);
      setCurrentStep(newSteps[0] || null);

      const lastStep = newSteps[newSteps.length - 1];
      if (lastStep && lastStep.tree) {
        setTree(cloneTree(lastStep.tree));
      }
    } catch (error) {
      console.error("Error generating steps:", error);
      toast.error("Error generating construction steps");
    }
  }, [preorder, inorder]);

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
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(steps[stepIndex]);
      if (steps[stepIndex].tree) {
        setTree(cloneTree(steps[stepIndex].tree));
      }
    }
  }, [stepIndex, steps]);
  const handlePreorderChange = (e) => {
    const value = e.target.value;
    setPreorderInput(value);
    try {
      const parsed = value
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== "")
        .map((p) => Number(p));
      if (parsed.length > 0) {
        setPreorder(parsed);
      }
    } catch (err) {
      console.error("Error parsing preorder:", err);
    }
  };

  const handleInorderChange = (e) => {
    const value = e.target.value;
    setInorderInput(value);
    try {
      const parsed = value
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== "")
        .map((p) => Number(p));
      if (parsed.length > 0) {
        setInorder(parsed);
      }
    } catch (err) {
      console.error("Error parsing inorder:", err);
    }
  };
  const loadDemo = () => {
    setPreorder([3, 9, 20, 15, 7]);
    setInorder([9, 3, 15, 20, 7]);
    setPreorderInput("3,9,20,15,7");
    setInorderInput("9,3,15,20,7");
  };
  const togglePlay = () => {
    if (steps.length === 0) return;
    if (stepIndex >= steps.length - 1) {
      setStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  const reset = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    setSteps([]);
    setStepIndex(-1);
    setCurrentStep(null);
    setTree(null);
  };
  return (
    <div className="w-full h-full bg-gray-800 text-white flex flex-col">
      <Toaster position="top-center" />
      <div className="p-4 border-b border-gray-800 bg-gray-900/60 backdrop-blur-lg flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </button>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Preorder:</label>
            <input
              value={preorderInput}
              onChange={handlePreorderChange}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm w-40 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="3,9,20,15,7"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Inorder:</label>
            <input
              value={inorderInput}
              onChange={handleInorderChange}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm w-40 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="9,3,15,20,7"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Speed:</label>
          <input type="range" min="200" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-blue-500 w-24"/>
          <span className="text-xs text-gray-500">{speed}ms</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={reset}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="p-6 flex justify-between items-center border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold">
            Construct Binary Tree from Preorder & Inorder
          </h1>
        </div>
        {currentStep && (
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-indigo-300 mb-1">
              Step {stepIndex + 1} / {steps.length}
            </div>
            <div className="text-sm text-gray-300">
              {currentStep.type?.replace(/_/g, " ").toUpperCase()}
            </div>
          </div>
        )}
      </div>
      {currentStep && (
        <div className="p-4 bg-gray-900/40 border-b border-gray-800">
          <div className="flex gap-8 items-center">
            <div>
              <div className="text-xs text-gray-400 mb-2">Preorder Array:</div>
              <div className="flex gap-2 items-center">
                {currentStep.preorder?.map((val, idx) => {
                  const isInRange =
                    idx >= (currentStep.preStart || 0) &&
                    idx <= (currentStep.preEnd || currentStep.preorder.length - 1);
                  const isRoot = idx === (currentStep.preStart || 0);
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                        isRoot
                          ? "bg-blue-500 text-white ring-2 ring-blue-300 scale-110"
                          : isInRange
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {val}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-2">Inorder Array:</div>
              <div className="flex gap-2 items-center">
                {currentStep.inorder?.map((val, idx) => {
                  const isInRange =
                    idx >= (currentStep.inStart || 0) &&
                    idx <= (currentStep.inEnd || currentStep.inorder.length - 1);
                  const isRoot = val === currentStep.root;
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                        isRoot
                          ? "bg-yellow-500 text-white ring-2 ring-yellow-300 scale-110"
                          : isInRange
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {val}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {currentStep && currentStep.message && (
        <div className="p-4 bg-indigo-900/30 border-b border-indigo-800/50">
          <div className="text-sm text-indigo-200 font-medium">
            {currentStep.message}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-auto p-6 bg-gray-950">
        {tree ? (
          <BuildTreeVisualizer tree={tree} currentStep={currentStep} preorder={preorder} inorder={inorder}/>
        ) : (
          <div className="text-gray-400 text-center mt-20">
            {preorder.length === 0 || inorder.length === 0
              ? "Enter preorder and inorder arrays to start"
              : "Loading tree construction..."}
          </div>
        )}
      </div>
    </div>
  );
}
