import React from 'react';
import PropTypes from 'prop-types';

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
  render() {
    const { project } = this.props;
    console.log(project);

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
                    <Button variant="secondary">1</Button>
                    <Button variant="secondary">Check for package updates</Button>
                    <DropdownButton alignRight as={ButtonGroup} title="More..." variant="secondary">
                      <Dropdown.Item eventKey="1">Check for package updates</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
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
  project: null
};

ProjectInfo.propTypes = {
  // optional
  project: PropTypes.shape({
    appVersion: PropTypes.string,
    description: PropTypes.string,
    sdk: PropTypes.number
  })
};

export default ProjectInfo;
