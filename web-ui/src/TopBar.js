import logo from './logo.png';
import { connect } from 'react-redux';
import { PencilSquare, BoxArrowRight, PersonCircle } from 'react-bootstrap-icons';
import { Row, Col, Alert, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { clear_banners } from './store';

let AccountDropdown = connect(({session}) => ({session}))(({session, dispatch}) => {
  let history = useHistory();

  function logout() {
    clear_banners();
    history.push("/");
    dispatch({type: 'session/clear'});
  }
  return <Dropdown as={ButtonGroup}>
    <Dropdown.Toggle><PersonCircle className="mb-1 mr-1" /></Dropdown.Toggle>
    <Dropdown.Menu>
      <Dropdown.Header>Logged in as: {session.name}</Dropdown.Header>
      <Dropdown.Divider />
      {/* <Dropdown.Item as="button"><span className="mr-2"><PencilSquare /></span>Edit Profile</Dropdown.Item> */}
      <Dropdown.Item as="button" onClick={logout}><span className="mr-2"><BoxArrowRight /></span>Logout</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
});

function TopBar({session, error, info, success}) {

  return (
    <div>
      <Row className="my-3">
        <Col xs={3}>
          <img src={logo} />
        </Col>
        {session && 
          <Col xs={9} className="text-right">
            <AccountDropdown />
          </Col>
        }
      </Row>
      {success &&
        <Row>
          <Col>
            <Alert variant="success">{success}</Alert>
          </Col>
        </Row>
      }
      {info &&
        <Row>
          <Col>
            <Alert variant="info">{info}</Alert>
          </Col>
        </Row>
      }
      {error &&
        <Row>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      }
    </div>
  )
}

export default connect(({session, error, info, success}) => ({session, error, info, success}))(TopBar);