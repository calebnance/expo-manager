import React from 'react';
import PropTypes from 'prop-types';
import Store from 'electron-store';

import IconFolder from '../icons/Folder';

import { appJsonData } from '../utilities';

const localStore = new Store();

const fs = require('fs');
const { remote } = require('electron');
const { dialog, shell } = remote;
const { exec } = require('child_process');
const { basename } = require('path');

const execute = (command, callback) => {
  exec(command, (error, stdout, stderr) => {
    callback(stdout, error, stderr);
  });
};

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
    // open url
    // shell.openExternal('https://github.com');
    // open item in finder/explorer
    // const fullPath = '/Applications/MAMP/htdocs/expo/expo-uber';
    // shell.showItemInFolder(fullPath);
    // shell beep
    // shell.beep();
    // console.log(process.execPath);
    // console.log('hit test()');
    // console.log(basename(__dirname));
    // execute('ping -c 4 0.0.0.0', output => {
    //   console.log(output);
    // });
    // execute('cd /Applicationssss', output => {
    //   console.log(output);
    //   console.log('------');
    // });

    // execute(
    //   'cd /Applications/MAMP/htdocs/expo/woody-blocks && yarn outdated expo --json',
    //   (output, error) => {
    //     console.log(output);
    //     console.log(error);
    //   }
    // );

    exec(
      'cd /Applications/MAMP/htdocs/expo/woody-blocks && yarn outdated expo --json',
      (error, stdout, stderr) => {
        console.log(error);
        console.log('error');
        console.log('=======================');
        console.log(typeof stdout);
        console.log(stdout);
        console.log(stderr);
        const res = stdout.split('\n');
        const json = JSON.parse(res[1]);
        console.log('-----res------');
        console.log(res);
        console.log('json');
        console.log(json);
        console.log('=================');
        // const json = JSON.parse(stdout);
        // console.log('stdout', json.type);
        // console.log('json', json);
        console.log(JSON.parse(JSON.stringify(stdout)));
        // console.log(stderr);
        console.log('---------------------');
      }
    );

    // exec('cd /Applications', (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`exec error: ${error}`);
    //     return;
    //   }
    //   console.log(`stdout: ${stdout}`);
    //   console.log(`stderr: ${stderr}`);
    // });
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
          // already a linked project?
          if (projects.includes(directory)) {
            console.log('already a linked project!');
          } else {
            const rawdata = fs.readFileSync(filePath);
            const appJson = JSON.parse(rawdata);
            const projectData = appJsonData(appJson);

            // is expo :: http://jsben.ch/WqlIl
            if ('expo' in appJson) {
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

              if ('icon' in projectData) {
                showMessageObj.icon = `${selectedPath}/${projectData.icon}`;
              }

              if ('name' in projectData) {
                showMessageObj.message = projectData.name;
                if ('appVersion' in projectData) {
                  showMessageObj.message = `${showMessageObj.message} - v${projectData.appVersion}`;
                }
                if ('sdk' in projectData) {
                  showMessageObj.message = `${showMessageObj.message} (Expo SDK: ${
                    projectData.sdk
                  })`;
                }
              }

              if ('description' in projectData) {
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

    console.log('=============================');
    console.log('=============================');
    console.log('projects', projects);
    console.log('projectsInfo', projectsInfo);
    console.log('=============================');
    console.log('=============================');

    return (
      <div>
        <div className="d-flex justify-content-end p-2">
          <button className="btn btn-primary mr-2" onClick={this.selectExpoDirectory}>
            <IconFolder fill="#fff" />
            <span className="ml-2">add expo project</span>
          </button>

          <button
            className="btn btn-primary mr-2"
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
          </button>
          <button className="btn btn-primary mr-2" onClick={this.test}>
            test()
          </button>
          <button className="btn btn-dark" onClick={this.handleLogout}>
            Logout
          </button>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <ul className="list-group">
                {projects &&
                  projects.map((item, i) => {
                    return (
                      <li key={i} className="list-group-item">
                        {item}
                      </li>
                    );
                  })}
              </ul>
            </div>

            <div className="col-8">
              One of three columns
              <button
                type="button"
                className="btn btn-secondary"
                data-toggle="tooltip"
                data-placement="top"
                title="Tooltip on top"
              >
                Tooltip on top
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
