import React, { Component } from 'react';
import './App.css';

import Gameboard from './components/Main/Gameboard';
import Sidebar from './components/Sidebar/Sidebar'

class App extends Component {
  constructor(props) {
    super(props);
    this.changeSpeed = this.changeSpeed.bind(this);
    this.toggleIsPaused = this.toggleIsPaused.bind(this);
    this.toggleIsStarted = this.toggleIsStarted.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.speeds = {
      'slow': 300,
      'med': 200,
      'fast': 100 
    };
    this.state = {
      game: {
        width: 100,
        height: 100,
        isPaused: false,
        isStarted: true,
        generations: 0,
        speed: this.speeds['fast']
      }
    };
  }
  changeSpeed(speed) {
    const game = this.state.game;
    console.log(game.speed);
    game.speed = this.speeds[speed];
    console.log(game.speed);
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
      <div>
        <Gameboard game={game}
          speed={game.speed}
          update={this.updateGame} />
        <Sidebar isPaused={game.isPaused}
          isStarted={game.isStarted}
          changeSpeed={this.changeSpeed}
          pauseGame={this.toggleIsPaused}
          startGame={this.toggleIsStarted}/>
      </div>
    );
  }
}

export default App;
