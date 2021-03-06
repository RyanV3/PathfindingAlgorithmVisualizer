import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVis.css';

var START_NODE_ROW;
var START_NODE_COL;
var FINISH_NODE_ROW;
var FINISH_NODE_COL;

export default class PathfindingVis extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    if (!(row === START_NODE_ROW && col === START_NODE_COL) && !(row === FINISH_NODE_ROW && col === FINISH_NODE_COL)) {
      const newGrid = getNewGridWithWalls(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWalls(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  refreshPage() {
    window.location.reload(false);
  }
  

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node visitedNode';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node shortestPathNode';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    if ((typeof START_NODE_ROW !== 'undefined') && (typeof START_NODE_COL !== 'undefined') && 
        (typeof FINISH_NODE_ROW !== 'undefined') && (typeof FINISH_NODE_COL !== 'undefined')) {
      const {grid} = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }

  setStartAndFinish() {
    const {grid} = this.state;

    if ((typeof START_NODE_ROW !== 'undefined')){
      return;
    }

    if (document.getElementById('start-node-row').value && document.getElementById('start-node-col').value && 
        document.getElementById('end-node-row').value && document.getElementById('end-node-col').value){
      START_NODE_ROW = document.getElementById('start-node-row').value-1;
      START_NODE_COL = document.getElementById('start-node-col').value-1;
      FINISH_NODE_ROW = document.getElementById('end-node-row').value-1;
      FINISH_NODE_COL = document.getElementById('end-node-col').value-1;

      grid[START_NODE_ROW][START_NODE_COL].isWall = false;
      grid[FINISH_NODE_ROW][FINISH_NODE_COL].isWall = false;
      document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node startNode';
      document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node finishNode';

      //this.clearVisitedNodes(START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL);
    }
  }

  /*clearVisitedNodes(START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL) {
    const {grid} = this.state;

    for (let i = 0; i < grid[0].length-1; i++) {
      for (let j = 0; j < grid.length-1; j++) {
        if (!((i === START_NODE_ROW) && (j === START_NODE_COL)) && !((i === FINISH_NODE_ROW) && (j === FINISH_NODE_COL))) {
          document.getElementById(`node-${i}-${j}`).className = 'node';
        }
      }
    }
  }*/

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div id="banner">
          <button class="button" onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          <button class="reset-button" onClick={() => this.refreshPage()}>
            Reset
          </button>
          <div class="node-input-cont">
            End Node<br></br>
            <label for="end-node-row">row</label>
            <input type="number" id="end-node-row" min="1" max="20"></input>
            <label for="end-node-col">col</label>
            <input type="number" id="end-node-col" min="1" max="50"></input>
          </div>
          <div class="node-input-cont">
            Start Node<br></br>
            <label for="end-node-row">row</label>
            <input type="number" id="start-node-row" min="1" max="20"></input>
            <label for="end-node-col">col</label>
            <input type="number" id="start-node-col" min="1" max="50"></input>
          </div>
          <button class="set-start-end" onClick={() => this.setStartAndFinish()}>
            Set
          </button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWalls = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
