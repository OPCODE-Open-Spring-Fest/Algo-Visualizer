export function* queueOp(array, action) {
  const arr = [...array];

  switch (action.type) {
    case "enqueue":
      arr.push(action.value);
      yield { type: "enqueue", array: [...arr] };
      break;

    case "dequeue":
      if (arr.length === 0) {
        yield { type: "error", message: "Queue is empty" };
        return;
      }
      arr.shift();
      yield { type: "dequeue", array: [...arr] };
      break;

    case "front":
      if (arr.length > 0) yield { type: "front", highlight: 0, array: [...arr] };
      else yield { type: "error", message: "Queue is empty" };
      break;

    case "clear":
      yield { type: "clear", array: [] };
      break;

    default:
      yield { type: "none", array: [...arr] };
  }

  yield { type: "done", array: [...arr] };
}
