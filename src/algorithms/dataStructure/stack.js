export function* stackOp(array, action) {

  const arr = [...array];

  const snapshot = () => [...arr];

  switch (action?.type) {
    case "push": {
      yield { type: "push-start", value: action.value };
      arr.unshift(action.value);
      yield { type: "push", value: action.value, array: snapshot() };
      break;
    }

    case "pop": {
      if (arr.length === 0) {
        yield { type: "underflow" };
      } else {
        yield { type: "pop-start", index: 0, value: arr[0] };
        const popped = arr.shift();
        yield { type: "pop", value: popped, array: snapshot() };
      }
      break;
    }

    case "peek": {
      if (arr.length === 0) {
        yield { type: "peek-empty" };
      } else {
        yield { type: "peek", value: arr[0], index: 0 };
      }
      break;
    }

    case "clear": {
      if (arr.length === 0) {
        yield { type: "clear-empty" };
      } else {
        yield { type: "clear", array: [] };
        arr.length = 0;
      }
      break;
    }

    default: {
      yield { type: "invalid", action };
    }
  }

  yield { type: "done", array: snapshot() };
}
