function buildTreeFromLevelOrder(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  
  const nodes = arr.map((val, idx) => 
    val === null || val === -1 
      ? null 
      : { id: `n${idx}`, value: val, left: null, right: null }
  );
  const root = nodes[0];
  if (!root) return null;
  
  const queue = [root];
  let i = 1;
  
  while (queue.length > 0 && i < nodes.length) {
    const current = queue.shift();
    if (i < nodes.length && nodes[i] !== null) {
      current.left = nodes[i];
      queue.push(nodes[i]);
    }
    i++;
    
    if (i < nodes.length && nodes[i] !== null) {
      current.right = nodes[i];
      queue.push(nodes[i]);
    }
    i++;
  }
  return root;
}
function cloneTree(node) {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
}
function getAllNodeIds(node) {
  if (!node) return [];
  return [node.id, ...getAllNodeIds(node.left), ...getAllNodeIds(node.right)];
}

//inorder
export function* inorderTraversal(root) {
  if (!root) {
    yield {type: "error", message: "Tree is empty",  current: null, visited: [], path: [], subtree: "root" };
    return;
  }

  const visited = [];
  const path = [];
  function* traverse(node) {
    if (!node) return;
    if (node.left) {
      path.push(node.value);
      yield {
        type: "traverse_left",
        message: `Moving to left subtree of ${node.value}`,
        current: node.value, visited: [...visited], path: [...path], subtree: "left"
      };
      yield* traverse(node.left);
      path.pop();
    }
    path.push(node.value);
    visited.push(node.value);
    yield {
      type: "visit",
      message: `Visiting ${node.value} (Inorder: Left → Root → Right)`,
      current: node.value, visited: [...visited], path: [...path], subtree: "root"
    };
    if (node.right) {
      yield {
        type: "traverse_right",
        message: `Moving to right subtree of ${node.value}`,
        current: node.value, visited: [...visited], path: [...path], subtree: "root"
      };
      yield* traverse(node.right);
    }
    
    path.pop();
  }
  yield* traverse(root);
  
  yield {
    type: "complete",
    message: `Inorder traversal complete: ${visited.join(" → ")}`,
    current: null,  visited: visited, path: []
  };
}

//preorder
export function* preorderTraversal(root) {
  if (!root) {
    yield { type: "error", message: "Tree is empty", current: null, visited: [],  path: [] };
    return;
  }
  const visited = [];
  const path = [];
  
  function* traverse(node) {
    if (!node) return;
    path.push(node.value);
    visited.push(node.value);
    yield {
      type: "visit",
      message: `Visiting ${node.value} (Preorder: Root → Left → Right)`,
      current: node.value,  visited: [...visited], path: [...path], subtree: "root"
    };
    if (node.left) {
      yield {
        type: "traverse_left",
        message: `Moving to left subtree of ${node.value}`,
        current: node.value, visited: [...visited],path: [...path]
      };
      yield* traverse(node.left);
    }
    
    if (node.right) {
      yield {
        type: "traverse_right",
        message: `Moving to right subtree of ${node.value}`,
        current: node.value, visited: [...visited], path: [...path] };
      yield* traverse(node.right);
    }
    path.pop();
  }
  
  yield* traverse(root);
  
  yield { type: "complete", message: `Preorder traversal complete: ${visited.join(" → ")}`, current: null, visited: visited, path: []};
}

//postorder
export function* postorderTraversal(root) {
  if (!root) {
    yield {  type: "error", message: "Tree is empty", current: null, visited: [], path: [] };
    return;
  }
  const visited = [];
  const path = [];
  
  function* traverse(node) {
    if (!node) return;
    path.push(node.value);
    if (node.left) {
      yield {
        type: "traverse_left",
        message: `Moving to left subtree of ${node.value}`,
        current: node.value,
        visited: [...visited],
        path: [...path]
      };
      yield* traverse(node.left);
    }
    
    if (node.right) {
      yield {
        type: "traverse_right",
        message: `Moving to right subtree of ${node.value}`,
        current: node.value,
        visited: [...visited],
        path: [...path]
      };
      yield* traverse(node.right);
    }
    visited.push(node.value);
    yield {
      type: "visit",
      message: `Visiting ${node.value} (Postorder: Left → Right → Root)`,
      current: node.value,
      visited: [...visited],
      path: [...path],
      subtree: "root"
    };
    path.pop();
  }
  yield* traverse(root);
  yield {
    type: "complete",
    message: `Postorder traversal complete: ${visited.join(" → ")}`,
    current: null,
    visited: visited,
    path: []
  };
}
export function* treeTraversalGenerator(treeData, traversalType = "all") {
  const root = buildTreeFromLevelOrder(treeData);
  if (!root) {
    yield {
      type: "error",
      message: "Invalid tree data",
      tree: null,
      step: null
    };
    return;
  }
  if (traversalType === "all") {
    const traversals = [
      { name: "inorder", generator: inorderTraversal },
      { name: "preorder", generator: preorderTraversal },
      { name: "postorder", generator: postorderTraversal }
    ];
    const results = {
      inorder: { visited: [], steps: [] },
      preorder: { visited: [], steps: [] },
      postorder: { visited: [], steps: [] }
    };
    for (const { name, generator } of traversals) {
      for (const step of generator(cloneTree(root))) {
        results[name].steps.push(step);
        if (step.type === "complete") {
          results[name].visited = step.visited;
        }
      }
    }
    yield {
      type: "sync_step",
      tree: cloneTree(root),
      stepIndex: -1,
      inorder: { type: "start", message: "Starting Inorder traversal", visited: [], path: [] },
      preorder: { type: "start", message: "Starting Preorder traversal", visited: [], path: [] },
      postorder: { type: "start", message: "Starting Postorder traversal", visited: [], path: [] }
    };
    const maxSteps = Math.max(
      results.inorder.steps.length,
      results.preorder.steps.length,
      results.postorder.steps.length
    );
    for (let i = 0; i < maxSteps; i++) {
      const step = {
        type: "sync_step",
        tree: cloneTree(root),
        stepIndex: i,
        inorder: results.inorder.steps[i] || results.inorder.steps[results.inorder.steps.length - 1] || null,
        preorder: results.preorder.steps[i] || results.preorder.steps[results.preorder.steps.length - 1] || null,
        postorder: results.postorder.steps[i] || results.postorder.steps[results.postorder.steps.length - 1] || null
      };
      yield step;
    }
    yield {
      type: "complete",
      tree: cloneTree(root),
      inorder: results.inorder.visited,
      preorder: results.preorder.visited,
      postorder: results.postorder.visited,
      message: `All traversals complete. Inorder: [${results.inorder.visited.join(", ")}], Preorder: [${results.preorder.visited.join(", ")}], Postorder: [${results.postorder.visited.join(", ")}]`
    };
  } else {
    let generator;
    if (traversalType === "inorder") {
      generator = inorderTraversal;
    } else if (traversalType === "preorder") {
      generator = preorderTraversal;
    } else if (traversalType === "postorder") {
      generator = postorderTraversal;
    } else {
      yield {
        type: "error",
        message: "Invalid traversal type",
        tree: null,
        step: null
      };
      return;
    }
    for (const step of generator(cloneTree(root))) {
      yield {
        type: "single_step",
        tree: cloneTree(root),
        traversal: traversalType,
        step: step
      };
    }
  }
}
export { buildTreeFromLevelOrder, cloneTree, getAllNodeIds };

