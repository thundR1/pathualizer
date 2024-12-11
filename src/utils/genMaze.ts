const ROWS = 33;
const COLS = 33;

const directions: [number, number][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

function isValidMove(row: number, col: number) {
  return row >= 4 && row < ROWS - 1 && col >= 1 && col < COLS - 1;
}

function shuffle(directions: [number, number][]) {
  const shuffledDirections = [...directions];
  for (let i = directions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDirections[i], shuffledDirections[j]] = [
      shuffledDirections[j],
      shuffledDirections[i],
    ];
  }
  return shuffledDirections;
}

export function genMaze(): string[] {
  const maze = Array.from({ length: ROWS }, () => Array(COLS).fill(1));
  function makePath(x: number, y: number) {
    maze[x][y] = 0;
    const shuffledDirections = shuffle(directions);
    for (const [dx, dy] of shuffledDirections) {
      const newX = x + 2 * dx;
      const newY = y + 2 * dy;
      if (isValidMove(newX, newY) && maze[newX][newY] === 1) {
        maze[x + dx][y + dy] = 0;
        makePath(newX, newY);
      }
    }
  }
  makePath(4, 1);
  const nodeToAnimate: string[] = [];
  for (let i = 3; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (i === 3 || i === ROWS - 1 || j === 0 || j === COLS - 1)
        nodeToAnimate.push(`${i}-${j}`);
    }
  }

  for (let i = 4; i < ROWS - 1; i++) {
    for (let j = 1; j < COLS - 1; j++) {
      if (maze[i][j]) nodeToAnimate.push(`${i}-${j}`);
    }
  }

  return nodeToAnimate;
}
