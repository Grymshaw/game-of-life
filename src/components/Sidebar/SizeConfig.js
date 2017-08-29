import React from 'react';

export default class SizeConfig extends React.Component {
  render() {
    return (
      <div>
      {(!this.props.isStarted) ?
        <div className='size-controls'>
          <input className='size-control width' type='number' ref='width' max='100' id='width' value={this.props.gameWidth}
            onChange={() => this.props.resize(Math.min(this.refs.width.value, 100), Math.min(this.refs.height.value, 100))}
          />
          by
          <input className='size-control height' type='number' ref='height' max='100' id='height' value={this.props.gameHeight}
            onChange={() => this.props.resize(Math.min(this.refs.width.value, 100), Math.min(this.refs.height.value, 100))}
          />
        </div>
        :
        ''
      }
      </div>
    );
  }
}
