import React from 'react';

export default class GameSquare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y
    }
  }
  render() {
    const style = {
      color: 'white',
      boxSizing: 'border-box',
      border: '1px solid black',
      width: 10,
      height: 10,
      backgroundColor: (this.props.alive ? 'black' : 'lightgrey')
    }
    return (
      <div style={style} className='game-square'>
      </div>
    );
  };
}
