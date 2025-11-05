export function towerOfHanoiVisualizerSteps(N) {
  const steps = [];
  const moves = [];
  const rods = {
    A: Array.from({ length: N }, (_, i) => N - i),
    B: [],
    C: [],
  };

  function cloneRods() {
    return {
      A: [...rods.A],
      B: [...rods.B],
      C: [...rods.C],
    };
  }

  function move(n, from, to, aux) {
    if (n === 1) {
      const disk = rods[from].pop();
      rods[to].push(disk);
      steps.push({
        type: "move",
        disk,
        from,
        to,
        rods: cloneRods(),
        message: `Move disk ${disk} from ${from} → ${to}`,
      });
      moves.push({ disk, from, to });
      return;
    }

    steps.push({
      type: "recursive-call",
      message: `Move ${n - 1} disks from ${from} → ${aux} using ${to} as auxiliary.`,
      rods: cloneRods(),
    });

    move(n - 1, from, aux, to);

    const disk = rods[from].pop();
    rods[to].push(disk);
    steps.push({
      type: "move",
      disk,
      from,
      to,
      rods: cloneRods(),
      message: `Move disk ${disk} from ${from} → ${to}`,
    });
    moves.push({ disk, from, to });

    steps.push({
      type: "recursive-call",
      message: `Move ${n - 1} disks from ${aux} → ${to} using ${from} as auxiliary.`,
      rods: cloneRods(),
    });

    move(n - 1, aux, to, from);
  }

  move(N, "A", "C", "B");

  return {
    steps,
    moves,
    moveCount: moves.length,
  };
}
