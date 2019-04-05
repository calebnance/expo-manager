import React from 'react';
import PropTypes from 'prop-types';

const Store = require('electron-store');
const localStore = new Store();

const fs = require('fs');
const { dialog } = require('electron').remote;
const { exec } = require('child_process');
const { basename } = require('path');

import { Button, ContainerFlexEnd } from '../reusedStyled';
import IconFolder from '../icons/Folder';

export default class LoggedIn extends React.Component {
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
    const { projects, projectsInfo } = this.state;

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
            console.log('projectsInfo', projectsInfo);
            // projectsInfo.push()

            localStore.set('expoProjects', projects);
            // localStore.set('expoProjectsInfo', projectsInfo);

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

      // check if expo
      this.checkIfExpo(filePaths[0]);
    });
  };

  render() {
    // const { user } = this.props;
    const { projects } = this.state;

    return (
      <div>
        {/* <h2>Logged in as {user.username}</h2> */}
        <ContainerFlexEnd>
          <Button onClick={this.handleLogout}>Logout</Button>
          <Button onClick={this.test}>test()</Button>
          <Button
            onClick={() => {
              localStore.delete('expoProjects');
              localStore.delete('expoProjectsInfo');
              this.setState({
                projects: [],
                projectsInfo: {}
              });
            }}
          >
            clearLocalStorage()
          </Button>
          <Button onClick={this.selectExpoDirectory} svgMR="10px">
            <IconFolder fill="#fff" />
            select an expo project
          </Button>
        </ContainerFlexEnd>

        {projects &&
          projects.map((item, i) => {
            return <div key={i}>{item}</div>;
          })}
      </div>
    );
  }
}
