import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Login extends Component {
  state = {
    username: ''
  };

  static propTypes = {
    onLogin: PropTypes.func.isRequired
  };

  handleLogin = () => {
    const { onLogin } = this.props;
    const { username } = this.state;

    onLogin({
      loggedIn: true,
      username
    });
  };

  handleChange = e => {
    this.setState({
      username: e.target.value
    });
  };

  render() {
    return (
      <div>
        <h2>Login</h2>
        <input onChange={this.handleChange} type="text" value={this.state.username} />
        <button onClick={this.handleLogin}>Log In</button>
      </div>
    );
  }
}
