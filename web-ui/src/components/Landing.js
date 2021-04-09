import { connect } from 'react-redux';
import Login from './Login';
import Register from './Register';
import Search from './Search';
import { Row, Col } from 'react-bootstrap';

function Landing({ session }) {
  return session ? <Search /> :
    <div>
      <Row>
        <Col className="text-center">
          <h2>Welcome to Hop Stop!</h2>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <h3> To start finding breweries, please: </h3>
        </Col>
      </Row>
      <Row>
        <Col lg={5}>
          <Row>
            <Col className="text-center">
              <h4>Login</h4>
            </Col>
          </Row>
          <Login />
        </Col>
        <Col lg={2} className="text-center">
          <h4> or </h4>
        </Col>
        <Col lg={5}>
          <Row>
            <Col className="text-center">
              <h4>Register</h4>
            </Col>
          </Row>
          <Register />
        </Col>
      </Row>
    </div>
}

export default connect(({session}) => ({session}))(Landing);