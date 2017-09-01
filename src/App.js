import React, { Component } from 'react';
import 'normalize.css';
import './App.css';

import Gameboard from './components/Main/Gameboard';
import Sidebar from './components/Sidebar/Sidebar'

class App extends Component {
  constructor(props) {
    super(props);
    this.changeSpeed = this.changeSpeed.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.resizeBoard = this.resizeBoard.bind(this);
    this.toggleIsPaused = this.toggleIsPaused.bind(this);
    this.toggleIsStarted = this.toggleIsStarted.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.speeds = {
      'slow': 200,
      'med': 150,
      'fast': 100 
    };
    this.state = {
      game: {
        width: 30,
        height: 30,
        isPaused: false,
        isStarted: true,
        generations: 0,
        speed: this.speeds['slow']
      }
    };
  }
  changeSpeed(speed) {
    const game = this.state.game;
    game.speed = this.speeds[speed];
    this.setState({ game });
  }
  resetGame() {
    const game = this.state.game;
    game.shouldReset = true;
    game.isPaused = false;
    game.isStarted = false;
    game.generations = 0;
    this.setState({ game });
  }
  resizeBoard(width, height) {
    const game = this.state.game;
    game.width = width;
    game.height = height;
    this.setState({ game });
  }
  toggleIsPaused() {
    const game = this.state.game;
    game.isPaused = !game.isPaused;
    this.setState({ game });
    return game.isPaused;
  }
  toggleIsStarted() {
    const game = this.state.game;
    game.isStarted = !game.isStarted;
    this.setState({ game });
    return game.isStarted;
  }
  updateGame(game) {
    this.setState({ game });
  }
  render() {
    const game = this.state.game;
    return (
      <div className='container'>
        <Gameboard game={game}
          width={game.width}
          height={game.height}
          speed={game.speed}
          update={this.updateGame} />
        <Sidebar isPaused={game.isPaused}
          isStarted={game.isStarted}
          changeSpeed={this.changeSpeed}
          pauseGame={this.toggleIsPaused}
          resetGame={this.resetGame}
          startGame={this.toggleIsStarted}
          gameWidth={game.width}
          gameHeight={game.height}
          resize={this.resizeBoard}
          speed={this.state.game.speed}
        />
      </div>
    );
  }
}

export default App;
