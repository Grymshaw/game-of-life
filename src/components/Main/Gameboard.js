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
    if(!game.liveSquares) {
      game.liveSquares = this.randomizeBoard();
    }
    this.state = { game };

    this.interval = setInterval(this.getNextBoard, game.speed);
  }

  componentWillReceiveProps(nextProps) {
    //change speed of cycle
    if(nextProps.speed !== this.props.speed) {
      clearInterval(this.interval);
      this.interval = setInterval(this.getNextBoard, nextProps.speed);
    }
  }

  getNextBoard() {
    const game = this.state.game;
    let liveSquares = game.liveSquares;

    const liveRows = Object.keys(liveSquares);
    const allPotentialSquares = liveRows.reduce((acc, y) => {
      //inialize rows for potential squares
      acc[y - 1] = acc[y - 1] || [];
      acc[y] = [];
      acc[y + 1] = acc[y + 1] || [];
      //add possible x values to each row
      liveSquares[y].map((x) => {
        const adjacentSquares = this.getAdjacentSquares(x, y);
        if(adjacentSquares[y - 1])
          acc[y - 1].concat(adjacentSquares[y - 1].filter( val => !acc[y - 1].includes(val) ));
        if(adjacentSquares[y])
          acc[y].concat(adjacentSquares[y].filter( val => !acc[y].includes(val) ));
        if(adjacentSquares[y + 1])
          acc[y + 1].concat(adjacentSquares[y + 1].filter( val => !acc[y + 1].includes(val) ));
      });
      return acc;
    }, {});

    const newLiveSquares = {};
    Object.keys(allPotentialSquares).map((y, i , arr) => {
      newLiveSquares[y] = allPotentialSquares[y].filter((x) => {
        const numLive = this.countAdjacentLivingSquares(x, y);
        //square is live
        if (liveSquares[y] && liveSquares[y].includes(x)) {
          return numLive === 2 || numLive === 3;
        } else {
          //square is dead
          return numLive === 3;
        }
      });
    });

    //update game state
    game.liveSquares = newLiveSquares;
    game.generations++;
    this.props.update(game);

  }

  randomizeBoard() {
    const game = this.props.game;
    const liveSquares = {};
    for(let y = 0; y < game.height; y++) {
      //add a string property for each row
      liveSquares[`${y}`] = [];
      for(let x = 0; x < game.width; x++) {
        if( Math.round(Math.random()) === 1 ) {
          liveSquares[`${y}`].push(x);
        }
      }
    }
    return liveSquares;
  }

  getAdjacentSquares(x, y) {
    y = parseInt(y);
    const game = this.state.game;
    const adjacentSquares = {
      [`${y-1}`]: [x-1, x, x+1],
      [`${y}`]: [x-1, x, x+1],
      [`${y+1}`]: [x-1, x, x+1]
    };
    const rows = Object.keys(adjacentSquares);
    for(let i = 0; i < rows.length; i++) {
      if(parseInt(rows[i]) < 0 || parseInt(rows[i]) >= game.height) {
        delete adjacentSquares[i];
      } else {
        adjacentSquares[rows[i]] = adjacentSquares[rows[i]].filter(val => val >= 0 && val < game.width);
      }
    }
    return adjacentSquares;
  }

  arrayContainsArray(bigArr, littleArr) {
    for(let i = 0; i < bigArr.length; i++) {
      if(JSON.stringify(bigArr[i]) === JSON.stringify(littleArr))
        return true;
    }
    return false;
  }

  countAdjacentLivingSquares(x, y) {
    const liveSquares = this.state.game.liveSquares;
    const squaresToCheck = this.getAdjacentSquares(x, y);
    const rows = Object.keys(squaresToCheck);
    return rows.reduce((acc, y, i, arr) => {
      return acc + arr[y].reduce((subAcc, x) => {
        return subAcc + (liveSquares[i] ? (liveSquares[i].includes(x) ? 1 : 0) : 0);
      }, 0);
    }, 0);
  }

  render() {
    const game = this.state.game;
    const squares = [];
    for(let y = 0; y < game.height; y++) {
      for(let x = 0; x < game.width; x++) {
        squares.push([x, y]);
      }
    }

    return (
      <div>
        <GenerationCounter count={game.generations} />
        <div style={{width: `${10 * game.width}` , height: `${10 * game.height}`, display: 'flex', flexWrap: 'wrap'}}>
        {squares.map((coords) => {
            return (
              <GameSquare alive={game.liveSquares[coords[1]].includes(coords[0])}
              x={coords[0]}
              y={coords[1]}/>
            );
        })}
        </div>
      </div>
    );
  }
}
