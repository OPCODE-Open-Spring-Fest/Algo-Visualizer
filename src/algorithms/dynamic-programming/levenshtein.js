const calculateLevenshtein = (s1, s2, costs) => {
  const m = s1.length;
  const n = s2.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(null));

  for (let i = 0; i <= m; i++) dp[i][0] = i * costs.delete;
  for (let j = 0; j <= n; j++) dp[0][j] = j * costs.insert;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + costs.delete,
          dp[i][j - 1] + costs.insert,
          dp[i - 1][j - 1] + costs.replace
        );
      }
    }
  }
  return dp;
};

const getExplanation = (s1, s2, i, j, dp, costs) => {
  if (i === 0) {
    return {
      title: `Base case: Converting empty string to "${s2.substring(0, j)}"`,
      text: `We need ${j} insertions. Cost = ${j} × ${costs.insert} = ${
        j * costs.insert
      }`,
    };
  }
  if (j === 0) {
    return {
      title: `Base case: Converting "${s1.substring(0, i)}" to empty string`,
      text: `We need ${i} deletions. Cost = ${i} × ${costs.delete} = ${
        i * costs.delete
      }`,
    };
  }

  const char1 = s1[i - 1];
  const char2 = s2[j - 1];
  const match = char1 === char2;
  const deletion = dp[i - 1][j] + costs.delete;
  const insertion = dp[i][j - 1] + costs.insert;
  const substitution = dp[i - 1][j - 1] + (match ? 0 : costs.replace);

  let title = `Cell [${i}][${j}]: Comparing '${char1}' with '${char2}'`;
  let text = "";

  if (match) {
    text = `Characters match! We can skip (no operation).\n• Skip (diagonal): ${
      dp[i - 1][j - 1]
    } + 0 = ${substitution}\n• Delete '${char1}' (down): ${dp[i - 1][j]} + ${
      costs.delete
    } = ${deletion}\n• Insert '${char2}' (right): ${dp[i][j - 1]} + ${
      costs.insert
    } = ${insertion}\n✓ Best choice: Skip with cost = ${dp[i][j]}`;
  } else {
    text = `Characters don't match. We have three options:\n• Replace '${char1}' with '${char2}' (diagonal): ${
      dp[i - 1][j - 1]
    } + ${costs.replace} = ${substitution}\n• Delete '${char1}' (down): ${
      dp[i - 1][j]
    } + ${costs.delete} = ${deletion}\n• Insert '${char2}' (right): ${
      dp[i][j - 1]
    } + ${costs.insert} = ${insertion}\n`;
    const minCost = dp[i][j];
    let chosenOp = "";
    if (
      substitution === minCost &&
      substitution <= deletion &&
      substitution <= insertion
    ) {
      chosenOp = "Replace (diagonal)";
    } else if (insertion === minCost && insertion < deletion) {
      chosenOp = "Insert (right)";
    } else if (deletion === minCost) {
      chosenOp = "Delete (down)";
    }
    text += `✓ Best choice: ${chosenOp} with cost = ${minCost}`;
  }
  return { title, text };
};

const backtrackOperations = (s1, s2, dp, costs) => {
  const operations = [];
  const pathCells = [];
  let i = s1.length;
  let j = s2.length;

  pathCells.push([i, j]);

  while (i > 0 || j > 0) {
    let op;
    if (i === 0) {
      op = {
        op: "insert",
        char: s2[j - 1],
        pos: i,
        cells: [
          [i, j],
          [i, j - 1],
        ],
      };
      operations.unshift(op);
      j--;
    } else if (j === 0) {
      op = {
        op: "delete",
        char: s1[i - 1],
        pos: i,
        cells: [
          [i, j],
          [i - 1, j],
        ],
      };
      operations.unshift(op);
      i--;
    } else if (s1[i - 1] === s2[j - 1]) {
      op = {
        op: "skip",
        char: s1[i - 1],
        pos: i,
        cells: [
          [i, j],
          [i - 1, j - 1],
        ],
      };
      operations.unshift(op);
      i--;
      j--;
    } else {
      const repCost = dp[i - 1][j - 1] + costs.replace;
      const insCost = dp[i][j - 1] + costs.insert;
      const delCost = dp[i - 1][j] + costs.delete;

      if (repCost <= delCost && repCost <= insCost) {
        op = {
          op: "replace",
          from: s1[i - 1],
          to: s2[j - 1],
          pos: i,
          cells: [
            [i, j],
            [i - 1, j - 1],
          ],
        };
        operations.unshift(op);
        i--;
        j--;
      } else if (insCost < delCost) {
        op = {
          op: "insert",
          char: s2[j - 1],
          pos: i,
          cells: [
            [i, j],
            [i, j - 1],
          ],
        };
        operations.unshift(op);
        j--;
      } else {
        op = {
          op: "delete",
          char: s1[i - 1],
          pos: i,
          cells: [
            [i, j],
            [i - 1, j],
          ],
        };
        operations.unshift(op);
        i--;
      }
    }
    pathCells.push([i, j]);
  }

  return { operations, path: pathCells };
};

const processOperations = (ops, s1) => {
  let currentString = s1;
  return ops
    .map((op) => {
      const displayString = currentString;
      const actualPos = op.pos - (s1.length - currentString.length);

      let displayText = "";
      if (op.op === "replace") {
        displayText = `${displayString}: replace ${
          currentString[actualPos - 1]
        } with ${op.to} at position ${actualPos}`;
        currentString =
          currentString.substring(0, actualPos - 1) +
          op.to +
          currentString.substring(actualPos);
      } else if (op.op === "delete") {
        displayText = `${displayString}: delete ${
          currentString[actualPos - 1]
        } at position ${actualPos}`;
        currentString =
          currentString.substring(0, actualPos - 1) +
          currentString.substring(actualPos);
      } else if (op.op === "insert") {
        displayText = `${displayString}: insert ${op.char} at position ${actualPos}`;
        currentString =
          currentString.substring(0, actualPos) +
          op.char +
          currentString.substring(actualPos);
      } else if (op.op === "skip") {
        displayText = `${displayString}: don't change ${op.char} at position ${actualPos}`;
      }

      return { ...op, displayText, isSkip: op.op === "skip" };
    })
    .concat([
      {
        displayText: `${currentString}: (final result)`,
        isFinal: true,
        cells: [],
      },
    ]);
};

export {
  calculateLevenshtein,
  getExplanation,
  backtrackOperations,
  processOperations,
};
