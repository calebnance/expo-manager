import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Store = require('electron-store');
const localStore = new Store();

const fs = require('fs');
const { dialog } = require('electron').remote;
const { exec } = require('child_process');
const { basename } = require('path');

export default class LoggedIn extends Component {
  state = {
    projects: localStore.get('expoProjects') !== undefined ? localStore.get('expoProjects') : []
  };

  static propTypes = {
    // required
    onLogout: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  handleLogout = () => {
    const { onLogout } = this.props;

    onLogout({
      loggedIn: false,
      username: ''
    });
  };

  test = () => {
    console.log('hit test()');
    console.log(basename(__dirname));
    exec('echo "The \\$HOME variable is $HOME"', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  };

  setExpoDirectory = () => {
    // console.log(this.state);
    dialog.showOpenDialog({ properties: ['openDirectory'] }, filePaths => {
      console.log('response from dialog.showOpenDialog');
      console.log('-----------------------------------');
      console.log('filePaths: ', filePaths);
      const selectedPath = filePaths[0];
      fs.readdir(selectedPath, function(err, items) {
        // console.log(items);

        for (let i = 0; i < items.length; i++) {
          const filename = items[i];
          const filePath = `${selectedPath}/${filename}`;
          console.log('filePath:', filePath);
          console.log('filename:', filename);
          console.log('-----------------------------------');

          if (filename === 'app.json') {
            console.log('is EXPO!');
            console.log(`${selectedPath}/assets/icon.png`);
            // localStore.set('expoProjects', filePaths[0]);
            dialog.showMessageBox({
              detail: 'detail here',
              title: 'title here',
              icon: `${selectedPath}/assets/icon.png`,
              message: 'message here'
            });
            break;
          }

          // fs.stat(file, (err, stats) => {
          //   console.log(file);
          //   console.log(stats['size']);
          //   const filename = basename(file);
          //   console.log(filename);
          // });
        }
      });
    });
  };

  render() {
    const { user } = this.props;
    const { projects } = this.state;
    console.log(projects);

    return (
      <div>
        <h2>Logged in as {user.username}</h2>
        <button onClick={this.handleLogout}>Logout</button>
        <button onClick={this.test}>test()</button>
        <button onClick={this.setExpoDirectory}>select an expo project</button>
      </div>
    );
  }
}
