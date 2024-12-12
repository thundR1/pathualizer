import { useEffect, useState, useRef } from "react";
import Nav from "./Nav";
import "../index.css";
import { bfsOnGrid } from "../utils/bfs";
import { type Position } from "../utils/bfs";

type GridProps = {
  rows: number;
  cols: number;
  gap?: number;
};

const Grid = ({ rows, cols, gap = 0 }: GridProps) => {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [activeCells, setActiveCells] = useState<Set<string>>(() => new Set());
  const [isActiveBeforeMouseDownToggle, setIsActiveBeforeMouseDownToggle] =
    useState<boolean>(false);
  const [isSelectingStartCell, setIsSelectingStartCell] =
    useState<boolean>(false);
  const [isSelectingEndCell, setIsSelectingEndCell] = useState<boolean>(false);
  const [startCellPos, setStartCellPos] = useState<Position | null>(null);
  const [endCellPos, setEndCellPos] = useState<Position | null>(null);
  const [startCellColor, setStartCellColor] = useState<string | null>(null);
  const [endCellColor, setEndCellColor] = useState<string | null>(null);
  const [startBfs, setStartBfs] = useState<boolean>(false);
  const [bfsPath, setBfsPath] = useState<Set<string> | null>(null);
  const [bfsVisitedCells, setBfsVisitedCells] = useState<string[] | null>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [maze, setMaze] = useState<string[] | null>(null);
  const [isDrawingMaze, setIsDrawingMaze] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (startBfs) {
      if (!startCellPos || !endCellPos) {
        setStartBfs(false);
        return;
      }
      const bfsRes = bfsOnGrid(
        startCellPos,
        endCellPos,
        rows,
        cols,
        activeCells,
        new Set(maze)
      );
      if (bfsRes) {
        const bfsPathSet: Set<string> = new Set();
        for (const pos of bfsRes.bfsPath) {
          bfsPathSet.add(`${pos.row}-${pos.col}`);
        }
        setBfsPath(() => bfsPathSet);
        setBfsVisitedCells(() => bfsRes.nodesAnimationOrder);
      } else {
        setBfsPath(null);
        setStartBfs(false);
      }
    }
  }, [startBfs]);

  useEffect(() => {
    if (bfsVisitedCells) {
      for (let i = 0; i < bfsVisitedCells.length; i++) {
        const currCellId = bfsVisitedCells[i];
        setTimeout(() => {
          cellRefs.current.forEach((el) => {
            if (el?.id === currCellId) {
              el.classList.add("apply-visited-anim");
              return;
            }
          });
        }, 15 * i);
      }
      const totalDelay = 15 * bfsVisitedCells.length;
      const path = Array.from(bfsPath!);
      setTimeout(() => {
        for (let i = 0; i < path.length; i++) {
          setTimeout(() => {
            cellRefs.current.forEach((val) => {
              if (path[i] === val?.id) {
                val.classList.replace(
                  "apply-visited-anim",
                  "apply-bfspath-anim"
                );
                return;
              }
            });
          }, 25 * i);
        }
      }, totalDelay);

      setTimeout(() => {
        setStartBfs(false);
      }, totalDelay + 25 * path.length);
    }
  }, [bfsVisitedCells]);

  useEffect(() => {
    if (maze) {
      if (startCellColor || endCellColor) {
        setStartCellColor(null);
        setEndCellColor(null);
      }
      for (let i = 0; i < maze.length; i++) {
        setTimeout(() => {
          cellRefs.current.forEach((el) => {
            if (el?.id === maze[i]) {
              el.classList.add("apply-wall-anim");
              el.classList.add("maze-color");
              return;
            }
          });
        }, 15 * i);
      }
      setTimeout(() => {
        setIsDrawingMaze(false);
      }, 15 * maze.length);
    }
    return () => {
      if (maze) {
        for (let i = 0; i < maze.length; i++) {
          cellRefs.current.forEach((el) => {
            if (el?.id === maze[i]) {
              el.classList.remove("apply-wall-anim");
              el.classList.remove("maze-color");
              return;
            }
          });
        }
      }
    };
  }, [maze]);

  const handleClick = (row: number, col: number) => {
    if (isSelectingStartCell) {
      if (activeCells.has(`${row}-${col}`) || maze?.includes(`${row}-${col}`))
        return;
      setStartCellPos(() => ({ row, col }));
      setIsSelectingStartCell(false);
    } else if (isSelectingEndCell) {
      if (activeCells.has(`${row}-${col}`) || maze?.includes(`${row}-${col}`))
        return;
      setEndCellPos(() => ({ row, col }));
      setIsSelectingEndCell(false);
    } else {
      if (!isActiveBeforeMouseDownToggle) return;
      setActiveCells((prev) => {
        const newActiveCells = new Set(prev);
        const cellId = `${row}-${col}`;
        if (newActiveCells.has(cellId)) {
          newActiveCells.delete(cellId);
        }
        return newActiveCells;
      });
    }
  };

  const toggleCell = (row: number, col: number) => {
    if (startCellPos && startCellPos.row === row && startCellPos.col === col)
      return;
    if (endCellPos && endCellPos.row === row && endCellPos.col === col) return;
    setActiveCells((prev) => {
      const cellId = `${row}-${col}`;
      const newActiveCells = new Set(prev);
      newActiveCells.add(cellId);
      return newActiveCells;
    });
  };

  const handleMouseDown = (row: number, col: number) => {
    if (maze?.includes(`${row}-${col}`)) return;
    if (!isSelectingStartCell && !isSelectingEndCell) {
      setIsMouseDown(true);
      if (activeCells.has(`${row}-${col}`)) {
        setIsActiveBeforeMouseDownToggle(true);
      } else {
        setIsActiveBeforeMouseDownToggle(false);
      }
      toggleCell(row, col);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelectingStartCell) {
      if (!maze?.includes(`${row}-${col}`)) setStartCellColor(`${row}-${col}`);
    } else if (isSelectingEndCell) {
      if (!maze?.includes(`${row}-${col}`)) setEndCellColor(`${row}-${col}`);
    } else {
      if (isMouseDown) {
        if (!maze) toggleCell(row, col);
      }
    }
  };

  return (
    <div
      className={`w-full h-screen grid overflow-hidden relative ${
        isDrawingMaze || startBfs ? "pointer-events-none" : ""
      }`}
      style={{
        gridTemplateRows: `repeat(${rows},1fr)`,
        gridTemplateColumns: `repeat(${cols},1fr)`,
        gap: `${gap}px`,
      }}
    >
      <Nav
        setActiveCells={setActiveCells}
        setIsSelectingStartCell={setIsSelectingStartCell}
        setIsSelectingEndCell={setIsSelectingEndCell}
        setStartBfs={setStartBfs}
        cellRefs={cellRefs}
        startBfs={startBfs}
        setMaze={setMaze}
        isDrawingMaze={isDrawingMaze}
        setIsDrawingMaze={setIsDrawingMaze}
      />
      {Array.from({ length: rows * cols }).map((_, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const isActive = activeCells.has(`${row}-${col}`);
        const strt = startCellColor === `${row}-${col}`;
        const end = endCellColor === `${row}-${col}`;
        return (
          <div
            id={`${row}-${col}`}
            ref={(el) => {
              cellRefs.current[idx] = el;
            }}
            key={idx}
            className={`outline outline-1 outline-[rgb(175,216,248)] min-w-[25px] ${
              isActive ? "bg-wall apply-wall-anim" : ""
            } ${strt ? "bg-green-500" : ""} ${end ? "bg-red-600" : ""}`}
            onMouseDown={(e) => {
              e.preventDefault();
              if (e.button === 0) handleMouseDown(row, col);
            }}
            onMouseEnter={() => {
              handleMouseEnter(row, col);
            }}
            onClick={() => handleClick(row, col)}
          ></div>
        );
      })}
    </div>
  );
};

export default Grid;
