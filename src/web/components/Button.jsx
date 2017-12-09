import React, { Component } from 'react';

export class Button extends Component {

  render () {
    return (
      <button
        type={this.props.type === 'submit' ? 'submit' : 'button'}
        className={['btn', this.props.type !== 'passive' ? 'active' : 'passive'].join(' ')}
        onClick={this.props.onClick}
      >{this.props.label || 'Button'}</button>
    );
  }

}
