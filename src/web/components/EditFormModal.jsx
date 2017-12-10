import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { Button } from './Button';
import { styles } from '../modal-styles';

export class EditFormModal extends Component {

  constructor (props) {
    super(props);

    const { name, key, issuer } = this.props.account;

    this.state = {
      name,
      key,
      issuer
    };

    this.updateAccount = this.updateAccount.bind(this);
  }

  getOnChange (name) {
    return (event) => {
      this.setState({ [name]: event.target.value.trim() });
    };
  }

  updateAccount (event) {
    event.preventDefault();

    const { name, key, issuer } = this.state;
    const { id } = this.props.account;

    if (name.length && key.length && issuer.length) {
      ipc.send('update-account', { id, name, key, issuer });
      this.setState({ name: '', key: '', issuer: '' });
      this.props.onRequestClose();
    }
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        style={styles}
        contentLable="Edit Account"
      >
        <form className="form-add" onSubmit={this.updateAccount}>
          <span className="form-title">Edit Account</span>
          <div>
            <input
              type="text"
              placeholder="Account Name"
              onChange={this.getOnChange('name')}
              value={this.state.name}
            />

            <input
              type="text"
              placeholder="Issuer"
              onChange={this.getOnChange('issuer')}
              value={this.state.issuer}
            />
          </div>

          <input
            type="text"
            placeholder="Shared Secret Key"
            onChange={this.getOnChange('key')}
            value={this.state.key}
          />

          <div className="form-controls">
            <Button type="passive" label="Cancel" onClick={this.props.onRequestClose} />
            <Button type="submit" label="Update" />
        </div>
        </form>
      </Modal>
    );
  }

}
