import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { Button } from './Button';
import { styles } from '../modal-styles';

export class AddFormModal extends Component {

  constructor (props) {
    super(props);

    this.state = {
      name: '',
      secret: '',
      issuer: ''
    };

    this.addAccount = this.addAccount.bind(this);
  }

  getOnChange (name) {
    return (event) => {
      const value = event.target.value;
      this.setState({ [name]: name !== 'secret' ? value : value.replace(/\s/g, '') });
    };
  }

  addAccount (event) {
    event.preventDefault();

    let { name, secret, issuer } = this.state;
    [name, secret, issuer] = [name, secret, issuer].map(e => e.trim());

    if (name.length && secret.length && issuer.length) {
      ipc.send('add-account', { name, secret, issuer });
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
        contentLable="Add Account"
      >
        <form className="form-add" onSubmit={this.addAccount}>
          <span className="form-title">Add account</span>
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
            <Button type="submit" label="Add" />
        </div>
        </form>
      </Modal>
    );
  }

}
