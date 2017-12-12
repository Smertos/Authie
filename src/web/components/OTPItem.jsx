import React, { Component } from 'react';
import Totp from '../totp';

import FaEllipsisV from 'react-icons/lib/fa/ellipsis-v';

export class OTPItem extends Component {

  constructor (props) {
    super(props);

    this.state = {
      generator: new Totp(this.props.secretKey),
      width: '100%'
    };

    this.interval = setInterval(() => this.setState({
      width: Math.round((this.state.generator.getRemainingTime() + 1) * 100 / this.state.generator.expireTime, 2) + '%',
      currentCode: this.state.generator.getCode()
    }), 250);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  render () {
    return (
      <div className="otp-item">
        <div className="info">
          <span className="name">{this.props.name}</span>
          <span className="code">
            {this.state.currentCode}
            <FaEllipsisV size={42} onClick={this.props.onOpenOptions} />
          </span>
        </div>
        <span className="issuer">{this.props.issuer || 'Unknown Issuer'}</span>
        <div className="progress">
          <div className="bar" style={{ width: this.state.width }}/>
        </div>
      </div>
    );
  }

}
