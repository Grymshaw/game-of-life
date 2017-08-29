import React from 'react';

export default class GameSquare extends React.Component {
  render() {
    let style;
    if(this.props.alive) {
      const coords = this.props.coords.split(',');
      style = {
        left: `${coords[0] * 10}px`,
        top: `${coords[1] * 10}px`,
      };
    } else {
      style = {};
    }
    return (
      <div className={`square ${this.props.alive ? 'live' : ''}`}
        style={style}
        onClick={() => {
          this.props.addSquare(this.props.coords);
        }} >
      </div>
    );
  };
}
