import React from 'react';

export default class GenerationCounter extends React.Component {
  render() {
    return (
      <div>
        Generation: {this.props.count}
      </div>
    );
  }
}
