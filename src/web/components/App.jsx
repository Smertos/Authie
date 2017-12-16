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
import { PasswordPromptModal } from './PasswordPromptModal';

import { OTPItem } from './OTPItem';

Modal.setAppElement('#App');

export class App extends Component {

  constructor (props) {
    super(props);

    this.state = {
      account: {},
      accounts: [],

      isAddFormOpened: false,
      isSettingsOpened: false,
      isEditFormOpened: false,
      isAccountOptionsOpened: false,
      isPasswordFormOpened: false,

      isLoggedIn: true,

      currentPasswordEvent: '',

      settings: {
        isPasswordSet: false
      }
    };

    ipc.on('accounts', (event, accounts) => {
      this.setState({ accounts });
    });

    ipc.on('settings', (event, settings) => {
      this.setState({
        settings,
        isPasswordFormOpened: settings.isPasswordSet,
        currentPasswordEvent: settings.isPasswordSet ? 'load' : ''
      });

      if (!settings.isPasswordSet) {
        ipc.send('load');
      }
    });

    this.onPasswordSwitch = this.onPasswordSwitch.bind(this);
  }

  componentDidMount () {
    ipc.send('get-settings');

    setInterval(() => ipc.send('get-accounts'), 2500);
  }

  onScanQRCode () {
		ipc.send('scan-qr-code');
  }

  onPasswordSwitch () {
    const { isPasswordSet } = this.state.settings;

    this.setState({
      currentPasswordEvent: isPasswordSet ? 'remove-password' : 'add-password',
      isPasswordFormOpened: true,
      isSettingsOpened: false
    });
  }

  render () {
    return (
      <div className="app">
        <div className="title-bar">
          <span className="title">Authie</span>

          <div className="buttons">
            <FaPlus size={42} onClick={() => this.setState({ isAddFormOpened: true })} />
            <FaQrcode size={42} onClick={this.onScanQRCode} />
            <FaCog size={42} onClick={() => this.setState({ isSettingsOpened: true })} />
          </div>
        </div>

        <div className="codes">
        {
          this.state.accounts.map(
            (acc, index) =>
              <OTPItem
                name={acc.name}
                secretKey={acc.secret}
                key={acc.secret + index}
                issuer={acc.issuer}
                onOpenOptions={() => this.setState({
                  account: acc,
                  isAccountOptionsOpened: true
                })}
              />
          )
        }
        </div>

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
          onPasswordSwitch={this.onPasswordSwitch}
          settings={this.state.settings}
        />
        <PasswordPromptModal
          isOpen={this.state.isPasswordFormOpened}
          onRequestClose={() => this.setState({ isPasswordFormOpened: false })}
          eventName={this.state.currentPasswordEvent}
        />
      </div>
    );
  }

}
