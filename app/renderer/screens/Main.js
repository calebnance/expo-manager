import React from 'react';
import Store from 'electron-store';
import { alertNewProject, isExpoProject, projectExists } from '../utilities';

// components
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ProjectInfo from '../components/ProjectInfo';

// icons
import IconFolder from '../icons/Folder';
import IconRefresh from '../icons/Refresh';

// data
const localStore = new Store();

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

    // does project already exist?
    if (projectExists(projectsInfo, selectedPath)) {
      // set to active project
      this.setState({
        projectActive: directory
      });

      return false;
    }

    // is expo project + data?
    const expoData = isExpoProject(selectedPath);

    // not an expo project
    if (expoData.expo === false) {
      // alert user
      shell.beep();
      this.setState({
        showToast: true
      });

      return false;
    }

    // this is an expo project!
    projects.push(directory);

    // set project info
    const info = {
      [directory]: {
        ...expoData
      }
    };
    const newProjectsInfo = Object.assign(projectsInfo, info);

    // update local storage for projects
    localStore.set('expoProjects', projects);
    localStore.set('expoProjectsInfo', newProjectsInfo);

    // alert user of new project added!
    alertNewProject(expoData);

    this.setState({
      projectActive: directory,
      projects,
      projectsInfo: newProjectsInfo
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

  updateProjectsData = () => {
    const { projects, projectsInfo } = this.state;

    // loop through all projects and update data to most current
    Object.values(projectsInfo).map((project, index) => {
      const { path } = project;

      // get expo project data
      const expoData = isExpoProject(path);
      const directory = projects[index];

      // set project info
      const info = {
        [directory]: {
          ...expoData
        }
      };
      const newProjectsInfo = Object.assign(projectsInfo, info);

      // update local storage for projects
      localStore.set('expoProjectsInfo', newProjectsInfo);

      this.setState({
        projectsInfo: newProjectsInfo
      });
    });
  };

  projectInfoCB = removeProject => {
    const { projects, projectsInfo } = this.state;

    // remove from key array
    const projectIndex = projects.indexOf(removeProject);
    projects.splice(projectIndex, 1);

    // remove from data obj
    delete projectsInfo[removeProject];

    // update local storage for projects
    localStore.set('expoProjects', projects);
    localStore.set('expoProjectsInfo', projectsInfo);

    this.setState({
      projectActive: null,
      projects,
      projectsInfo
    });
  };

  render() {
    // const { user } = this.props;
    const { projectActive, projects, projectsInfo, showToast } = this.state;

    return (
      <Container fluid>
        <Row className="mb-4 pt-4 pb-3 nav-header">
          {showToast && (
            <div aria-live="polite" aria-atomic="true" className="container-toast">
              <Toast
                autohide
                delay={7000}
                className="toast-error"
                onClose={() => this.setState({ showToast: false })}
                show={showToast}
              >
                <Toast.Header>
                  <strong className="mr-auto">Whoops</strong>
                  <small>just now</small>
                </Toast.Header>
                <Toast.Body>
                  Looks like this isn&apos;t the <strong>root directory</strong> of an{' '}
                  <strong>Expo</strong> app. Try another directory.
                </Toast.Body>
              </Toast>
            </div>
          )}

          <Col sm="auto" md={4}>
            <h2 className="mb-0">Expo Manager</h2>
          </Col>
          <Col sm={8} md={8} className="d-flex align-items-center justify-content-end">
            {projects && (
              <div className="mr-4">
                <strong>Total projects:</strong> <Badge variant="success">{projects.length}</Badge>
              </div>
            )}

            <button className="btn btn-dark mr-2" onClick={this.selectExpoDirectory}>
              <IconFolder />
              <span className="ml-2">add expo project</span>
            </button>

            <button className="btn btn-dark mr-2" onClick={this.updateProjectsData}>
              <IconRefresh />
              <span className="ml-2">update projects data</span>
            </button>

            {/*
              <button
                className="btn btn-dark"
                onClick={() => isExpoProject('/Applications/MAMP/htdocs/expo/expo-netflix')}
              >
                single package
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
            */}
          </Col>
        </Row>

        <Row>
          <Col sm="auto" md={3}>
            <ul className="list-group">
              {projects &&
                projects.map(item => {
                  const details = projectsInfo[item];
                  const iconPath = `${details.path}/${details.icon}`;
                  const isActive = projectActive === item ? ' active' : '';

                  return (
                    <li
                      className={`cursor-pointer list-group-item list-group-item-action d-flex align-items-center${isActive}`}
                      key={item}
                      onClick={() => this.onProjectSelect(item)}
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

          <Col sm={8} md={9} className="pl-0">
            <ProjectInfo
              callBack={this.projectInfoCB}
              project={projectActive ? projectsInfo[projectActive] : null}
              projectActive={projectActive}
              totalCount={projects.length}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Main;
