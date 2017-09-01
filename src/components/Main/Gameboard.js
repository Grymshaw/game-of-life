import React from 'react';

import GameSquare from './GameSquare';
import GenerationCounter from './GenerationCounter';

export default class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    this.toggleLiveSquare = this.toggleLiveSquare.bind(this);
    this.countAdjacentLivingSquares = this.countAdjacentLivingSquares.bind(this);
    this.getAdjacentSquares = this.getAdjacentSquares.bind(this);
    this.getNextBoard = this.getNextBoard.bind(this);

    const liveSquares = this.randomizeBoard();
    const grid = this.makeGrid();
    this.state = {
      liveSquares,
      grid
    };

    // this.makeGrid();

    this.interval = setInterval(this.getNextBoard, this.props.speed);
  }

  componentWillReceiveProps(nextProps) {
    //change speed of cycle
    if(nextProps.speed !== this.props.speed) {
      clearInterval(this.interval);
      this.interval = setInterval(this.getNextBoard, nextProps.speed);
    }
    //reset liveSqures if game is reset
    if(nextProps.game.shouldReset) {
      this.resetLiveSquares();
      const game = this.props.game;
      game.shouldReset = false;
      this.props.update(game);
    }
    if(nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
      const grid = this.makeGrid();
      this.setState({
        liveSquares: [],
        grid
      });
    }
  }

  getNextBoard() {
    const game = this.props.game;
    let liveSquares = this.state.liveSquares;

    //get all potential squares
    const allPotentialSquares = liveSquares.reduce((acc, val) => {
      acc = acc.concat(
        //filter ones already in acc
          this.getAdjacentSquares(val).filter(cur => !acc.includes(cur))
      );
      return acc;
    }, []);

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
    return adjacentSquaresArr.reduce((arr, cur) => {
      if(cur[0] >= 0 && cur[0] < game.width && cur[1] >= 0 && cur[1] < game.height) {
        arr.push(cur.join(','));
      }
      return arr;
    }, []);
  }

  countAdjacentLivingSquares(stringCoords) {
    const game = this.props.game;
    const liveSquares = this.state.liveSquares;
    const arrCoords = stringCoords.split(',');
    const x = parseInt(arrCoords[0]), y = parseInt(arrCoords[1]);
    const adjacentSquaresArr = [
      [x-1, y-1], [x, y-1], [x+1, y-1],
      [x-1, y], [x+1, y],
      [x-1, y+1], [x, y+1], [x+1, y+1]
    ];
    return adjacentSquaresArr.reduce((count, cur) => {
      if(cur[0] >= 0 && cur[0] < game.width && cur[1] >= 0 && cur[1] < game.height) {
        if(liveSquares.includes(cur.join(','))) {
          count++;
        }
      }
      return count;
    }, 0);
  }

  makeGrid() {
    console.log('remaking grid');
    const game = this.props.game;
    const squares = [];
    for(let y = 0; y < game.height; y++) {
      for(let x = 0; x < game.width; x++) {
        squares.push(`${x},${y}`);
      }
    }
    return squares.map((val, i) => (
      <GameSquare
        key={i}
        alive={false}
        coords={val}
        addSquare={this.toggleLiveSquare} />
    ));
  }

  resetLiveSquares() {
    this.setState({ liveSquares: [] });
  }

  toggleLiveSquare(stringCoords) {
    console.log('square clicked ' + stringCoords);
    const liveSquares = this.state.liveSquares;
    if(liveSquares.includes(stringCoords)) {
      const i = liveSquares.indexOf(stringCoords);
      liveSquares.splice(i, 1);
    } else {
      liveSquares.push(stringCoords);
    }
    this.setState({ liveSquares });
  }

  render() {
    const game = this.props.game;
    const liveSquares = this.state.liveSquares;

    if(game.isPaused || !game.isStarted) {
      clearInterval(this.interval);
      this.interval = null;
    } else if(!this.interval && game.isStarted) {
      this.interval = setInterval(this.getNextBoard, this.props.speed);
    }

    return (
      <div className='gameboard'>
        <GenerationCounter count={game.generations} />
        <div style={{
          width: `${10 * game.width}px`,
          height: `${10 * game.height}px`,
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
          borderRadius: '5px',
          overflow: 'hidden'
        }} >
          {this.state.grid}
          {liveSquares.map((sq, i) => <GameSquare key={i} alive={true} coords={sq} addSquare={this.toggleLiveSquare}/> )}
        </div>
      </div>
    );
  }
}
