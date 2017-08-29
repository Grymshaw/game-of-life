import React from 'react';

export default class GameControls extends React.Component {
  render() {
    return (
      <div className='game-controls'>
        {(this.props.isStarted) ? 
            <button className={`button game-control-button ${this.props.isPaused ? 'resume' : 'pause'}`}
              onClick={this.props.pause}>
                {this.props.isPaused ? 'Resume' : 'Pause'}
            </button>
            :
            <button className='button game-control-button start'
              onClick={this.props.start}>Start</button>
        }
        <br/>
        <button className='button game-control-button clear'
          onClick={this.props.reset}>Clear board</button>
      </div>
    );
  }
}
