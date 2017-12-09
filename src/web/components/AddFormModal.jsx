import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { Button } from './Button';

const styles = {
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.24)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  content: {
    backgroundColor: '#222',
    bottom: 'auto',
    border: '0',
    borderRadius: '3px',
    margin: '0 auto',
    padding: '0',
    position: 'initial'
  }
};

export class AddFormModal extends Component {

  constructor (props) {
    super(props);

    this.state = {
      name: '',
      key: '',
      issuer: ''
    };

    this.addAccount = this.addAccount.bind(this);
  }

  getOnChange (name) {
    return (event) => {
      this.setState({ [name]: event.target.value.trim() });
    };
  }

  addAccount (event) {
    event.preventDefault();

    const { name, key, issuer } = this.state;

    if (name.length && key.length && issuer.length) {
      ipc.send('add-account', { name, key, issuer });
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
        contentLable="Add Account"
      >
        <form className="form-add" onSubmit={this.addAccount}>
          <span className="form-title">Add account</span>
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
            <Button type="submit" label="Add" />
        </div>
        </form>
      </Modal>
    );
  }

}
