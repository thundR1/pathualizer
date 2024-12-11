export type Position = {
  row: number;
  col: number;
};

type BfsRes = {
  bfsPath: Position[];
  nodesAnimationOrder: string[];
};

export const bfsOnGrid = (
  start: Position,
  end: Position,
  numRows: number,
  numCols: number,
  activeCells: Set<string>,
  maze: Set<string>
): BfsRes | null => {
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  const isValid = (pos: Position): boolean => {
    return (
      pos.row >= 3 &&
      pos.row < numRows &&
      pos.col >= 0 &&
      pos.col < numCols &&
      !activeCells.has(`${pos.row}-${pos.col}`) &&
      !maze.has(`${pos.row}-${pos.col}`)
    );
  };

  const queue: [Position, Position[]][] = [[start, [start]]];

  const visited = new Set<string>();
  visited.add(`${start.row}-${start.col}`);

  const nodesAnimationOrder: string[] = [];

  while (queue.length > 0) {
    const [currentPos, path] = queue.shift()!;

    nodesAnimationOrder.push(`${currentPos.row}-${currentPos.col}`);

    if (currentPos.row === end.row && currentPos.col === end.col) {
      return { bfsPath: path, nodesAnimationOrder };
    }

    for (const dir of directions) {
      const neighbor = {
        row: currentPos.row + dir.row,
        col: currentPos.col + dir.col,
      };

      if (
        isValid(neighbor) &&
        !visited.has(`${neighbor.row}-${neighbor.col}`)
      ) {
        visited.add(`${neighbor.row}-${neighbor.col}`);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null;
};
