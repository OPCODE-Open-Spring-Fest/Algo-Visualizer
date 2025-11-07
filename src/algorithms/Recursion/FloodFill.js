export function floodFill(mat, x, y, targetColor, newColor, steps = []) {
  const rows = mat.length;
  const cols = mat[0].length;

  if (x < 0 || y < 0 || x >= rows || y >= cols) return;
  if (mat[x][y] !== targetColor) return;

  steps.push({ x, y });

  mat[x][y] = newColor;

  floodFill(mat, x + 1, y, targetColor, newColor, steps);
  floodFill(mat, x - 1, y, targetColor, newColor, steps);
  floodFill(mat, x, y + 1, targetColor, newColor, steps);
  floodFill(mat, x, y - 1, targetColor, newColor, steps);

  return steps;
}
