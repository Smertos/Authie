import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { Button } from './Button';
import { styles } from '../modal-styles';

export class SettingsModal extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isPasswordSet: false
    };
  }

  componentDidMount () {
    ipc.send('get-settings');
  }

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
            {
              this.state.isPasswordSet
                ? <Button label="Remove password" />
                : <Button label="Set password" />
            }
          </div>
        </div>
      </Modal>
    );
  }

}
