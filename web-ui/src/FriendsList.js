import { Dropdown, ButtonGroup, Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { People, Map, Check, X } from 'react-bootstrap-icons';
import { connect } from 'react-redux';
import { forwardRef, useState, Children } from 'react';
import { respond_friend_request, send_friend_request } from './api';

function FriendsList({ friends, dispatch }) {

  const CustomMenu = forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [email, setEmail] = useState("");

      function sendRequest() {
        send_friend_request(email).then(() => {
          setEmail("");
        });
      }

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <InputGroup className="mx-3 my-2" style={{width: "16em"}}>
            <Form.Control type="email" value={email} placeholder="Add friends..." onChange={(ev) => setEmail(ev.target.value)}/>
            <InputGroup.Append>
              <Button onClick={sendRequest}>Add</Button>
            </InputGroup.Append>
          </InputGroup>
          <ul className="list-unstyled">
            { Children.toArray(children) }
          </ul>
        </div>
      );
    },
  );

  function inviteFriend(ev, friend) {
    ev.preventDefault();
    let action = {
      type: "meetConfig/set",
      data: {
        show: true,
        users: [friend]
      }
    }
    dispatch(action);
  }

  function respondToRequest(ev, request, response) {
    ev.preventDefault();
    respond_friend_request(request, response);
  }

  let pendingFriends = friends?.pending_friends || [];
  let pendingRequests = friends?.pending_requests || [];
  let addedFriends = friends?.friends || [];
  return <Dropdown as={ButtonGroup}>
    <Dropdown.Toggle variant="info"><People className="mb-1 mr-1" /></Dropdown.Toggle>
    <Dropdown.Menu as={CustomMenu} align="right">
      <Dropdown.Divider />
      <Dropdown.Header>Waiting for responses from:</Dropdown.Header>
      {pendingFriends.map(r => 
        <Dropdown.Item disabled key={r.id}>
          <Row>
            <Col>
              <b>{r.name}</b> ({r.email})
            </Col>
          </Row>
        </Dropdown.Item>
      )}
      <Dropdown.Divider />
      <Dropdown.Header>Incoming Requests:</Dropdown.Header>
      {pendingRequests.map(r => 
        <Dropdown.ItemText key={r.id}>
          <Row>
            <Col xs={8}>
              <b>{r.name}</b> ({r.email})
            </Col>
            <Col xs={2}>
              <a href="#" onClick={(ev) => respondToRequest(ev, r, false)} className="text-danger"><X style={{height: "1.5em", width: "1.5em"}}/></a>
            </Col>
            <Col xs={2}>
              <a href="#" onClick={(ev) => respondToRequest(ev, r, true)} className="text-success"><Check style={{height: "1.5em", width: "1.5em"}} /></a>
            </Col>
          </Row>
        </Dropdown.ItemText>
      )}
      <Dropdown.Divider />
      <Dropdown.Header>Friends:</Dropdown.Header>
      {addedFriends.map(f => 
        <Dropdown.ItemText key={f.id}>
          <Row>
            <Col xs={10}>
              <b>{f.name}</b> ({f.email})
            </Col>
            <Col xs={2}>
              <a href="#" onClick={(ev) => inviteFriend(ev, f)}><Map /></a>
            </Col>
          </Row>
        </Dropdown.ItemText>
      )}
    </Dropdown.Menu>
  </Dropdown>
}

export default connect(({ friends }) => ({ friends }))(FriendsList);