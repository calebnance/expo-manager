import React from 'react';
import PropTypes from 'prop-types';
import Store from 'electron-store';

import { Button, NavBar } from '../reusedStyled';
import IconFolder from '../icons/Folder';

import { appJsonData } from '../utilities';

const localStore = new Store();

const fs = require('fs');
const { dialog } = require('electron').remote;
const { exec } = require('child_process');
const { basename } = require('path');

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
        const nodeModules = `${selectedPath}/node_modules/`;

        // is expo project?
        if (filename === 'app.json') {
          if (!projects.includes(directory)) {
            const rawdata = fs.readFileSync(filePath);
            const appJson = JSON.parse(rawdata);
            const projectData = appJsonData(appJson);

            // is expo :: http://jsben.ch/WqlIl
            if (appJson.expo !== undefined) {
              // console.log('is EXPO!');
              // console.log('directory', directory);

              projects.push(directory);

              const info = {
                [directory]: {
                  ...projectData,
                  installed: fs.existsSync(nodeModules),
                  path: selectedPath
                }
              };
              const newProjectsInfo = Object.assign(projectsInfo, info);

              localStore.set('expoProjects', projects);
              localStore.set('expoProjectsInfo', newProjectsInfo);

              this.setState({ projects, projectsInfo: newProjectsInfo });

              const showMessageObj = {
                detail: 'detail here',
                icon: null,
                message: 'message here',
                title: 'Expo Project Added!'
              };

              if (projectData.icon !== undefined) {
                showMessageObj.icon = `${selectedPath}/${projectData.icon}`;
              }
              if (projectData.name !== undefined) {
                showMessageObj.message = projectData.name;
                if (projectData.appVersion !== undefined) {
                  showMessageObj.message = `${showMessageObj.message} - v${projectData.appVersion}`;
                }
                if (projectData.sdk !== undefined) {
                  showMessageObj.message = `${showMessageObj.message} (Expo SDK: ${
                    projectData.sdk
                  })`;
                }
              }
              if (projectData.description !== undefined) {
                showMessageObj.detail = projectData.description;
              }

              dialog.showMessageBox(showMessageObj);
            } else {
              console.log('it is not an expo app.json file');
            }
          }
          // console.log('filePath:', filePath);
          // console.log('filename:', filename);
          // console.log('projects', projects);
          // console.log(`${selectedPath}/assets/icon.png`);
          // console.log('-------------------------');
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
    const { projects, projectsInfo } = this.state;
    console.log('projectsInfo', projectsInfo);

    return (
      <div>
        {/* <h2>Logged in as {user.username}</h2> */}
        <NavBar>
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
            add expo project
          </Button>
        </NavBar>

        {projects &&
          projects.map((item, i) => {
            return <div key={i}>{item}</div>;
          })}
      </div>
    );
  }
}
