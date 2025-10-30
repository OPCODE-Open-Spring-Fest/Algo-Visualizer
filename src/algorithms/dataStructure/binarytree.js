// src/algorithms/dataStructure/binarytree.js
// Generator that yields step objects for visualization for Binary Tree and BST.
// Each yielded step:
// {
//   tree: <deep clone root>,
//   nodesById: { id: { value, id, leftId, rightId } },
//   highlight: { type, id?, message?, path? },
//   message?: string,
//   done?: boolean
// }

let GLOBAL_ID = 1;
function nextId() {
  return `n${GLOBAL_ID++}`;
}

export function resetIdCounter() {
  GLOBAL_ID = 1;
}

function cloneNode(node) {
  if (!node) return null;
  const cloned = { id: node.id, value: node.value, left: null, right: null };
  cloned.left = cloneNode(node.left);
  cloned.right = cloneNode(node.right);
  return cloned;
}

function treeToMap(root) {
  const map = {};
  if (!root) return map;
  const q = [root];
  while (q.length) {
    const n = q.shift();
    map[n.id] = { id: n.id, value: n.value, leftId: n.left ? n.left.id : null, rightId: n.right ? n.right.id : null };
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return map;
}

// Build from level order array where null (or "-1") means no node
function buildTreeFromLevelOrderArr(arr) {
  if (!arr || arr.length === 0) return null;
  const nodes = arr.map((v) => (v === null ? null : { id: nextId(), value: v, left: null, right: null }));
  if (!nodes[0]) return null;
  let root = nodes[0];
  const q = [root];
  let i = 1;
  while (q.length && i < nodes.length) {
    const cur = q.shift();
    // left
    if (i < nodes.length) {
      cur.left = nodes[i] || null;
      if (cur.left) q.push(cur.left);
      i++;
    }
    // right
    if (i < nodes.length) {
      cur.right = nodes[i] || null;
      if (cur.right) q.push(cur.right);
      i++;
    }
  }
  return root;
}

// Helper: BFS find node by value (first match). Returns { node, parent, dir, path }
function findNodeByValue(root, value) {
  if (!root) return { node: null, parent: null, dir: null, path: [] };
  const q = [{ node: root, parent: null, dir: null, path: [root.id] }];
  while (q.length) {
    const { node, parent, dir, path } = q.shift();
    if (String(node.value) === String(value)) return { node, parent, dir, path: [...path] };
    if (node.left) q.push({ node: node.left, parent: node, dir: "left", path: path.concat(node.left.id) });
    if (node.right) q.push({ node: node.right, parent: node, dir: "right", path: path.concat(node.right.id) });
  }
  return { node: null, parent: null, dir: null, path: [] };
}

// Helper: find deepest node and its parent
function findDeepestNode(root) {
  if (!root) return { deepest: null, parent: null, dir: null, path: [] };
  const queue = [{ node: root, parent: null, dir: null, path: [root.id] }];
  let last = null;
  while (queue.length) {
    last = queue.shift();
    if (last.node.left) queue.push({ node: last.node.left, parent: last.node, dir: "left", path: last.path.concat(last.node.left.id) });
    if (last.node.right) queue.push({ node: last.node.right, parent: last.node, dir: "right", path: last.path.concat(last.node.right.id) });
  }
  return { deepest: last.node, parent: last.parent, dir: last.dir, path: last.path || [last.node.id] };
}

// Helper: find node value by id (search tree)
function findValueById(root, id) {
  if (!root || !id) return null;
  const q = [root];
  while (q.length) {
    const n = q.shift();
    if (String(n.id) === String(id)) return n.value;
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return null;
}

// BST insert with callback to record steps (cb(type, id, message, path))
// returns newRoot (root may be replaced if previously null)
function bstInsert(root, value, cb) {
  const newNode = { id: nextId(), value, left: null, right: null };
  if (!root) {
    // do not call cb with a snapshot that expects "root" to be set (outer code will push snapshot)
    // simply return new node so caller can set root and emit snapshot
    return newNode;
  }
  let cur = root;
  const pathIds = [];
  while (true) {
    pathIds.push(cur.id);
    if (String(value) === String(cur.value)) {
      if (cb) cb("compare", cur.id, `Duplicate ${value} found — ignoring`, [...pathIds]);
      return root;
    } else if ((!isNaN(Number(value)) && !isNaN(Number(cur.value)) && Number(value) < Number(cur.value)) || (isNaN(Number(value)) || isNaN(Number(cur.value)) && String(value) < String(cur.value))) {
      if (cb) cb("compare", cur.id, `Compare ${value} < ${cur.value} → go left`, [...pathIds]);
      if (!cur.left) {
        cur.left = newNode;
        if (cb) cb("insert", newNode.id, `Inserted ${value} as left child of ${cur.value}`, pathIds.concat(newNode.id));
        return root;
      }
      cur = cur.left;
    } else {
      if (cb) cb("compare", cur.id, `Compare ${value} > ${cur.value} → go right`, [...pathIds]);
      if (!cur.right) {
        cur.right = newNode;
        if (cb) cb("insert", newNode.id, `Inserted ${value} as right child of ${cur.value}`, pathIds.concat(newNode.id));
        return root;
      }
      cur = cur.right;
    }
  }
}

// BST search: returns { node, pathIds }
function bstSearch(root, value, cb) {
  let cur = root;
  const path = [];
  while (cur) {
    path.push(cur.id);
    if (cb) cb("compare", cur.id, `Compare with ${cur.value}`, [...path]);
    if (String(cur.value) === String(value)) {
      if (cb) cb("found", cur.id, `Found ${value}`, [...path]);
      return { node: cur, path };
    }
    if ((!isNaN(Number(value)) && !isNaN(Number(cur.value)) && Number(value) < Number(cur.value)) || (isNaN(Number(value)) || isNaN(Number(cur.value)) && String(value) < String(cur.value))) cur = cur.left;
    else cur = cur.right;
  }
  if (cb) cb("notfound", null, `Value ${value} not found`, [...path]);
  return { node: null, path };
}

// BST delete: returns new root
function bstDelete(root, value, cb) {
  let parent = null;
  let cur = root;
  const path = [];
  while (cur && String(cur.value) !== String(value)) {
    path.push(cur.id);
    if (cb) cb("compare", cur.id, `Compare ${value} with ${cur.value}`, [...path]);
    parent = cur;
    if ((!isNaN(Number(value)) && !isNaN(Number(cur.value)) && Number(value) < Number(cur.value)) || (isNaN(Number(value)) || isNaN(Number(cur.value)) && String(value) < String(cur.value))) cur = cur.left;
    else cur = cur.right;
  }
  if (!cur) {
    if (cb) cb("error", null, `Value ${value} not found for deletion`, [...path]);
    return root;
  }
  if (cb) cb("delete", cur.id, `Deleting ${cur.value}`, [...path]);

  // 0 or 1 child
  if (!cur.left || !cur.right) {
    const child = cur.left ? cur.left : cur.right;
    if (!parent) {
      if (cb) cb("done", child ? child.id : null, `Replaced root with ${child ? child.value : 'null'}`, [...path]);
      return child;
    } else {
      if (parent.left === cur) parent.left = child;
      else parent.right = child;
      if (cb) cb("done", null, `Deleted ${cur.value}`, [...path]);
      return root;
    }
  }

  // two children: successor
  let succParent = cur;
  let succ = cur.right;
  const succPath = [...path, succ.id];
  while (succ.left) {
    succParent = succ;
    succ = succ.left;
    succPath.push(succ.id);
  }
  if (cb) cb("compare", succ.id, `Successor: ${succ.value}`, succPath.slice());
  cur.value = succ.value;
  if (succParent.left === succ) succParent.left = succ.right;
  else succParent.right = succ.right;
  if (cb) cb("done", null, `Replaced and removed successor ${succ.value}`, succPath.slice());
  return root;
}

// Binary tree delete - replace with deepest node
function binaryTreeDelete(root, value, cb) {
  if (!root) {
    if (cb) cb("error", null, "Tree empty", []);
    return null;
  }
  const q = [{ node: root, parent: null, dir: null, path: [root.id] }];
  let target = null, targetParent = null, targetDir = null, targetPath = [];
  while (q.length) {
    const { node, parent, dir, path } = q.shift();
    if (String(node.value) === String(value)) {
      target = node; targetParent = parent; targetDir = dir; targetPath = [...path];
      if (cb) cb("delete", node.id, `Will delete ${node.value}`, [...path]);
      break;
    }
    if (node.left) q.push({ node: node.left, parent: node, dir: "left", path: path.concat(node.left.id) });
    if (node.right) q.push({ node: node.right, parent: node, dir: "right", path: path.concat(node.right.id) });
  }
  if (!target) {
    if (cb) cb("error", null, `Value ${value} not found`, []);
    return root;
  }

  const queue = [{ node: root, parent: null, dir: null, path: [root.id] }];
  let last = null;
  while (queue.length) {
    last = queue.shift();
    if (last.node.left) queue.push({ node: last.node.left, parent: last.node, dir: "left", path: last.path.concat(last.node.left.id) });
    if (last.node.right) queue.push({ node: last.node.right, parent: last.node, dir: "right", path: last.path.concat(last.node.right.id) });
  }
  const deepest = last.node;
  const deepestParent = last.parent;

  if (cb) cb("compare", deepest.id, `Deepest node: ${deepest.value}`, [deepest.id]);

  if (target === deepest) {
    if (!targetParent) {
      if (cb) cb("done", null, `Removed root ${target.value}`, []);
      return null;
    } else {
      if (targetParent.left === target) targetParent.left = null;
      else targetParent.right = null;
      if (cb) cb("done", null, `Deleted ${target.value}`, []);
      return root;
    }
  }

  const replacedValue = deepest.value;
  if (cb) cb("compare", deepest.id, `Replacing ${target.value} with ${deepest.value}`, [target.id, deepest.id]);
  target.value = deepest.value;
  if (deepestParent) {
    if (deepestParent.left === deepest) deepestParent.left = null;
    else deepestParent.right = null;
  }
  if (cb) cb("done", null, `Replaced ${value} with ${replacedValue} and removed deepest node`, []);
  return root;
}

// Traversals
function traverseInorder(node, cb, path = []) {
  if (!node) return;
  traverseInorder(node.left, cb, path);
  path.push(node.id);
  if (cb) cb("traverse", node.id, `Visit ${node.value}`, [...path]);
  traverseInorder(node.right, cb, path);
}
function traversePreorder(node, cb, path = []) {
  if (!node) return;
  path.push(node.id);
  if (cb) cb("traverse", node.id, `Visit ${node.value}`, [...path]);
  traversePreorder(node.left, cb, path);
  traversePreorder(node.right, cb, path);
}
function traversePostorder(node, cb, path = []) {
  if (!node) return;
  traversePostorder(node.left, cb, path);
  traversePostorder(node.right, cb, path);
  path.push(node.id);
  if (cb) cb("traverse", node.id, `Visit ${node.value}`, [...path]);
}
function traverseLevelOrder(root, cb) {
  if (!root) return;
  const q = [root];
  const path = [];
  while (q.length) {
    const n = q.shift();
    path.push(n.id);
    if (cb) cb("traverse", n.id, `Visit ${n.value}`, [...path]);
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
}

// Generator export
export function* binaryTreeOp(startRoot = null, action = {}) {
  // clone startRoot to work on
  let root = startRoot ? cloneNode(startRoot) : null;

  const pushSnapshot = (type, id = null, message = null, path = null, done = false) => {
    const snapshot = cloneNode(root);
    const nodesById = treeToMap(snapshot);
    const step = { tree: snapshot, nodesById, highlight: { type, id, message, path: path || (id ? [id] : []) }, message };
    if (done) step.done = true;
    return step;
  };

  let pending = [];
  const cb = (type, id, message, path) => {
    pending.push(pushSnapshot(type, id, message, path, false));
  };
  function* flushPending() {
    while (pending.length) yield pending.shift();
  }

  const type = action.type;

  switch (type) {
    case "buildTree": {
      root = null;
      yield pushSnapshot("clear", null, "Clearing existing tree before build", null, false);

      const list = (action.list || []).map((v) => {
        if (v === null) return null;
        if (typeof v === "string") {
          const s = v.trim();
          if (s === "-1" || s === "") return null;
          return isNaN(s) ? s : Number(s);
        }
        return v;
      });

      for (let i = 0; i < list.length; i++) {
        const partial = list.slice(0, i + 1);
        root = buildTreeFromLevelOrderArr(partial);
        const v = list[i];
        if (v === null) yield pushSnapshot("insert", null, `Skipped null at step ${i}`, null, false);
        else {
          const found = findNodeByValue(root, v);
          yield pushSnapshot("insert", found.node?.id ?? null, `Inserted ${v} (build step ${i})`, found.path ?? null, false);
        }
      }
      yield pushSnapshot("done", null, "Build complete", null, true);
      break;
    }

    case "insert": {
      const value = action.value;
      const treeType = action.treeType || "binary";
      if (value === undefined || value === null || String(value).trim() === "") {
        yield pushSnapshot("error", null, "No value provided for insert", null, true);
        return;
      }
      pending = [];
      if (treeType === "bst") {
        const hadRoot = !!root;
        root = bstInsert(root, value, cb);
        // If tree was empty before insert, bstInsert returned the new node as root
        if (!hadRoot && root) {
          // push a proper snapshot showing the new root inserted
          pending.push(pushSnapshot("insert", root.id, `Inserted ${value} as root`, [root.id], false));
        }
        for (const s of yield* flushPending()) yield s;
        yield pushSnapshot("done", null, `Inserted ${value} into BST`, null, true);
      } else {
        // Binary tree insert level-order
        if (!root) {
          root = { id: nextId(), value, left: null, right: null };
          yield pushSnapshot("insert", root.id, `Inserted ${value} as root`, [root.id], false);
          yield pushSnapshot("done", root.id, `Inserted ${value}`, null, true);
        } else {
          // BFS to find vacancy and yield compare steps along the way
          const q = [root];
          let inserted = false;
          while (q.length) {
            const node = q.shift();
            // yield compare for node
            pending.push(pushSnapshot("compare", node.id, `Checking ${node.value} for vacancy`, [node.id]));
            if (!node.left) {
              const newNode = { id: nextId(), value, left: null, right: null };
              node.left = newNode;
              pending.push(pushSnapshot("insert", newNode.id, `Inserted ${value} as left child of ${node.value}`, [node.id, newNode.id]));
              inserted = true;
              break;
            } else q.push(node.left);

            if (!node.right) {
              const newNode = { id: nextId(), value, left: null, right: null };
              node.right = newNode;
              pending.push(pushSnapshot("insert", newNode.id, `Inserted ${value} as right child of ${node.value}`, [node.id, newNode.id]));
              inserted = true;
              break;
            } else q.push(node.right);
          }
          if (!inserted) {
            // fallback (rare)
            root = { id: nextId(), value, left: root, right: null };
            pending.push(pushSnapshot("insert", root.id, `Inserted ${value} as fallback root`, [root.id]));
          }
          for (const s of yield* flushPending()) yield s;
          yield pushSnapshot("done", null, `Inserted ${value}`, null, true);
        }
      }
      break;
    }

    case "search": {
      const value = action.value;
      const treeType = action.treeType || "binary";
      if (value === undefined || value === null || String(value).trim() === "") { yield pushSnapshot("error", null, "No value provided for search", null, true); return; }
      if (!root) { yield pushSnapshot("error", null, "Tree empty", null, true); return; }

      pending = [];
      if (treeType === "bst") {
        const res = bstSearch(root, value, cb); // returns { node, path }
        for (const s of yield* flushPending()) yield s;

        // Compose traversal values from path
        const visitedValues = res.path.map((id) => findValueById(root, id)).filter((v) => v !== undefined && v !== null);
        if (res.node) {
          // found
          yield pushSnapshot("found", res.node.id, `Found ${value}. Visited: ${visitedValues.join(", ")}`, res.path, true);
        } else {
          yield pushSnapshot("notfound", null, `Not found ${value}. Visited: ${visitedValues.join(", ")}`, res.path, true);
        }
      } else {
        const q = [{ node: root, path: [root.id] }];
        const visitedIds = [];
        let found = null;
        while (q.length) {
          const { node, path } = q.shift();
          visitedIds.push(node.id);
          yield pushSnapshot("compare", node.id, `Comparing ${value} with ${node.value}`, [...path]);
          if (String(node.value) === String(value)) {
            found = { node, path };
            yield pushSnapshot("found", node.id, `Found ${value}`, [...path]);
            break;
          }
          if (node.left) q.push({ node: node.left, path: path.concat(node.left.id) });
          if (node.right) q.push({ node: node.right, path: path.concat(node.right.id) });
        }
        const visitedValues = visitedIds.map((id) => findValueById(root, id));
        if (found) {
          yield pushSnapshot("done", found.node.id, `Found ${value}. Visited: ${visitedValues.join(", ")}`, found.path, true);
        } else {
          yield pushSnapshot("notfound", null, `Not found ${value}. Visited: ${visitedValues.join(", ")}`, visitedIds, true);
        }
      }
      break;
    }

    case "delete": {
      const value = action.value;
      const treeType = action.treeType || "binary";
      if (value === undefined || value === null || String(value).trim() === "") { yield pushSnapshot("error", null, "No value provided for delete", null, true); return; }
      if (!root) { yield pushSnapshot("error", null, "Tree empty", null, true); return; }
      pending = [];
      if (treeType === "bst") {
        root = bstDelete(root, value, cb);
        for (const s of yield* flushPending()) yield s;
        yield pushSnapshot("done", null, `Delete complete`, null, true);
      } else {
        root = binaryTreeDelete(root, value, cb);
        for (const s of yield* flushPending()) yield s;
        yield pushSnapshot("done", null, `Delete complete`, null, true);
      }
      break;
    }

    case "traverse": {
      const order = action.order || "inorder";
      if (!root) { yield pushSnapshot("error", null, "Tree empty", null, true); return; }
      yield pushSnapshot("message", null, `Starting ${order} traversal`, null, false);
      pending = [];
      if (order === "inorder") traverseInorder(root, cb, []);
      else if (order === "preorder") traversePreorder(root, cb, []);
      else if (order === "postorder") traversePostorder(root, cb, []);
      else traverseLevelOrder(root, cb);
      for (const s of yield* flushPending()) yield s;

      // produce final traversal values to show as message
      let finalVisited = [];
      if (order === "inorder") {
        const arr = []; function collectIn(n){ if(!n) return; collectIn(n.left); arr.push(n.value); collectIn(n.right); } collectIn(root); finalVisited = arr;
      } else if (order === "preorder") {
        const arr = []; function collectPre(n){ if(!n) return; arr.push(n.value); collectPre(n.left); collectPre(n.right);} collectPre(root); finalVisited = arr;
      } else if (order === "postorder") {
        const arr = []; function collectPost(n){ if(!n) return; collectPost(n.left); collectPost(n.right); arr.push(n.value);} collectPost(root); finalVisited = arr;
      } else {
        const arr = []; const q = [root]; while(q.length){ const n=q.shift(); arr.push(n.value); if(n.left) q.push(n.left); if(n.right) q.push(n.right);} finalVisited = arr;
      }

      yield pushSnapshot("done", null, `${order} traversal complete: ${finalVisited.join(", ")}`, null, true);
      break;
    }

    case "clear": {
      root = null;
      yield pushSnapshot("clear", null, "Cleared tree", null, true);
      break;
    }

    case "loadDemo": {
      root = null;
      yield pushSnapshot("clear", null, "Clearing existing tree before loading demo", null, false);
      const demo = action.demo || ["10", "5", "15", "3", "7", "-1", "20"];
      const normalized = demo.map((v) => (String(v).trim() === "-1" ? null : (isNaN(v) ? v : Number(v))));
      for (let i = 0; i < normalized.length; i++) {
        const arrPartial = normalized.slice(0, i + 1);
        root = buildTreeFromLevelOrderArr(arrPartial);
        const v = normalized[i];
        if (v !== null) {
          const found = findNodeByValue(root, v);
          yield pushSnapshot("insert", found.node?.id ?? null, `Loaded ${v} (demo step ${i})`, found.path ?? null, false);
        } else yield pushSnapshot("insert", null, `Skipped null at step ${i}`, null, false);
      }
      yield pushSnapshot("done", null, "Demo load complete", null, true);
      break;
    }

    default:
      yield pushSnapshot("done", null, "No-op", null, true);
      break;
  }
}
