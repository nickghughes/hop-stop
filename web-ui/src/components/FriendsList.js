import { Dropdown, ButtonGroup, Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { People, Map, Check, X } from 'react-bootstrap-icons';
import { connect } from 'react-redux';
import { useState } from 'react';
import { respond_friend_request, send_friend_request } from '../api';

function FriendsList({ friends, dispatch }) {
  const [email, setEmail] = useState("");

  function sendRequest() {
    send_friend_request(email).then(() => {
      setEmail("");
    });
  }

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
    <Dropdown.Menu align="right">
      <Dropdown.ItemText>
      <InputGroup className="my-2 friends-list">
          <Form.Control type="email" value={email} placeholder="Add friends..." onChange={(ev) => setEmail(ev.target.value)}/>
          <InputGroup.Append>
            <Button onClick={sendRequest}>Add</Button>
          </InputGroup.Append>
        </InputGroup>
      </Dropdown.ItemText>
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
              <a href="#" onClick={(ev) => respondToRequest(ev, r, false)} className="text-danger"><X className="icon-lg" /></a>
            </Col>
            <Col xs={2}>
              <a href="#" onClick={(ev) => respondToRequest(ev, r, true)} className="text-success"><Check className="icon-lg" /></a>
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