import React from 'react';

export default class SpeedConfig extends React.Component {
  render() {
    return (
      <div>
        <span onClick={() => { this.props.changeSpeed('slow'); }}>Slow</span>
        <span onClick={() => { this.props.changeSpeed('med');  }}>Med</span>
        <span onClick={() => { this.props.changeSpeed('fast'); }}>Fast</span>
      </div>
    );
  }
}
