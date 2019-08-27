import React from 'react';
import Store from 'electron-store';
import { appJsonData } from '../utilities';

// components
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ProjectInfo from '../components/ProjectInfo';

// icons
import IconFolder from '../icons/Folder';

const localStore = new Store();

const fs = require('fs');
const { remote } = require('electron');
const { dialog, shell } = remote;
const { exec } = require('child_process');
const { basename } = require('path');

// const execute = (command, callback) => {
//   exec(command, (error, stdout, stderr) => {
//     callback(stdout, error, stderr);
//   });
// };

class Main extends React.Component {
  state = {
    // projectActive: 'expo-spotify',
    projectActive: null,
    projects: localStore.get('expoProjects') !== undefined ? localStore.get('expoProjects') : [],
    projectsInfo:
      localStore.get('expoProjectsInfo') !== undefined ? localStore.get('expoProjectsInfo') : {},
    showToast: false
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

    // 'cd /Applications/MAMP/htdocs/expo/woody-blocks && code .'
    // 'cd /Applications/MAMP/htdocs/expo/woody-blocks && atom .'

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

  onProjectSelect = project => {
    this.setState({
      projectActive: project
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
          // already a linked project?
          if (projects.includes(directory)) {
            shell.beep();
            dialog.showMessageBox({
              detail: null,
              icon: null,
              message: 'This project was already added!',
              title: 'This project was already added!'
            });
            // console.log('already a linked project!');
            // console.log('directory', directory);
            // console.log(projectsInfo[directory]);
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
                detail: null,
                icon: null,
                message: null,
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
    const { projectActive, projects, projectsInfo, showToast } = this.state;

    console.log('=============================');
    console.log('============MAIN=============');
    console.log('=============================');
    console.log('projects', projects);
    console.log('projectsInfo', projectsInfo);
    console.log('=============================');

    return (
      <Container fluid>
        {showToast && (
          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 100
            }}
          >
            <Toast
              onClose={() => this.setState({ showToast: false })}
              show={showToast}
              delay={3000}
              autohide
            >
              <Toast.Header>
                <strong className="mr-auto">Bootstrap</strong>
                <small>11 mins ago</small>
              </Toast.Header>
              <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
            </Toast>
          </div>
        )}
        <Row className="mb-2 py-4">
          <Col sm="auto" md={4}>
            <h2 className="mb-0">Expo Manager</h2>
          </Col>
          <Col sm={8} md={8} className="d-flex align-items-center justify-content-end">
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
            <button className="btn btn-primary" onClick={this.test}>
              test()
            </button>
          </Col>
        </Row>

        <Row>
          <Col sm="auto" md={3}>
            <ul className="list-group">
              {projects &&
                projects.map((item, i) => {
                  const details = projectsInfo[item];
                  const iconPath = `${details.path}/${details.icon}`;
                  const isActive = projectActive === item ? ' active' : '';

                  return (
                    <li
                      className={`list-group-item list-group-item-action d-flex align-items-center${isActive}`}
                      key={i.toString()}
                      onClick={() => this.onProjectSelect(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="mr-3 shadow">
                        <img src={iconPath} height={48} width={48} />
                      </div>
                      {item}
                    </li>
                  );
                })}
            </ul>
          </Col>

          <Col sm={8} md={9}>
            <ProjectInfo project={projectActive ? projectsInfo[projectActive] : null} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Main;
