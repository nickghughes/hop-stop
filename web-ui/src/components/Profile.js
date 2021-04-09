import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Row, Col, Form, Button, Spinner, Image } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { edit_profile, pfp_path } from '../api';
import { clear_banners } from '../store';

function EditProfile({ user, returnToView }) {
  const [pfp, setPfp] = useState();
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);

  function submit(ev) {
    ev.preventDefault();

    let data = Object.assign({}, user, {
      email, name, bio, pfp
    });

    edit_profile(data).then((resp) => {
      returnToView();
    })
  }

  return <div>
    <Form onSubmit={submit}>
      <Form.Group>
        <Form.Label>Profile Photo</Form.Label>
        <Form.Control type="file" id="pfp" onChange={(ev) => setPfp(ev.target.files[0])} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Bio</Form.Label>
        <Form.Control as="textarea" value={bio} onChange={(ev) => setBio(ev.target.value)} />
      </Form.Group>
      <Row>
        <Col className="text-center">
          <Button type="submit" variant="info"> Save Changes </Button>
        </Col>
      </Row>
    </Form>
  </div>
}

function ViewProfile({ user }) {
  return <div>
    <Row className="mb-3">
      <Col className="text-center">
        <h2>My Profile</h2>
      </Col>
    </Row>
    <Row className={user.pfp_hash ? "" : "text-center"}>
      { user.pfp_hash &&
        <Col md={{span: 2, offset: 4}}>
          <Image className="w-100" src={pfp_path(user.pfp_hash)} />
        </Col>
      }
      <Col>
        <Row>
          <Col>
            <b>Name: </b> {user.name}
          </Col>
        </Row>
        <Row>
          <Col>
            <b>Email: </b> {user.email}
          </Col>
        </Row>
        <hr />
        <Row className="my-2">
          <Col>
            {user.bio}
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
}

function Profile({ user }) {
  let history = useHistory();

  const [editing, setEditing] = useState(false);

  function goBack() {
    clear_banners();
    history.push("/");
  }

  function edit() {
    clear_banners();
    setEditing(true);
  }

  return <div>
    <Row className="mb-4">
      <Col>
        <Button onClick={goBack} className="mr-3"><span><ArrowLeft className="mb-1" /> Back to Home </span></Button>
        {editing && <Button variant="secondary" onClick={() => setEditing(false)}><span><ArrowLeft className="mb-1" /> Back to View </span></Button>}
      </Col>
    </Row>
    {user ? (editing ? 
      <EditProfile user={user} returnToView={() => setEditing(false)} /> :
      <div>
        <Row className="mb-5">
          <Col>
            <ViewProfile user={user} />
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <Button variant="info" onClick={edit}> Edit </Button>
          </Col>
        </Row>
      </div>) : 
      <Row>
        <Col className="text-center">
          <Spinner animation="border" variant="primary" />
        </Col>
      </Row>
    }
  </div>
}

export default connect(({user}) => ({user}))(Profile);