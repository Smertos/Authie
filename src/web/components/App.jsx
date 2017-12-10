import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import FaQrcode from 'react-icons/lib/fa/qrcode';
import FaPlus from 'react-icons/lib/fa/plus';
import FaCog from 'react-icons/lib/fa/cog';

import { AddFormModal } from './AddFormModal';
import { EditFormModal } from './EditFormModal';
import { AccountOptionsModal } from './AccountOptionsModal';
import { SettingsModal } from './SettingsModal';

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
      isAddFormOpened: false,
      isSettingsOpened: false,
      isAccountOptionsOpened: false,
      isEditFormOpened: false,

      account: {}
    };

    ipc.on('accounts', (event, accounts) => {
      this.setState({ accounts });
    });
  }

  componentDidMount () {
    ipc.send('get-accounts');
  }

  onScanQRCode () {
    ipc.send('scan-qr-code');
  }

  render () {
    return (
      <div className="codes">
        <div className="title-bar">
          <span className="title">Authie</span>

          <div className="buttons">
            <FaPlus size={42} onClick={() => this.setState({ isAddFormOpened: true })} />
            <FaQrcode size={42} onClick={this.onScanQRCode} />
            <FaCog size={42} onClick={() => this.setState({ isSettingsOpened: true })} />
          </div>
        </div>

        {
          this.state.accounts.map(
            (acc, index) =>
              <OTPItem
                name={acc.name}
                secretKey={acc.key}
                key={acc.key + index}
                issuer={acc.issuer}
                onOpenOptions={() => this.setState({
                  account: acc,
                  isAccountOptionsOpened: true
                })}
              />
          )
        }

        <AddFormModal
          isOpen={this.state.isAddFormOpened}
          onRequestClose={() => this.setState({ isAddFormOpened: false })}
        />
        <EditFormModal
          isOpen={this.state.isEditFormOpened}
          onRequestClose={() => this.setState({ isEditFormOpened: false })}
          account={this.state.account}
        />
        <AccountOptionsModal
          isOpen={this.state.isAccountOptionsOpened}
          onRequestClose={() => this.setState({ isAccountOptionsOpened: false })}
          onOpenEditForm={() => this.setState({
            isAccountOptionsOpened: false,
            isEditFormOpened: true
          })}
          account={this.state.account}
        />
        <SettingsModal
          isOpen={this.state.isSettingsOpened}
          onRequestClose={() => this.setState({ isSettingsOpened: false })}
        />
      </div>
    );
  }

}
