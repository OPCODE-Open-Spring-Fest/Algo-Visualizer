function isSafe(board, r, c, num) {
  for (let x = 0; x < 9; x++) {
    if (board[r][x] === num || board[x][c] === num) return false;
  }

  const startRow = r - (r % 3);
  const startCol = c - (c % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

export async function solveSudoku(board, visualizeStep, r = 0, c = 0) {
  if (r === 9) return true;
  if (c === 9) return await solveSudoku(board, visualizeStep, r + 1, 0);
  if (board[r][c] !== 0) return await solveSudoku(board, visualizeStep, r, c + 1);

  for (let num = 1; num <= 9; num++) {
    if (isSafe(board, r, c, num)) {
      board[r][c] = num;
      visualizeStep(r, c, num, "filled");
      await sleep(50);

      if (await solveSudoku(board, visualizeStep, r, c + 1)) return true;

      
      board[r][c] = 0;
      visualizeStep(r, c, 0, "backtrack");
      await sleep(50);
    } else {
      visualizeStep(r, c, num, "trying");
      await sleep(20);
    }
  }
  return false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
