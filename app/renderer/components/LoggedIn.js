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
    projects: localStore.get('expoProjects') !== undefined ? localStore.get('expoProjects') : [],
    projectsInfo:
      localStore.get('expoProjectsInfo') !== undefined ? localStore.get('expoProjectsInfo') : {}
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

  checkIfExpo = selectedPath => {
    const { projects } = this.state;

    const directory = basename(selectedPath);

    fs.readdir(selectedPath, (err, items) => {
      for (let i = 0; i < items.length; i++) {
        const filename = items[i];
        const filePath = `${selectedPath}/${filename}`;

        // is expo project?
        if (filename === 'app.json') {
          console.log('is EXPO!');
          console.log('directory', directory);
          if (!projects.includes(directory)) {
            projects.push(directory);
            localStore.set('expoProjects', projects);
            this.setState({ projects });
          }
          console.log('filePath:', filePath);
          console.log('filename:', filename);
          console.log('projects', projects);
          console.log(`${selectedPath}/assets/icon.png`);
          console.log('-------------------------');
          // localStore.set('expoProjects', projects);
          // dialog.showMessageBox({
          //   detail: 'detail here',
          //   title: 'title here',
          //   icon: `${selectedPath}/assets/icon.png`,
          //   message: 'message here'
          // });
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
  };

  selectExpoDirectory = () => {
    // open dialog for directory selection
    dialog.showOpenDialog({ properties: ['openDirectory'] }, async filePaths => {
      // user didn't select a directory
      if (typeof filePaths === 'undefined' || !Array.isArray(filePaths)) {
        return;
      }

      // console.log('response from dialog.showOpenDialog');
      // console.log('-----------------------------------');
      // console.log('filePaths: ', filePaths);
      // console.log(Array.isArray(filePaths));

      // const expoProjects = localStore.get('expoProjects');
      // console.log('expoProjects:', expoProjects);
      const selectedPath = filePaths[0];
      const isExpo = this.checkIfExpo(selectedPath);
      console.log('isExpo', isExpo);
      console.log('-----------------------------------');
      console.log('-----------------------------------');
    });
  };

  render() {
    const { user } = this.props;
    const { projects } = this.state;

    console.log('re-render');
    console.log(projects);
    console.log('------------');

    return (
      <div>
        {/* <h2>Logged in as {user.username}</h2> */}
        <button onClick={this.handleLogout}>Logout</button>
        <button onClick={this.test}>test()</button>
        <button onClick={this.selectExpoDirectory}>select an expo project</button>

        <hr />

        {projects &&
          projects.map((item, i) => {
            return <div key={i}>{item}</div>;
          })}
      </div>
    );
  }
}
