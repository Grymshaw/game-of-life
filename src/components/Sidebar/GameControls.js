import React from 'react';

export default class GameControls extends React.Component {
  render() {
    return (
      <div>
        <span onClick={this.props.pause}>
          {this.props.isPaused ? 'Resume' : 'Pause'}
        </span>
        <br/>
        <span onClick={this.props.start}>
          {this.props.isStarted ? 'Stop' : 'Start'}
        </span>
      </div>
    );
  }
}
