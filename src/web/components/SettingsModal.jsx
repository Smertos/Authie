import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { Button } from './Button';
import { styles } from '../modal-styles';

export class SettingsModal extends Component {

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        style={styles}
        contentLable="Add Account"
      >
        <div className="settings">
          <h3>Settings</h3>

          <div>
            <h4>Sync</h4>
            <Button label="Sync now" />
          </div>

          <div>
            <h4>Password</h4>

            <Button
              label={this.props.settings.isPasswordSet ? "Remove password" : "Set password"}
              onClick={() => this.props.onPasswordSwitch()}
            />
          </div>
        </div>
      </Modal>
    );
  }

}
