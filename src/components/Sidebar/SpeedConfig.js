import React from 'react';

export default class SpeedConfig extends React.Component {
  render() {
    return (
      <div className='speed-controls'>
        <span className={`speed-control slow ${this.props.speed === 200 ? 'active' : ''}`} onClick={() => { this.props.changeSpeed('slow'); }}>Slow</span>
        <span className={`speed-control med ${this.props.speed === 150 ? 'active' : ''}`} onClick={() => { this.props.changeSpeed('med');  }}>Med</span>
        <span className={`speed-control fast ${this.props.speed === 100 ? 'active' : ''}`} onClick={() => { this.props.changeSpeed('fast'); }}>Fast</span>
      </div>
    );
  }
}
