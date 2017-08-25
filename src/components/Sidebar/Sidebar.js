import React from 'react';

import GameControls from './GameControls';
import SizeConfig from './SizeConfig';
import SpeedConfig from './SpeedConfig';

export default class Sidebar extends React.Component {
  render() {
    return (
      <div className='sidebar'>
        <GameControls isPaused={this.props.isPaused}
          isStarted={this.props.isStarted}
          pause={this.props.pauseGame}
          start={this.props.startGame}/>
        <SizeConfig />
        <SpeedConfig changeSpeed={this.props.changeSpeed} />
      </div>
    );
  }
}
