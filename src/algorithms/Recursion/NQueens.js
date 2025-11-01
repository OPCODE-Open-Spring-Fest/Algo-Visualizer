export function nQueensVisualizerSteps(N) {
  const steps = [];
  const board = Array.from({ length: N }, () => Array(N).fill(0));
  const solutions = [];
  const cols = Array(N).fill(false);
  const diag1 = Array(2 * N).fill(false);
  const diag2 = Array(2 * N).fill(false);
  const stack = [];

  function cloneBoard(b) {
    return b.map(r => [...r]);
  }

  function solve(row) {
    if (row === N) {
      steps.push({
        type: "solution",
        board: cloneBoard(board),
        message: `Found valid solution!`,
        stack: [...stack],
        safe: true,
        solutionCount: solutions.length + 1
      });
      solutions.push(cloneBoard(board));
      return;
    }

    for (let col = 0; col < N; col++) {
      steps.push({
        type: "try",
        board: cloneBoard(board),
        row,
        col,
        message: `Trying to place Queen at (${row}, ${col})`,
        safe: null,
        stack: [...stack]
      });

      if (!cols[col] && !diag1[row - col + N] && !diag2[row + col]) {
        steps.push({
          type: "check",
          board: cloneBoard(board),
          row,
          col,
          safe: true,
          message: `Position (${row}, ${col}) is safe.`,
          stack: [...stack]
        });

        board[row][col] = 1;
        cols[col] = diag1[row - col + N] = diag2[row + col] = true;
        stack.push({ row, col });

        steps.push({
          type: "place",
          board: cloneBoard(board),
          row,
          col,
          message: `Placed Queen at (${row}, ${col}). Moving to next row.`,
          safe: true,
          stack: [...stack]
        });

        solve(row + 1);

        board[row][col] = 0;
        cols[col] = diag1[row - col + N] = diag2[row + col] = false;
        stack.pop();

        steps.push({
          type: "remove",
          board: cloneBoard(board),
          row,
          col,
          message: `Backtracking: Removed Queen from (${row}, ${col}).`,
          safe: false,
          stack: [...stack]
        });
      } else {
        steps.push({
          type: "check",
          board: cloneBoard(board),
          row,
          col,
          safe: false,
          message: `Conflict at (${row}, ${col}). Cannot place Queen here.`,
          stack: [...stack]
        });
      }
    }
  }

  solve(0);

  return {
    steps,
    solutions,
    solutionCount: solutions.length,
    solvable: solutions.length > 0,
  };
}
