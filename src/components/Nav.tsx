import { useState } from "react";
import { genMaze } from "../utils/genMaze";

type NavProps = {
  setActiveCells: React.Dispatch<React.SetStateAction<Set<string>>>;
  setIsSelectingStartCell: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectingEndCell: React.Dispatch<React.SetStateAction<boolean>>;
  setStartBfs: React.Dispatch<React.SetStateAction<boolean>>;
  cellRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  startBfs: boolean;
  setMaze: React.Dispatch<React.SetStateAction<string[] | null>>;
  isDrawingMaze: boolean;
  setIsDrawingMaze: React.Dispatch<React.SetStateAction<boolean>>;
};

const Nav = ({
  setActiveCells,
  setIsSelectingStartCell,
  setIsSelectingEndCell,
  setStartBfs,
  cellRefs,
  startBfs,
  setMaze,
  isDrawingMaze,
  setIsDrawingMaze,
}: NavProps) => {
  const [selectedValue, setSelectedValue] = useState("");
  const clean = () => {
    cellRefs.current.forEach((el) => {
      el?.classList.remove("apply-visited-anim");
      el?.classList.remove("apply-bfspath-anim");
    });
  };

  const cleanMaze = () => {
    cellRefs.current.forEach((el) => {
      el?.classList.remove("apply-wall-anim");
      el?.classList.remove("maze-color");
    });
  };

  const handleClick = () => {
    clean();
    setActiveCells(() => new Set());
  };

  const handleStartCell = () => {
    setIsSelectingStartCell(true);
  };

  const handleEndCell = () => {
    setIsSelectingEndCell(true);
  };

  const handleBfs = () => {
    clean();
    setStartBfs(true);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(() => e.target.value);
  };

  const handleMaze = () => {
    handleClick();
    setIsDrawingMaze(true);
    setMaze(() => genMaze());
  };

  const handleClearMaze = () => {
    cleanMaze();
    setMaze(null);
  };

  const runSelectedAlgorithm = () => {
    switch (selectedValue) {
      case "bfs":
        handleBfs();
        break;
      default:
        break;
    }
  };

  return (
    <header className="absolute bg-slate-300 w-full h-[67px]">
      <div>
        <button
          onClick={handleClick}
          disabled={startBfs || isDrawingMaze}
          className={`absolute right-3 top-3 bg-yellow-400 p-2 px-3 font-semibold rounded-lg ${
            startBfs || isDrawingMaze ? "bg-disabled text-white" : ""
          }`}
        >
          Clear Grid
        </button>
        <button
          onClick={handleClearMaze}
          disabled={startBfs || isDrawingMaze}
          className={`absolute right-28 top-3 bg-purple-600 text-white p-2 px-3 font-semibold rounded-lg ${
            startBfs || isDrawingMaze ? "bg-disabled" : ""
          }`}
        >
          Clear Maze
        </button>
        <select
          value={selectedValue}
          onChange={handleSelectChange}
          className={`absolute top-3 bg-gray-700 text-white p-2 px-3 font-semibold rounded-lg right-56 ${
            startBfs || isDrawingMaze ? "bg-disabled" : ""
          }`}
          disabled={startBfs || isDrawingMaze}
        >
          <option className="bg-gray-500" value="">
            Select Algorithm
          </option>
          <option className="bg-gray-500" value="bfs">
            BFS
          </option>
        </select>
      </div>
      <div>
        <button
          onClick={handleStartCell}
          disabled={startBfs || isDrawingMaze}
          className={`absolute bg-green-500 top-3 p-2 px-3 font-semibold rounded-lg left-3 ${
            startBfs || isDrawingMaze ? "bg-disabled text-white" : ""
          }`}
        >
          Start Cell
        </button>
        <button
          onClick={handleEndCell}
          disabled={startBfs || isDrawingMaze}
          className={`absolute top-3 bg-red-600 text-white p-2 px-3 font-semibold rounded-lg left-28 ${
            startBfs || isDrawingMaze ? "bg-disabled" : ""
          }`}
        >
          Destination Cell
        </button>
        <button
          onClick={handleMaze}
          disabled={startBfs || isDrawingMaze}
          className={`absolute left-64 top-3 bg-purple-600 text-white p-2 px-3 font-semibold rounded-lg ${
            startBfs || isDrawingMaze ? "bg-disabled" : ""
          }`}
        >
          Generate Maze
        </button>
        <button
          onClick={runSelectedAlgorithm}
          className={`absolute top-3 bg-indigo-600 text-white p-2 px-6 font-semibold rounded-full left-[50%] ${
            startBfs || isDrawingMaze ? "bg-disabled" : ""
          }`}
          disabled={startBfs || isDrawingMaze}
        >
          Visualize!
        </button>
      </div>
    </header>
  );
};

export default Nav;
