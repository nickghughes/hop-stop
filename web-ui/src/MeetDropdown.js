import { connect } from "react-redux";
import { Dropdown, ButtonGroup, Button, Row, Col } from "react-bootstrap";
import { Map, X } from "react-bootstrap-icons";
import { dismiss_meet_me_here } from "./api";
import { useHistory } from "react-router-dom";
import { clear_banners } from "./store";

function MeetDropdown({ meetMeHeres, dispatch }) {
  let history = useHistory();

  let outgoing = meetMeHeres?.outgoing || [];
  let incoming = meetMeHeres?.incoming || [];

  function startMeetFlow() {
    let action = {
      type: "meetConfig/set",
      data: {show: true}
    }
    dispatch(action);
  }

  function dismissMeet(ev, id) {
    ev.preventDefault();
    dismiss_meet_me_here(id).then(() => {
      let meets1 = Object.assign({}, meetMeHeres);
      meets1.incoming = meets1.incoming.filter(i => i.id !== id)
      meets1.outgoing = meets1.outgoing.filter(i => i.id !== id)
      let action = {
        type: "meetMeHeres/set",
        data: meets1
      }
      dispatch(action);
    });
  }

  function visitBrewery(ev, id) {
    ev.preventDefault();
    clear_banners();
    let action = {
      type: 'brewery/set',
      data: null
    }
    dispatch(action)
    history.push(`/breweries/${id}`);
  }

  return (
    <Dropdown as={ButtonGroup}>
      <Dropdown.Toggle variant="success"><Map className="mb-1 mr-1" /></Dropdown.Toggle>
      <Dropdown.Menu align="right" style={{width: "40em"}}>
        <Dropdown.ItemText className="px-5">
          <Button variant="primary" className="btn-block" onClick={startMeetFlow}>Invite friend(s) to meet</Button>
        </Dropdown.ItemText>
        <Dropdown.Divider />
        <Dropdown.Header>Active Outgoing Invites:</Dropdown.Header>
        {
          outgoing.map(invite => 
            <Dropdown.ItemText key={invite.id}>
              <small><b>{invite.date}</b></small>
              <Row>
                <Col xs={10}>
                  You invited <b>{invite.name}</b> ({invite.email}) to <a href="#" onClick={ev => visitBrewery(ev, invite.brewery.id)}><b>{invite.brewery.name}</b></a>.
                </Col>
                <Col xs={2}>
                  <a href="#" onClick={ev => dismissMeet(ev, invite.id)}><X /></a>
                </Col>
              </Row>
            </Dropdown.ItemText>
          )
        }
        <Dropdown.Divider />
        <Dropdown.Header>Incoming Invites:</Dropdown.Header>
        {
          incoming.map(invite => 
            <Dropdown.ItemText key={invite.id}>
              <small><b>{invite.date}</b></small>
              <Row>
                <Col xs={10}>
                  <b>{invite.name}</b> ({invite.email}) invited you to join them at <a href="#" onClick={ev => visitBrewery(ev, invite.brewery.id)}><b>{invite.brewery.name}</b></a>.
                </Col>
                <Col xs={2}>
                  <a href="#" onClick={ev => dismissMeet(ev, invite.id)}><X /></a>
                </Col>
              </Row>
            </Dropdown.ItemText>
          )
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default connect(({ meetMeHeres }) => ({ meetMeHeres }))(MeetDropdown);