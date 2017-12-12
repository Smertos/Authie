import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { Button } from './Button';
import { styles } from '../modal-styles';

export class EditFormModal extends Component {

  constructor (props) {
    super(props);

    const { name, secret, issuer } = this.props.account;

    this.state = {
      name,
      secret,
      issuer
    };

    this.updateAccount = this.updateAccount.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const { name, secret, issuer } = this.props.account;
    this.setState({ name, secret, issuer });
  }

  getOnChange (name) {
    return (event) => {
      this.setState({ [name]: event.target.value.trim() });
    };
  }

  updateAccount (event) {
    event.preventDefault();

    const { name, secret, issuer } = this.state;
    const { id } = this.props.account;

    if (name.length && secret.length && issuer.length) {
      ipc.send('update-account', { id, name, secret, issuer });
      this.setState({ name: '', secret: '', issuer: '' });
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
              className="field"
              type="text"
              placeholder="Account Name"
              onChange={this.getOnChange('name')}
              value={this.state.name}
            />

            <input
              className="field"
              type="text"
              placeholder="Issuer"
              onChange={this.getOnChange('issuer')}
              value={this.state.issuer}
            />
          </div>

          <input
            className="field"
            type="text"
            placeholder="Shared Secret Key"
            onChange={this.getOnChange('secret')}
            value={this.state.secret}
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
