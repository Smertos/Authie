import { h, Component } from 'preact'
import OTPItem from './OTPItem'

class App extends Component {

  constructor (props) {
    super(props)

    this.state = {
      secrets: [
        { account: 'example@learntotp.null', key: 'JBSWY3DPEHPK3PXP' },
        { account: 'example@learntotp.null', key: 'JBSWY3DPEHPK3PXP' }
      ]
    }
  }

  render () {
    return (
      <div class="codes">
        {
          this.state.secrets.map(totp => <OTPItem account={ totp.account } secretKey={ totp.key } />) 
        }
      </div>
    )  
  }

}


export default App

