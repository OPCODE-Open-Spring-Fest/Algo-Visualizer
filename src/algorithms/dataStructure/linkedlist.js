// src/algorithms/dataStructure/linkedlist.js
// Generator that yields step objects for visualization.
// Each yield: { array, highlight: { type, index }, message?, done?:boolean }

export function* linkedListOp(startArray = [], action = {}) {
  // Work on a shallow copy
  const arr = [...startArray];
  const variant = action.variant || "singly"; // 'singly' | 'doubly' | 'circular'
  const direction = action.direction || "forward"; // for traverse in doubly

  const pushStep = (type, index = null, message = null) => {
    return { array: [...arr], highlight: index !== null ? { type, index } : { type }, message };
  };

  // small helper to clamp
  const validIndex = (i) => i >= 0 && i <= arr.length;

  switch (action.type) {
    case "insertHead": {
      arr.unshift(action.value);
      yield pushStep("insert", 0, `Inserted ${action.value} at head`);
      break;
    }

    case "insertTail": {
      arr.push(action.value);
      yield pushStep("insert", arr.length - 1, `Inserted ${action.value} at tail`);
      break;
    }

    case "insertAt": {
      const idx = Number.isFinite(action.index) ? action.index : arr.length;
      if (!validIndex(idx)) {
        yield { array: [...arr], highlight: { type: "error" }, message: "Index out of bounds" };
        return;
      }
      arr.splice(idx, 0, action.value);
      yield pushStep("insert", idx, `Inserted ${action.value} at index ${idx}`);
      break;
    }

    case "deleteHead": {
      if (arr.length === 0) {
        yield { array: [...arr], highlight: { type: "error" }, message: "List is empty" };
        return;
      }
      yield pushStep("delete", 0, `Deleting head (${arr[0]})`);
      arr.shift();
      yield pushStep("done", null, "Deleted head");
      break;
    }

    case "deleteTail": {
      if (arr.length === 0) {
        yield { array: [...arr], highlight: { type: "error" }, message: "List is empty" };
        return;
      }
      yield pushStep("delete", arr.length - 1, `Deleting tail (${arr[arr.length - 1]})`);
      arr.pop();
      yield pushStep("done", null, "Deleted tail");
      break;
    }

    case "deleteValue": {
      const idx = arr.indexOf(action.value);
      if (idx === -1) {
        yield { array: [...arr], highlight: { type: "error" }, message: `Value ${action.value} not found` };
        return;
      }
      yield pushStep("delete", idx, `Deleting value ${action.value} at index ${idx}`);
      arr.splice(idx, 1);
      yield pushStep("done", null, `Deleted ${action.value}`);
      break;
    }

    case "traverse": {
      if (arr.length === 0) {
        yield { array: [...arr], highlight: { type: "error" }, message: "Nothing to traverse" };
        return;
      }

      // For circular: traverse exactly arr.length nodes (one loop)
      // For doubly: support forward/backward via action.direction
      if (variant === "doubly" && direction === "backward") {
        // traverse from tail to head
        for (let i = arr.length - 1; i >= 0; i--) {
          yield pushStep("traverse", i, `Visiting index ${i}: ${arr[i]}`);
        }
      } else {
        // forward
        for (let i = 0; i < arr.length; i++) {
          yield pushStep("traverse", i, `Visiting index ${i}: ${arr[i]}`);
        }
      }

      // For circular, show extra step showing loop back to head
      if (variant === "circular" && arr.length > 0) {
        yield { array: [...arr], highlight: { type: "loop" }, message: "Looped back to head (circular)" };
      }

      yield { array: [...arr], highlight: { type: "done" }, done: true };
      break;
    }

    case "clear": {
      yield { array: [...arr], highlight: { type: "clear" }, message: "Clearing list..." };
      arr.length = 0;
      yield { array: [], highlight: { type: "done" }, done: true };
      break;
    }

    case "loadDemo": {
      const demo = action.demo || ["A", "B", "C"];
      arr.length = 0;
      for (let i = 0; i < demo.length; i++) {
        arr.push(demo[i]);
        yield pushStep("insert", i, `Loaded ${demo[i]}`);
      }
      yield { array: [...arr], highlight: { type: "done" }, done: true };
      break;
    }

    default:
      yield { array: [...arr], highlight: null, done: true };
      break;
  }
}
