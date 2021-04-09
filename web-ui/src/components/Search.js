import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Map from './Map';
import Feed from './Feed';

function Search({results, coords, dispatch}) {
  return (
    <Row>
      <Col>
        <Map />
      </Col>
      <Col>
        <Feed />
      </Col>
    </Row>
  );
}

export default connect(({results, coords}) => ({results, coords}))(Search);