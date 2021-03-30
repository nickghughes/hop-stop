import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { api_login } from './api';

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  
  function onSubmit(ev) {
    ev.preventDefault();
    api_login(email, pass);
  }

  function submitDisabled() {
    return email.length === 0 || pass.length === 0;
  }

  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Col>
          <Form.Group>
            <Form.Control type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} placeholder="Email" />
          </Form.Group>
          <Form.Group>
            <Form.Control type="password" value={pass} onChange={(ev) => setPass(ev.target.value)} placeholder="Password" />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={submitDisabled()}> Login </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Login;