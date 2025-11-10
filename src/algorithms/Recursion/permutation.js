export function generatePermutations(arr) {
  const steps = [];
  const result = [];

  function swap(a, i, j) {
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }

  function backtrack(a, index, depth) {
    steps.push({
      type: "recurse",
      array: [...a],
      index,
      depth
    });

    if (index === a.length) {
      result.push([...a]);
      steps.push({
        type: "output",
        array: [...a],
        depth
      });
      return;
    }

    for (let i = index; i < a.length; i++) {
      steps.push({
        type: "swap",
        array: [...a],
        i: index,
        j: i,
        depth
      });
      swap(a, index, i);
      backtrack(a, index + 1, depth + 1);
      steps.push({
        type: "backtrack",
        array: [...a],
        i: index,
        j: i,
        depth
      });

      swap(a, index, i);
    }
  }
 steps.push({
    type: "start",
    array: [...arr],
    depth: 0
  });
backtrack([...arr], 0, 0);
  return { steps, permutations: result };
}
