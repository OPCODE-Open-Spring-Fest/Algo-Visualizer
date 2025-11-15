import React, { useEffect, useRef, useState, useMemo } from "react";

export default function BuildTreeVisualizer({
  tree = null, currentStep = null, preorder = [], inorder = [],
  nodeSize = 60, gapY = 100, gapX = 80
}) {
  const containerRef = useRef(null);
  const [layoutNodes, setLayoutNodes] = useState([]);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [containerHeight, setContainerHeight] = useState(600);

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
    const inorderPositions = new Map();
    let inorderIndex = 0;
    
    function assignInorderPositions(node) {
      if (!node) return;
      assignInorderPositions(node.left);
      inorderPositions.set(node, inorderIndex++);
      assignInorderPositions(node.right);
    }
    assignInorderPositions(tree);
    
    const totalNodes = inorderPositions.size;
    function assignPositions(node, depth) {
      if (!node) return;
      
      const inorderPos = inorderPositions.get(node) ?? 0;
      const spacing = usableWidth / (totalNodes + 1);
      const x = 50 + spacing * (inorderPos + 1);
      const y = depth * gapY + 80;
      
      const nodeId = node.id || `node_${node.value}_${depth}_${inorderPos}`;
      layoutMap.set(nodeId, { value: node.value, node, x, y, depth, id: nodeId });
      assignPositions(node.left, depth + 1);
      assignPositions(node.right, depth + 1);
    }
    
    assignPositions(tree, 0);
    
    const layoutArray = Array.from(layoutMap.values());
    setLayoutNodes(layoutArray);
  }, [tree, containerWidth, gapY, gapX]);

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

  const edges = useMemo(() => {
    if (!tree || !layoutNodes.length) return [];
    const edgesArray = [];
    const nodeMap = new Map(layoutNodes.map(n => [n.node, n]));
    
    function buildEdges(node) {
      if (!node) return;
      const fromNode = nodeMap.get(node);
      
      if (!fromNode) return;
      if (node.left) {
        const toNode = nodeMap.get(node.left);
        if (toNode) {
          edgesArray.push({ from: fromNode, to: toNode, side: "left" });
        }
        buildEdges(node.left);
      }
      if (node.right) {
        const toNode = nodeMap.get(node.right);
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
    if (!currentStep || !currentStep.tree) {
      return "bg-gray-700 text-white border-2 border-gray-600";
    }

    const step = currentStep;
    const stepType = step.type;
    const rootValue = step.root;
    const nodeValue = nodeLayout.value;

    if (rootValue === nodeValue) {
      if (stepType === "select_root" || stepType === "create_node") {
        return "bg-blue-500 text-white border-4 border-blue-300 ring-4 ring-blue-400 ring-opacity-70 shadow-xl transform scale-110 z-20";
      } else if (stepType === "find_in_inorder" || stepType === "calculate_sizes") {
        return "bg-yellow-500 text-white border-4 border-yellow-300 ring-2 ring-yellow-400 ring-opacity-60 z-10";
      } else if (stepType === "attach_left" || stepType === "attach_right") {
        return "bg-green-500 text-white border-4 border-green-300 ring-2 ring-green-400 ring-opacity-60 z-10";
      } else if (stepType === "complete_subtree") {
        return "bg-emerald-500 text-white border-4 border-emerald-300 ring-2 ring-emerald-400 ring-opacity-60 z-10";
      }
    }
    if (step.tree) {
      const isInTree = (node, targetTree) => {
        if (!targetTree) return false;
        if (targetTree.value === node.value) return true;
        return isInTree(node, targetTree.left) || isInTree(node, targetTree.right);
      };
      
      if (isInTree(nodeLayout.node, step.tree) && rootValue !== nodeValue) {
        return "bg-indigo-600 text-white border-2 border-indigo-400 opacity-90";
      }
    }
    return "bg-gray-700 text-white border-2 border-gray-600";
  };

  const Node = ({ n }) => {
    const cls = getNodeClass(n);
    const radius = nodeSize / 2;

    return (
      <div
        key={`${n.value}-${n.x}-${n.y}`}
        className={`${cls} flex items-center justify-center rounded-full shadow-lg font-bold transition-all duration-500 ease-in-out cursor-default`}
        style={{
          position: "absolute",
          left: `${n.x - radius}px`,
          top: `${n.y - radius}px`,
          width: `${nodeSize}px`,
          height: `${nodeSize}px`,
          zIndex: 10,
          fontWeight: 700
        }}
      >
        <span className="text-base select-none drop-shadow-md">{String(n.value)}</span>
      </div>
    );
  };

  const SvgEdges = () => {
    if (!layoutNodes.length) return null;
    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={containerWidth}
        height={containerHeight}
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {edges.map((e, i) => {
          const x1 = e.from.x;
          const y1 = e.from.y + nodeSize * 0.45;
          const x2 = e.to.x;
          const y2 = e.to.y - nodeSize * 0.45;
          const midX = (x1 + x2) / 2;
          const controlY = Math.min(y1, y2) - 30;
          const d = `M ${x1} ${y1} Q ${midX} ${controlY} ${x2} ${y2}`;

          return (
            <path
              key={`${e.from.value}-${e.to.value}-${i}`}
              d={d}
              fill="none"
              stroke="url(#edge-gradient)"
              strokeWidth={2.5}
              strokeDasharray="5,5"
              style={{ transition: "all 0.6s ease" }}
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
          <div className="text-gray-400 font-medium">No tree to visualize</div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full py-6">
      <div
        ref={containerRef}
        className="relative w-full bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-xl border-2 border-gray-700/80 overflow-hidden shadow-2xl backdrop-blur-sm mx-auto"
        style={{ minHeight: `${containerHeight}px` }}
      >
        <SvgEdges />
        {layoutNodes.map((n) => (
          <Node key={n.id || `node-${n.value}-${n.x}-${n.y}`} n={n} />
        ))}
      </div>
    </div>
  );
}

