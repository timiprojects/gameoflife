import React from 'react'
import './nodes.css'

function Nodes({ col, row, mouseDown, grid, mouseEnter, mouseUp, wall }) {
    //console.log(wall)
    //const extrastyle = isWall ? 'wall': 'normal'
    const extrastyle = (grid[row][col]) ? `wall ${!(wall) ? 'ex' : 'node-visited'}` : 'normal'

    return (
        <div id={`node-${row}-${col}`} className={`node ${extrastyle} ${grid[row][col]}`}
            onMouseDown={() => { mouseDown(row, col) }}
            onMouseEnter={() => { mouseEnter(row, col) }}
            onMouseUp={() => {mouseUp()}}
        >
        </div>
    )
}

export default React.memo(Nodes)