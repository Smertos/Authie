import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { Button } from './Button';
import { styles } from '../modal-styles';

export class AccountOptionsModal extends Component {

  onDeleteAccount () {
    ipc.send('delete-account', this.props.account);
    this.props.onRequestClose();
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        style={styles}
        contentLable="Select action"
      >
        <div className="account-options">
          <h3>Select option</h3>
          <Button
            type="warning"
            label="Edit"
            onClick={() => this.props.onOpenEditForm()}
          />
          <Button
            type="danger"
            label="Delete"
            onClick={() => this.onDeleteAccount(this.props.account)}
          />
        </div>
      </Modal>
    );
  }

}
