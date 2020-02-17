import React from 'react';
import PropTypes from 'prop-types';
const { exec } = require('child_process');
const { remote } = require('electron');
const { shell } = remote;

// components
// import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Row from 'react-bootstrap/Row';

class ProjectInfo extends React.Component {
  constructor(props) {
    super(props);

    this.checkForUpdates = this.checkForUpdates.bind(this);
    this.openAtom = this.openAtom.bind(this);
    this.openVSCode = this.openVSCode.bind(this);
    this.openDir = this.openDir.bind(this);
    this.openGitHub = this.openGitHub.bind(this);
  }

  checkForUpdates() {
    const { project } = this.props;

    console.log('checkForUpdates()');
    console.log('-----------------');
    console.log('-----------------');
    exec(`cd ${project.path} && yarn outdated expo --json`, (error, stdout, stderr) => {
      // console.log(error);
      // console.log('error');
      // console.log('=======================');
      // console.log(typeof stdout);
      // console.log(stdout);
      // console.log(stderr);
      const res = stdout.split('\n');
      console.log('-----------------');
      console.log('-------res-------');
      console.log(res);
      console.log(res[0]);
      console.log(res.length);
      console.log('-----------------');
      console.log('-----------------');
      if (res.length > 1) {
        const json = JSON.parse(res[1]);

        console.log('======json=======');
        console.log('json');
        console.log(json);
        console.log('=================');
        console.log('=================');
        console.log('=================');
      }
      // exec(`cd ${project.path} && yarn upgrade expo`, (error, stdout, stderr) => {
      //   console.log('=================');
      //   console.log('=================');
      //   console.log('=================');
      //   console.log('error', error);
      //   console.log('stdout', stdout);
      //   console.log('stderr', stderr);
      //   console.log('=================');
      //   console.log('=================');
      //   console.log('=================');
      // });
      // const json = JSON.parse(stdout);
      // console.log('stdout', json.type);
      // console.log('json', json);
      // console.log(JSON.parse(JSON.stringify(stdout)));
      // console.log(stderr);
      // console.log('---------------------');
    });
  }

  openAtom() {
    const { project } = this.props;

    // open in atom editor
    exec(`cd ${project.path} && atom .`);
  }

  openVSCode() {
    const { project } = this.props;

    // open in vscode editor
    exec(`cd ${project.path} && code .`);
  }

  openDir() {
    const { project } = this.props;

    // open item in finder/explorer
    shell.showItemInFolder(project.path);
  }

  openGitHub() {
    const { project } = this.props;

    // open url
    shell.openExternal(project.githubUrl);
  }

  render() {
    const { project, totalCount } = this.props;

    // if no projects added yet
    if (totalCount === 0) {
      return null;
    }

    return (
      <Card>
        <Card.Body>
          {!project && `Please select a project`}

          {project && (
            <React.Fragment>
              <Row className="mb-2">
                <Col>
                  <h3>{project.name}</h3>
                </Col>
                <Col className="d-flex align-items-center justify-content-end">
                  <ButtonGroup>
                    <Button onClick={this.checkForUpdates} variant="secondary">
                      Check for package updates
                    </Button>
                    <DropdownButton alignRight as={ButtonGroup} title="More..." variant="secondary">
                      <Dropdown.Item onClick={this.openAtom}>Open with Atom</Dropdown.Item>
                      <Dropdown.Item onClick={this.openVSCode}>Open with VSCode</Dropdown.Item>
                      <Dropdown.Item onClick={this.openDir}>Open project directory</Dropdown.Item>
                      {project.githubUrl && (
                        <Dropdown.Item onClick={this.openGitHub}>Open on GitHub</Dropdown.Item>
                      )}
                    </DropdownButton>
                  </ButtonGroup>
                </Col>
              </Row>
              <div>
                <p>{project.description}</p>
                <p>App Version: {project.appVersion}</p>
                <p>Expo SDK: {project.sdk}</p>
              </div>
            </React.Fragment>
          )}
        </Card.Body>
      </Card>
    );
  }
}

ProjectInfo.defaultProps = {
  project: null,
  totalCount: 0
};

ProjectInfo.propTypes = {
  // optional
  project: PropTypes.shape({
    appVersion: PropTypes.string,
    description: PropTypes.string,
    sdk: PropTypes.number
  }),
  totalCount: PropTypes.number
};

export default ProjectInfo;
