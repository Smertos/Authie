import { h, Component } from 'preact'
import Totp from '../totp'

class OTPItem extends Component {

  constructor (props) {
    super(props)

    this.state = {
      generator: new Totp(this.props.key),
      width: '100%'
    }

    this.interval = setInterval(() => this.setState({
      width: Math.round((this.state.generator.getRemainingTime() + 1) * 100 / this.state.generator.expireTime, 2) + '%',
      currentCode: this.state.generator.getCode()
    }), 250)
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  render () {
    return (
      <div className="otp-item">
        <div className="info">
          <span className="account">{ this.props.issuer }</span>
          <span className="code">{ this.state.currentCode }</span>
        </div>
        <span className="name">{ this.props.name }</span>
        <div className="progress">
          <div className="bar" style={{ width: this.state.width }}></div>
        </div>
      </div>
    )
  }

}

export default OTPItem
