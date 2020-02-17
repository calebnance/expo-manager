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

// data
const localStore = new Store();

// file system
const fs = require('fs');
const { remote } = require('electron');
const { dialog, shell } = remote;
const { basename } = require('path');
// const { exec } = require('child_process');

// const execute = (command, callback) => {
//   exec(command, (error, stdout, stderr) => {
//     callback(stdout, error, stderr);
//   });
// };

class Main extends React.Component {
  state = {
    projectActive: null,
    projects: localStore.get('expoProjects') !== undefined ? localStore.get('expoProjects') : [],
    projectsInfo:
      localStore.get('expoProjectsInfo') !== undefined ? localStore.get('expoProjectsInfo') : {},
    showToast: false
  };

  test = () => {
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
    const { projectActive } = this.state;

    // toggle active project selected
    this.setState({
      projectActive: project === projectActive ? null : project
    });
  };

  checkIfExpo = selectedPath => {
    const { projects, projectsInfo } = this.state;

    // get base directory
    const directory = basename(selectedPath);

    // set app.json path
    const appJsonFile = `${selectedPath}/app.json`;

    // does app.json exist?
    const isExpo = fs.existsSync(appJsonFile);

    // is it potentially expo doe?
    if (isExpo) {
      const nodeModules = `${selectedPath}/node_modules/`;

      // already a linked project?
      if (projects.includes(directory)) {
        shell.beep();

        // icon in project?
        let projectIcon = null;
        if ('icon' in projectsInfo[directory]) {
          projectIcon = `${selectedPath}/${projectsInfo[directory].icon}`;
        }

        dialog.showMessageBox({
          detail: null,
          icon: projectIcon,
          message: 'This project was already added!',
          title: 'This project was already added!'
        });

        this.setState({
          projectActive: directory
        });
      } else {
        const rawdata = fs.readFileSync(appJsonFile);
        const appJson = JSON.parse(rawdata);
        const projectData = appJsonData(appJson);

        // is expo :: http://jsben.ch/WqlIl
        if ('expo' in appJson) {
          // add project
          projects.push(directory);

          // set project info
          const info = {
            [directory]: {
              ...projectData,
              installed: fs.existsSync(nodeModules),
              path: selectedPath
            }
          };
          const newProjectsInfo = Object.assign(projectsInfo, info);

          // update local storage for projects
          localStore.set('expoProjects', projects);
          localStore.set('expoProjectsInfo', newProjectsInfo);

          this.setState({
            projectActive: directory,
            projects,
            projectsInfo: newProjectsInfo
          });

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
              showMessageObj.message = `${showMessageObj.message} (Expo SDK: ${projectData.sdk})`;
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
    }
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

    // console.log('=============================');
    // console.log('============MAIN=============');
    // console.log('=============================');
    // console.log('projects', projects);
    // console.log('projectsInfo', projectsInfo);
    // console.log('=============================');

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
              <Toast.Body>Woohoo, you&apos;re reading this text in a Toast!</Toast.Body>
            </Toast>
          </div>
        )}

        <Row className="mb-2 py-4">
          <Col sm="auto" md={4}>
            <h2 className="mb-0">Expo Manager</h2>
          </Col>
          <Col sm={8} md={8} className="d-flex align-items-center justify-content-end">
            <button className="btn btn-dark mr-2" onClick={this.selectExpoDirectory}>
              <IconFolder fill="#fff" />
              <span className="ml-2">add expo project</span>
            </button>

            <button
              className="btn btn-dark mr-2"
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
            <button className="btn btn-dark" onClick={this.test}>
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
            <ProjectInfo
              project={projectActive ? projectsInfo[projectActive] : null}
              totalCount={projects.length}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Main;
