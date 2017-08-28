import React from 'react';

import GameSquare from './GameSquare';
import GenerationCounter from './GenerationCounter';

export default class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    this.countAdjacentLivingSquares = this.countAdjacentLivingSquares.bind(this);
    this.getAdjacentSquares = this.getAdjacentSquares.bind(this);
    this.getNextBoard = this.getNextBoard.bind(this);

    const liveSquares = this.randomizeBoard();
    this.state = { liveSquares };

    this.interval = setInterval(this.getNextBoard, this.props.speed);
  }

  componentWillReceiveProps(nextProps) {
    //change speed of cycle
    if(nextProps.speed !== this.props.speed) {
      clearInterval(this.interval);
      this.interval = setInterval(this.getNextBoard, nextProps.speed);
    }
  }

  getNextBoard() {
    const game = this.props.game;
    let liveSquares = this.state.liveSquares;

    //get all potential squares
    const allPotentialSquares = liveSquares.reduce((acc, val) => {
      acc = acc.concat(this.getAdjacentSquares(val));
      return acc;
    }, [])
    .filter((val, i, arr) => { return arr.indexOf(val) === i; });

    //see which potential ones should be alive
    liveSquares = allPotentialSquares.filter((val) => {
      const numLive = this.countAdjacentLivingSquares(val);
      if(liveSquares.includes(val)) {
        //square was alive before
        return numLive === 2 || numLive === 3;
      } else {
        //square was dead before
        return numLive === 3;
      }
    });

    //update game state
    game.generations++;
    this.setState({ liveSquares });
    this.props.update(game);
  }

  randomizeBoard() {
    const game = this.props.game;
    const liveSquares = [];
    for(let y = 0; y < game.height; y++) {
      for(let x = 0; x < game.width; x++) {
        if( Math.round(Math.random()) === 1 ) {
          liveSquares.push(`${x},${y}`);
        }
      }
    }
    return liveSquares;
  }

  getAdjacentSquares(stringCoords) {
    const arrCoords = stringCoords.split(',');
    const x = parseInt(arrCoords[0]), y = parseInt(arrCoords[1]);
    const game = this.props.game;
    const adjacentSquaresArr = [
      [x-1, y-1], [x, y-1], [x+1, y-1],
      [x-1, y], [x+1, y],
      [x-1, y+1], [x, y+1], [x+1, y+1]
    ];
    return adjacentSquaresArr.filter((cur) => {
      return cur[0] >= 0 && cur[0] < game.width && cur[1] >= 0 && cur[1] < game.height;
    })
    .reduce((arr, cur) => {
      arr.push(cur.join(','));
      return arr;
    }, []);
  }

  countAdjacentLivingSquares(stringCoords) {
    const liveSquares = this.state.liveSquares;
    const squaresToCheck = this.getAdjacentSquares(stringCoords);
    return squaresToCheck.reduce((count, cur) => {
      return count + (liveSquares.includes(cur) ? 1 : 0);
    }, 0);
  }

  render() {
    const game = this.props.game;
    const liveSquares = this.state.liveSquares;
    const squares = [];
    for(let y = 0; y < game.height; y++) {
      for(let x = 0; x < game.width; x++) {
        squares.push(`${x},${y}`);
      }
    }

    return (
      <div>
        <GenerationCounter count={game.generations} />
        <div style={{width: `${10 * game.width}` , height: `${10 * game.height}`, display: 'flex', flexWrap: 'wrap'}}>
        {squares.map((stringCoords) => {
          return (
            <GameSquare alive={liveSquares.includes(stringCoords)}
            x={stringCoords.split(',')[0]}
            y={stringCoords.split(',')[1]}/>
          );
        })}
        </div>
      </div>
    );
  }
}
