import { connect } from "react-redux";
import { useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { fetch_breweries, next_breweries } from "./api";
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