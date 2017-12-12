import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { Button } from './Button';
import { styles } from '../modal-styles';

export class PasswordPromptModal extends Component {

  constructor (props) {
    super(props);

    this.state = { password: '' };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit (event) {
    event.preventDefault();

    if (this.state.password !== '') {
      ipc.send(this.props.eventName, this.state.password);
      this.setState({ password: '' });
      this.props.onRequestClose();
    }
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        style={styles}
        contentLable="Enter password"
      >
        <form className="password-form" onSubmit={this.onSubmit}>
          <h3>Enter your password:</h3>
          <input
            className="field"
            type="text"
            onChange={event => this.setState({ password: event.target.value })}
            value={this.state.password}
          />

          <Button type="submit" label="Okay" />
        </form>
      </Modal>
    );
  }

}
