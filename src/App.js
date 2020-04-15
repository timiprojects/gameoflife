import React, { useState, useCallback, useRef } from 'react';
import './App.css';
import Nodes from './components/Nodes'
import produce from 'immer'

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const numRows = 900 / 36
const numCols = 800 / 20

const createInitialGrid = () => {
  //console.log(args)
  const grid = [];
  for (let row = 0; row < numRows; row++) {
    grid.push(Array.from(Array(numCols), () => false))
  }
  return grid;
}

const CreateWallToggle = (g, row, col) => {

  const newGrid = produce(g, gcopy => {
    gcopy[row][col] = g[row][col] ? false : true
  })

  return newGrid;
}

function App() {

  const [grid, setGrid] = useState(() => {
    return createInitialGrid(0)
  })

  const [running, setRunning] = useState(false)
  const [pressed, setIsPressed] = useState(false)
  const [wall, setWall] = useState(false)

  const getRunning = useRef(running)
  getRunning.current = running

  const mouseIsDown = useRef(pressed)
  mouseIsDown.current = pressed

  const isWall = useRef(wall)
  isWall.current = wall

  const randomize = () => {
    const grid = [];
    for (let row = 0; row < numRows; row++) {
      grid.push(Array.from(Array(numCols), () => (Math.random() > 0.5 ? true : false)))
    }
    setGrid(grid);
  }

  const handleMouseDown = useCallback((row, col) => {
    if (getRunning.current) {
      return;
    }
    setIsPressed(!mouseIsDown.current)
    setGrid(CreateWallToggle(grid, row, col))
  }, [grid])

  const handleMouseEnter = useCallback((row, col) => {
    if (getRunning.current) {
      return;
    }

    if (!mouseIsDown.current) {
      return;
    }

    setGrid(CreateWallToggle(grid, row, col))
  }, [grid])

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const runGOL = useCallback(() => {
    if (!getRunning.current) {
      return;
    }
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              let newX = i + x
              let newY = j + y
              if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
                neighbors += g[newX][newY]
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              isWall.current = false
              gridCopy[i][j] = false;
              setWall(!isWall.current)
            } else if (g[i][j] === false && neighbors === 3) {
              isWall.current = true
              gridCopy[i][j] = true;
              setWall(isWall.current)
            }
          }
        }
      })
    })
    setTimeout(() => { runGOL()}, 100)
  }, [setWall])

  const startRunning = () => {
    setRunning(!running)
    setWall(!wall)
    if (!running) {
      getRunning.current = true;
      
      runGOL()
    } 
  }

  return (
    <div className="App">
      <button type="button" onClick={() => startRunning()}>{!running ? 'Start' : 'Stop'}</button>
      <button type="button" onClick={() => randomize()}>Randomize</button>
      <button type="button" onClick={() => setGrid(createInitialGrid())}>Clear Grid</button>
      <div className="Grid" style={{ gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
        {
          grid.map((rows, i) => {
            return rows.map((node, k) => {
              return (
                (
                  <Nodes key={`${i}-${k}`}
                    col={k}
                    row={i}
                    grid={grid}
                    wall={wall}
                    mouseDown={(row, col) => { handleMouseDown(row, col) }}
                    mouseEnter={(row, col) => {
                      handleMouseEnter(row, col)
                    }}
                    mouseUp={() => { handleMouseUp() }} />
                )
              )
            })
          })
        }
      </div>
    </div>
  );
}

export default App;
