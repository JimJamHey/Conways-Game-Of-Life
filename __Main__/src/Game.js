import React, { useCallback, useState, useRef } from "react";
import produce from "immer";
import "./Game.css";

const numRows = 50;
const numCols = 50;

const gameOps = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
];

function Game() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  });

  const [gameRunning, setGameRunning] = useState(false);

  const runSimRef = useRef(gameRunning);
  runSimRef.current = gameRunning;

  const runSim = useCallback(() => {
    if (!runSimRef.current) {
      return;
    }

    setGrid((v) => {
      return produce(v, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let cellNeighbor = 0;
            gameOps.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                cellNeighbor += v[newI][newJ];
              }
            });

            if (cellNeighbor < 2 || cellNeighbor > 3) {
              gridCopy[i][j] = 0;
            } else if (v[i][j] === 0 && cellNeighbor === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSim, 1000); //100 ms
  }, []);

  return (
    <div className="Game-container">
      <h1 className="Game-title">Conway's Game of Life</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, rowI) =>
          rows.map((col, colI) => (
            <div
              key={`${rowI}-${colI}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[rowI][colI] = grid[rowI][colI] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rowI][colI] ? "black" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
      <button
        onClick={() => {
          setGameRunning(!gameRunning);
          if (!gameRunning) {
            runSimRef.current = true;
            runSim();
          }
        }}
      >
        {gameRunning ? "stop" : "start"}
      </button>
    </div>
  );
}

export default Game;
