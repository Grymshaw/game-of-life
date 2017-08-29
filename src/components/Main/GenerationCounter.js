import React from 'react';

export default class GenerationCounter extends React.Component {
  render() {
    return (
      <div className='generation-counter'>
        Generation: {this.props.count}
      </div>
    );
  }
}
