import React from 'react';

import GameSquare from './GameSquare';
import GenerationCounter from './GenerationCounter';

export default class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    this.countAdjacentLivingSquares = this.countAdjacentLivingSquares.bind(this);
    this.getAdjacentSquares = this.getAdjacentSquares.bind(this);
    this.getNextBoard = this.getNextBoard.bind(this);

    const game = this.props.game;
    console.log(game);
    if(!game.board) {
      game.board = this.randomizeBoard();
    }
    this.state = { game };

    this.interval = setInterval(this.getNextBoard, game.speed);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.speed !== this.props.speed) {
      clearInterval(this.interval);
      this.interval = setInterval(this.getNextBoard, nextProps.speed);
    }
  }

  getNextSquare(value, numAdjacent) {
    if(value === 0 && numAdjacent === 3)
      return 1;
    if(value === 1 && (numAdjacent === 2 || numAdjacent === 3))
      return 1;
    return 0;
  }

  getNextBoard() {
    const game = this.state.game;
    const newBoard = JSON.parse(JSON.stringify(game.board));
    game.board.map((row, y) => {
      row.map((val, x) => {
        const numAdjacentLiving = this.countAdjacentLivingSquares(x, y);
        newBoard[y][x] = this.getNextSquare(val, numAdjacentLiving);
      });
    })
    game.board = newBoard;
    game.generations++;
    this.props.update(game);
  }

  randomizeBoard() {
    const game = this.props.game;
    const board = [];
    for(let y = 0; y < game.height; y++) {
      const row = [];
      for(let x = 0; x < game.width; x++) {
        row.push( Math.round(Math.random()) );
      }
      board.push(row);
    }
    return board;
  }

  getAdjacentSquares(x, y) {
    const game = this.state.game;
    const adjacentSquares = [
      [x-1, y-1],
      [x, y-1],
      [x+1, y-1],

      [x-1, y],
      [x+1, y],

      [x-1, y+1],
      [x, y+1],
      [x+1, y+1]
    ];
    return adjacentSquares.filter((val) => {
      return val[0] >= 0 && val[0] < game.width && val[1] >= 0 && val[1] < game.height;
    });
  }

  countAdjacentLivingSquares(x, y) {
    const game = this.state.game;
    const squaresToCheck = this.getAdjacentSquares(x, y);
    return squaresToCheck.reduce((acc, val) => {
      return acc + game.board[val[1]][val[0]];
    }, 0);
  }

  render() {
    const game = this.state.game;
    //clear interval if game is paused; set interval if not
    if(game.isPaused) {
      clearInterval(this.interval);
      this.interval = null;
    } else if (!game.isPaused && !this.interval) {
      this.interval = setInterval(this.getNextBoard, game.speed);
    }

    return (
      <div>
        <GenerationCounter count={game.generations} />
        <div style={{width: `${10 * game.width}` , height: `${10 * game.height}`, display: 'flex', flexWrap: 'wrap'}}>
        {
          game.board.map((row, y) => {
            return (
              row.map((val, x) => {
                return (
                  <GameSquare alive={val}
                    width={500 / game.width}
                    height={500 / game.height}
                    x={x}
                    y={y}
                    neighbours={this.countAdjacentLivingSquares(x, y)}
                  />
                );
              })
            );
          })
        }
        </div>
      </div>
    );
  }
}
