export function mazeSolverSteps(grid, start, end, allowDiagonal = false) {
  const rows = grid.length;
  const cols = grid[0].length;

  const steps = [];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const directions = allowDiagonal ? [[0, 1], [1, 0], [0, -1], [-1, 0],[1, 1], [1, -1], [-1, 1], [-1, -1],]
    : [[0, 1], [1, 0], [0, -1], [-1, 0]];

  const queue = [];
  queue.push(start);
  visited[start[0]][start[1]] = true;

  let solutionFound = false;

  while (queue.length > 0){
    const [r, c] = queue.shift();
    //exploring cell
    steps.push({ type: "explore", row: r, col: c, visited: visited.map(v => [...v]),
      grid: cloneGrid(grid),
      message: `Exploring cell (${r}, ${c}).`,
    });

    if (r === end[0] && c === end[1]) {
      solutionFound = true;
      steps.push({ type: "found",row: r,col: c,visited: visited.map(v => [...v]),
        grid: cloneGrid(grid),
        message: `Reached end (${r}, ${c}) — shortest path found!`,
      });
      break;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if(nr>=0 &&nc >= 0 && nr<rows && nc<cols && grid[nr][nc]!==1 && !visited[nr][nc]) {
        visited[nr][nc] = true;
        parent[nr][nc] = [r, c];
        queue.push([nr, nc]);

        steps.push({ type: "enqueue", row: nr,col: nc, visited: visited.map(v => [...v]),
          grid: cloneGrid(grid),
          message: `Adding cell (${nr}, ${nc}) to queue.`,
        });
      }
    }
  }
  //reconstruct shortest path
  const path = [];
  if (solutionFound) {
    let node = end;
    while (node) {
      path.unshift(node);
      node = parent[node[0]][node[1]];
    }

    for (const [r, c] of path) {
      steps.push({type: "path_cell",row: r,col: c,visited: visited.map(v => [...v]),
        grid: cloneGrid(grid),
        path: [...path],
        message: `Cell (${r}, ${c}) is part of the shortest path.`,
      });
    }
  } else {
    steps.push({ type: "no_path", row: null,col: null,visited: visited.map(v => [...v]),
      grid: cloneGrid(grid),
      message: "No path possible between Start and End points.",
    });
  }

  return {steps,solutionFound,path};
}

function cloneGrid(grid) {
  return grid.map(row => [...row]);
}