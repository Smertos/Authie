import { ipcRenderer as ipc } from 'electron'
import { h, Component } from 'preact'
import OTPItem from './OTPItem'

class App extends Component {

  constructor (props) {
    super(props)

    this.state = {
      accounts: [
        /*{ name: 'example@learntotp.null', key: 'JBSWY3DPEHPK3PXP', issuer: 'test' },*/
      ],
      name: '', key: '', issuer: ''
    }

    ipc.on('accounts', (event, accounts) => {
      console.log(event, accounts)
      this.setState({ accounts })
    })

    ipc.send('get-accounts')
  }

  addAccount = (event) => {
    event.preventDefault()

    const { name, key, issuer } = this.state

    if (name.length && key.length && issuer.length) {
      ipc.send('add-account', { name, key, issuer })
      this.setState({ name: '', key: '', issuer: '' })
    }
  }

  getOnChange = (name) => {
    return (function (event) {
      this.setState({ [name]: event.target.value.trim() })
    }).bind(this)
  }

  render () {
    return (
      <div class="codes">
        {
          this.state.accounts.map(
            ({ name, key, issuer }) => <OTPItem name={ name } key={ key } issuer={ issuer } />
          )
        }
        <form class="form-add" onSubmit={ this.addAccount }>
          <span class="form-title">Add account</span>
          <div>
            <input
              type="text"
              placeholder="Account Name"
              onChange={ this.getOnChange('name') }
              value={ this.state.name }
            />
            <input
              type="text"
              placeholder="Issuer"
              onChange={ this.getOnChange('issuer') }
              value={ this.state.issuer }
            />
          </div>
          
          <input
            type="text"
            placeholder="Shared Secret Key"
            onChange={ this.getOnChange('key') }
            value={ this.state.key }
          />
          <input type="submit" value="Add Account" />
        </form>
      </div>
    )  
  }

}

export default App

