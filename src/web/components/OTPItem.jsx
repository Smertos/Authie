import { h, Component } from 'preact'
import Totp from '../totp'

class OTPItem extends Component {

  constructor (props) {
    super(props)

    this.state = {
      totp: new Totp(props.secretKey)
    }
    
    setInterval(() => this.setState({}), 250)
  }

  render () {
    return (
      <div className="otp-item">
        <div className="info">
          <span className="account" align="center">{ this.props.account }</span>
          <div className="progress">
            <div className="bar" style={
              {
                width: Math.round((this.state.totp.getRemainingTime() + 1) * 100 / this.state.totp.expireTime, 2) + '%'
              }
            }></div>
          </div>
        </div>
          <span className="code">{ this.state.totp.getCode() }</span>
      </div>
    )
  }

}

export default OTPItem
