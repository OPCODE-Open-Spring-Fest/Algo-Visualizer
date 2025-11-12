import React, { useEffect, useRef, useState, useMemo } from "react";

export default function TreeTraversalVisualizer({
  tree = null,
  currentStep = null,
  traversalType = "all",
  nodeSize = 60,
  gapY = 100,
  gapX = 80
}) {
  const containerRef = useRef(null);
  const [layoutNodes, setLayoutNodes] = useState([]);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [containerHeight, setContainerHeight] = useState(600);
  const nodeIdMapRef = useRef(new WeakMap());
  const nextIdRef = useRef(1);
  const getNodeVizId = (node) => {
    if (!node) return null;
    if (node.id !== undefined && node.id !== null) return String(node.id);
    const map = nodeIdMapRef.current;
    if (map.has(node)) return map.get(node);
    const id = `viz_${nextIdRef.current++}`;
    map.set(node, id);
    return id;
  };
  useEffect(() => {
    if (!tree) {
      setLayoutNodes([]);
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setContainerWidth(rect.width || 1000);
      setContainerHeight(rect.height || 600);
    }

    //tree height
    function getTreeHeight(node) {
      if (!node) return 0;
      return 1 + Math.max(
        getTreeHeight(node.left),
        getTreeHeight(node.right)
      );
    }

    const treeHeight = getTreeHeight(tree);
    setContainerHeight(Math.max(treeHeight * gapY + 200, 400));
    const layoutMap = new Map();
    const usableWidth = Math.max(containerWidth - 100, 800);
    const maxDepth = treeHeight - 1;
    const baseSpacing = Math.max(80, gapX);
    const inorderPositions = new Map();
    let inorderIndex = 0;
    
    function assignInorderPositions(node) {
      if (!node) return;
      assignInorderPositions(node.left);
      inorderPositions.set(node, inorderIndex++);
      assignInorderPositions(node.right);
    }
    assignInorderPositions(tree);
    
    function assignPositions(node, depth) {
      if (!node) return;
      
      const id = getNodeVizId(node);
      const inorderPos = inorderPositions.get(node);
      const totalNodes = inorderPositions.size;
      
      const spacing = usableWidth / (totalNodes + 1);
      const x = 50 + spacing * (inorderPos + 1);
      const y = depth * gapY + 80;
      
      layoutMap.set(id, { id,  value: node.value, rawNode: node, x, y, depth });
      assignPositions(node.left, depth + 1);
      assignPositions(node.right, depth + 1);
    }
    
    assignPositions(tree, 0);
    
    const layoutArray = Array.from(layoutMap.values());
    setLayoutNodes(layoutArray);
  }, [tree, containerWidth, gapY, gapX, nodeSize]);

  useEffect(() => {
    const onResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setContainerWidth(rect.width || 1000);
      }
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Build edges
  const edges = useMemo(() => {
    if (!tree || !layoutNodes.length) return [];
    const edgesArray = [];
    const nodeMap = new Map(layoutNodes.map(n => [n.id, n]));
    
    function buildEdges(node) {
      if (!node) return;
      const fromId = getNodeVizId(node);
      const fromNode = nodeMap.get(fromId);
      
      if (!fromNode) return;
      if (node.left) {
        const toId = getNodeVizId(node.left);
        const toNode = nodeMap.get(toId);
        if (toNode) {
          edgesArray.push({ from: fromNode, to: toNode, side: "left" });
        }
        buildEdges(node.left);
      }
      if (node.right) {
        const toId = getNodeVizId(node.right);
        const toNode = nodeMap.get(toId);
        if (toNode) {
          edgesArray.push({ from: fromNode, to: toNode, side: "right" });
        }
        buildEdges(node.right);
      }
    }
    buildEdges(tree);
    return edgesArray;
  }, [tree, layoutNodes]);

  const getNodeClass = (nodeLayout) => {
    if (!currentStep) {
      return "bg-gray-700 text-white border-2 border-gray-600";
    }
    let step = null;
    if (currentStep.type === "single_step" && currentStep.step) {
      step = currentStep.step;
    } else if (currentStep.step) {
      step = currentStep.step;
    } else {
      step = currentStep;
    }
    if (!step) {
      return "bg-gray-700 text-white border-2 border-gray-600";
    }

    const stepType = step.type;
    const currentId = step.current;
    const path = step.path || [];
    const visited = step.visited || [];
    const nodeValue = nodeLayout.rawNode?.value ?? nodeLayout.value;
    const nodeValueStr = String(nodeValue);
    const currentIdStr = currentId ? String(currentId) : null;
    
    if (currentIdStr && currentIdStr === nodeValueStr) {
      if (stepType === "visit") {
        return "bg-emerald-500 text-white border-4 border-emerald-300 ring-4 ring-emerald-400 ring-opacity-70 shadow-xl transform scale-110 z-20";
      } else if (stepType === "traverse_left" || stepType === "traverse_right") {
        return "bg-blue-500 text-white border-4 border-blue-300 ring-2 ring-blue-400 ring-opacity-60 z-10";
      }
    }
    const pathMatches = path.some(p => String(p) === nodeValueStr);
    if (pathMatches && stepType !== "visit" && (!currentIdStr || currentIdStr !== nodeValueStr)) {
      return "bg-indigo-600 text-white border-2 border-indigo-400";
    }
    if (stepType === "visit" && visited && visited.length > 0 && visited.includes(nodeValue)) {
      if (!currentIdStr || currentIdStr !== nodeValueStr) {
        return "bg-violet-600 text-white border-2 border-violet-400 opacity-90";
      }
    }
    return "bg-gray-700 text-white border-2 border-gray-600";
  };

  // Render node
  const Node = ({ n }) => {
    const cls = getNodeClass(n);
    const radius = nodeSize / 2;

    return (
      <div
        key={n.id}
        className={`${cls} flex items-center justify-center rounded-full shadow-lg font-bold transition-all duration-500 ease-in-out cursor-default`}
        style={{ position: "absolute", left: `${n.x - radius}px`, top: `${n.y - radius}px`, width: `${nodeSize}px`, height: `${nodeSize}px`, zIndex: 10, fontWeight: 700 }}>
        <span className="text-base select-none drop-shadow-md">{String(n.value)}</span>
      </div>
    );
  };
  const SvgEdges = () => {
    if (!layoutNodes.length) return null;
    return (
      <svg  className="absolute inset-0 pointer-events-none"  width={containerWidth} height={containerHeight} style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="edge-active" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
          </linearGradient>
        </defs>
        {edges.map((e, i) => {
          const x1 = e.from.x;
          const y1 = e.from.y + nodeSize * 0.45;
          const x2 = e.to.x;
          const y2 = e.to.y - nodeSize * 0.45;

          let step = null;
          if (currentStep?.type === "single_step" && currentStep.step) step = currentStep.step;
          else if (currentStep?.step) step = currentStep.step;
          else step = currentStep;
          
          const path = step?.path || [];
          const fromValue = e.from.rawNode?.value ?? e.from.value;
          const toValue = e.to.rawNode?.value ?? e.to.value;
          const isInPath = path.some(p => String(p) === String(fromValue)) && 
                          path.some(p => String(p) === String(toValue));
          const midX = (x1 + x2) / 2;
          const controlY = Math.min(y1, y2) - 30;
          const d = `M ${x1} ${y1} Q ${midX} ${controlY} ${x2} ${y2}`;

          return (
            <path
              key={`${e.from.id}-${e.to.id}-${i}`}
              d={d}
              fill="none"
              stroke={isInPath ? "url(#edge-active)" : "url(#edge-gradient)"}
              strokeWidth={isInPath ? 3.5 : 2.5}
              strokeDasharray={isInPath ? "0" : "5,5"}
              style={{ 
                transition: "all 0.6s ease",
                filter: isInPath ? "drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))" : "none"
              }}
            />
          );
        })}
      </svg>
    );
  };

  if (!tree) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900/30 rounded-xl border-2 border-gray-700">
        <div className="text-center">
          <div className="text-4xl mb-3">🌳</div>
          <div className="text-gray-400 font-medium">No tree data to visualize</div>
        </div>
      </div>
    );
  }
  const getVisitedArray = () => {
    if (!currentStep) return [];
    let step = null;
    if (currentStep.type === "single_step" && currentStep.step) step = currentStep.step;
    else if (currentStep.step) step = currentStep.step;
    else step = currentStep;
    return step?.visited || [];
  };
  const visitedArray = getVisitedArray();
  return (
    <div className="w-full py-6">
      <div
        ref={containerRef}
        className="relative w-full bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-xl border-2 border-gray-700/80 overflow-hidden shadow-2xl backdrop-blur-sm mx-auto"
        style={{ minHeight: `${containerHeight}px` }}>
      <SvgEdges />
      {layoutNodes.map((n) => (
        <Node key={n.id} n={n} />
      ))}
      {visitedArray.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-gray-800/95 backdrop-blur-md rounded-lg p-4 border-2 border-gray-600 shadow-xl">
          <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Traversal Sequence:</div>
          <div className="flex flex-wrap gap-2 items-center">
            {visitedArray.map((val, idx) => {
              const isLast = idx === visitedArray.length - 1;
              return (
                <React.Fragment key={idx}>
                  <span
                    className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all duration-300 ${
                      isLast
                        ? "bg-emerald-500 text-white scale-110 shadow-lg ring-2 ring-emerald-300"
                        : "bg-violet-600 text-white shadow-md" }`} >
                    {val}</span>
                  {idx < visitedArray.length - 1 && (
                    <span className="text-gray-500 font-bold">→</span>)}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

