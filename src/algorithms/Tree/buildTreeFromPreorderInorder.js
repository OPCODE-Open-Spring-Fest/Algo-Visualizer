export function* buildTreeFromPreorderInorder(preorder, inorder) {
  const steps = [];
  let stepIndex = 0;

  function* buildTree(preStart, preEnd, inStart, inEnd, parent = null) {
    if (preStart > preEnd || inStart > inEnd) {
      yield {
        type: "base_case",
        message: "Base case: Empty subtree",
        preorder: preorder ,inorder: inorder ,preStart, inEnd, inStart, preEnd, root: null, tree: null, parent
      };
      return null;
    }

    const rootValue = preorder[preStart];
    
    yield {
      type: "select_root",
      message: `Selecting root: ${rootValue} (first element in preorder)`,
      preorder: preorder ,inorder: inorder ,preStart, inEnd, inStart, preEnd, rootValue, tree: null, parent
    };
    const rootIndexInInorder = inorder.indexOf(rootValue);
    
    yield {
      type: "find_in_inorder",
      message: `Finding ${rootValue} in inorder at index ${rootIndexInInorder}`,
      preorder: preorder ,inorder: inorder ,preStart, inEnd, inStart, preEnd, rootValue, rootIndexInInorder, tree: null, parent
    };

    const leftSize = rootIndexInInorder - inStart;
    const rightSize = inEnd - rootIndexInInorder;

    yield {
      type: "calculate_sizes",
      message: `Left subtree size: ${leftSize}, Right subtree size: ${rightSize}`,
      preorder: preorder,inorder: inorder,
      preStart, inEnd, inStart, preEnd, rootValue, rootIndexInInorder, leftSize, rightSize, tree: null, parent
    };

    const root = {
      value: rootValue,
      left: null, right: null,
      id: `node_${rootValue}_${Date.now()}_${Math.random()}`
    };

    yield {
      type: "create_node",
      message: `Creating node with value ${rootValue}`,
      preorder: preorder ,inorder: inorder ,preStart, inEnd, inStart, preEnd, rootValue, rootIndexInInorder, leftSize, rightSize, tree: root, parent
    };

    if (leftSize > 0) {
      yield {
        type: "build_left",
        message: `Building left subtree: preorder[${preStart + 1}..${preStart + leftSize}], inorder[${inStart}..${rootIndexInInorder - 1}]`,
        preorder: preorder,  inorder: inorder,
        preStart, preEnd,   inStart,   inEnd,   root: rootValue,
        rootIndexInInorder,  leftSize,  rightSize,  tree: root,  parent
      };

      const leftSubtree = yield* buildTree(
        preStart + 1,
        preStart + leftSize,   inStart,
        rootIndexInInorder - 1,  root
      );
      root.left = leftSubtree;

      yield {
        type: "attach_left",
        message: `Attached left subtree to ${rootValue}`,
        preorder: preorder,   inorder: inorder,
        preStart,  preEnd,  inStart,  inEnd,
        root: rootValue,  tree: root,  parent
      };
    }
    if (rightSize > 0) {
      yield {
        type: "build_right",
        message: `Building right subtree: preorder[${preStart + leftSize + 1}..${preEnd}], inorder[${rootIndexInInorder + 1}..${inEnd}]`,
        preorder: preorder,  inorder: inorder,
        preStart,   preEnd,   inStart,   inEnd,   root: rootValue,
        rootIndexInInorder,  leftSize,  rightSize,  tree: root,  parent
      };

      const rightSubtree = yield* buildTree(
        preStart + leftSize + 1,  preEnd,
        rootIndexInInorder + 1, inEnd, root
      );
      root.right = rightSubtree;

      yield {
        type: "attach_right",
        message: `Attached right subtree to ${rootValue}`,
        preorder: preorder,
        inorder: inorder,
        preStart,  preEnd,  inStart,  inEnd,  root: rootValue,  tree: root,  parent
      };
    }

    yield {
      type: "complete_subtree",
      message: `Completed subtree rooted at ${rootValue}`,
      preorder: preorder,
      inorder: inorder,   preStart,   preEnd,   inStart,   inEnd,   root: rootValue,   tree: root,   parent
    };
    return root;
  }

  yield {
    type: "start",
    message: `Starting to build tree from preorder: [${preorder.join(", ")}] and inorder: [${inorder.join(", ")}]`,
    preorder: preorder,  inorder: inorder, tree: null
  };
  const root = yield* buildTree(0, preorder.length - 1, 0, inorder.length - 1);

  yield {
    type: "complete",
    message: "Tree construction complete!",
    preorder: preorder, inorder: inorder, tree: root
  };
  return root;
}
export function cloneTree(node) {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    id: node.id
  };
}
