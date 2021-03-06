import logo from '../assets/logo.png';
import { connect } from 'react-redux';
import { PencilSquare, BoxArrowRight, PersonCircle } from 'react-bootstrap-icons';
import { Row, Col, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { clear_banners } from '../store';
import DismissibleAlert from './util/DismissibleAlert';
import FriendsList from './FriendsList';
import MeetDropdown from './MeetDropdown';
import { leave_channel } from '../socket';

let AccountDropdown = connect(({session}) => ({session}))(({session, dispatch}) => {
  let history = useHistory();

  function logout() {
    clear_banners();
    history.push("/");
    leave_channel();
    dispatch({type: 'session/clear'});
  }

  function profile() {
    clear_banners();
    history.push("/profile");
  }

  return <Dropdown as={ButtonGroup}>
    <Dropdown.Toggle><PersonCircle className="mb-1 mr-1" /></Dropdown.Toggle>
    <Dropdown.Menu align="right">
      <Dropdown.Header>Logged in as: {session.name}</Dropdown.Header>
      <Dropdown.Divider />
      <Dropdown.Item as="button" onClick={profile}><span className="mr-2"><PencilSquare /></span>Go to Profile</Dropdown.Item>
      <Dropdown.Item as="button" onClick={logout}><span className="mr-2"><BoxArrowRight /></span>Logout</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
});

function TopBar({session, error, info, success}) {

  return (
    <div>
      <Row className="my-3">
        <Col xs={3}>
          <img src={logo} className="logo" alt="logo"/>
        </Col>
        {session && 
          <Col xs={{offset: 5, span: 4}}>
            <Row>
              <Col xs={4} className="text-right">
                <MeetDropdown />
              </Col>
              <Col xs={4} className="text-right">
                <FriendsList />
              </Col>
              <Col xs={4} className="text-right">
                <AccountDropdown />
              </Col>
            </Row>
          </Col>
        }
      </Row>
      {success &&
        <Row>
          <Col>
            <DismissibleAlert variant="success" message={success} />
          </Col>
        </Row>
      }
      {info &&
        <Row>
          <Col>
            <DismissibleAlert variant="info" message={info} />
          </Col>
        </Row>
      }
      {error &&
        <Row>
          <Col>
            <DismissibleAlert variant="danger" message={error} />
          </Col>
        </Row>
      }
    </div>
  )
}

export default connect(({session, error, info, success}) => ({session, error, info, success}))(TopBar);