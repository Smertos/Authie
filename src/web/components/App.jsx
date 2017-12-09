import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { AddFormModal } from './AddFormModal';
import { Button } from './Button';
import { OTPItem } from './OTPItem';

Modal.setAppElement('#App');

export class App extends Component {

  constructor (props) {
    super(props);

    this.state = {
      accounts: [
        /*
         *{ name: 'example@learntotp.null', key: 'JBSWY3DPEHPK3PXP', issuer: 'test' },
         */
      ],
      isFormOpened: false
    };

    ipc.on('accounts', (event, accounts) => {
      console.log(event, accounts);
      this.setState({ accounts });
    });
  }

  componentDidMount () {
    ipc.send('get-accounts');
  }


  render () {
    return (
      <div className="codes">
        <p className="title">Authie</p>

        {
          this.state.accounts.map(
            ({ name, key, issuer }, index) =>
              <OTPItem name={name} secretKey={key} key={key+index} issuer={issuer} />
          )
        }

        <AddFormModal
          isOpen={this.state.isFormOpened}
          onRequestClose={() => this.setState({ isFormOpened: false })}
        />
        <Button
          type="submit"
          label="Add Account"
          onClick={() => this.setState({ isFormOpened: true })}
        />
      </div>
    );
  }

}
